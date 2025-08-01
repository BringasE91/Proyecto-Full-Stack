from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Gasto, Presupuesto
from .serializers import PresupuestoSerializer, GastoSerializer


# Crear o ver presupuestos del usuario
class PresupuestoView(generics.ListCreateAPIView):
    serializer_class = PresupuestoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Presupuesto.objects.filter(usuario=self.request.user)

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class PresupuestoDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PresupuestoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Presupuesto.objects.filter(usuario=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()


# Registrar nuevo gasto
class GastoCreateView(generics.CreateAPIView):
    serializer_class = GastoSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        presupuesto_id = self.kwargs['presupuesto_id']
        try:
            presupuesto = Presupuesto.objects.get(id=presupuesto_id, usuario=self.request.user)
        except Presupuesto.DoesNotExist:
            raise PermissionDenied("Presupuesto no encontrado o no te pertenece.")

        # Validar antes de crear
        if serializer.validated_data['monto'] > presupuesto.monto_restante:
            raise ValidationError("El monto del gasto excede el presupuesto disponible.")

        gasto = serializer.save(presupuesto=presupuesto)

        # Recalcular monto_restante de forma robusta
        presupuesto.actualizar_monto_restante()


class GastoUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = GastoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        presupuesto_id = self.kwargs['presupuesto_id']
        return Gasto.objects.filter(presupuesto__id=presupuesto_id, presupuesto__usuario=self.request.user)

    def perform_update(self, serializer):
        gasto = self.get_object()
        presupuesto = gasto.presupuesto
        nuevo_monto = serializer.validated_data.get('monto', gasto.monto)
        diferencia = nuevo_monto - gasto.monto

        if presupuesto.monto_restante - diferencia < 0:
            raise ValidationError("El nuevo monto excede el presupuesto disponible.")

        serializer.save()
        presupuesto.actualizar_monto_restante()


class GastoDeleteView(generics.DestroyAPIView):
    serializer_class = GastoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        presupuesto_id = self.kwargs['presupuesto_id']
        return Gasto.objects.filter(presupuesto__id=presupuesto_id, presupuesto__usuario=self.request.user)

    def perform_destroy(self, instance):
        presupuesto = instance.presupuesto
        instance.delete()
        presupuesto.actualizar_monto_restante()


class GastosPorPresupuestoView(generics.ListAPIView):
    serializer_class = GastoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        presupuesto_id = self.kwargs['presupuesto_id']
        presupuesto = Presupuesto.objects.get(id=presupuesto_id)

        if presupuesto.usuario != self.request.user:
            raise PermissionDenied("No puedes acceder a este presupuesto.")

        return Gasto.objects.filter(presupuesto=presupuesto)


class ResumenPorPresupuestoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, presupuesto_id):
        try:
            presupuesto = Presupuesto.objects.get(id=presupuesto_id)
        except Presupuesto.DoesNotExist:
            return Response({"error": "Presupuesto no encontrado."}, status=404)

        if presupuesto.usuario != request.user:
            raise PermissionDenied("No puedes ver este presupuesto.")

        # Siempre recalcular por seguridad
        presupuesto.actualizar_monto_restante()

        gastos = presupuesto.gastos.all()
        total_gastado = sum(g.monto for g in gastos)

        gastos_por_fecha = {}
        for gasto in gastos:
            fecha_str = gasto.fecha.strftime('%Y-%m-%d')
            gastos_por_fecha[fecha_str] = gastos_por_fecha.get(fecha_str, 0) + float(gasto.monto)

        return Response({
            "presupuesto_id": presupuesto.id,
            "presupuesto_total": float(presupuesto.monto_total),
            "gastado": float(total_gastado),
            "restante": float(presupuesto.monto_restante),
            "rango_fechas": f"{presupuesto.fecha_inicio} a {presupuesto.fecha_fin}",
            "gastos_por_fecha": gastos_por_fecha
        })
