# gastos/serializers.py
from rest_framework import serializers
from .models import Presupuesto, Gasto


# Se encarga de convertir los datos del modelo en JSON y viceversa,
# además de aplicar validaciones personalizadas antes de guardar.
class PresupuestoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presupuesto
        fields = ['id', 'nombre_presupuesto', 'fecha_inicio', 'fecha_fin', 'monto_total', 'monto_restante']
        read_only_fields = ['monto_restante']
    # Validación individual para el campo 'nombre_presupuesto'
    def validate_nombre_presupuesto(self, value):
        if not value.strip():
            raise serializers.ValidationError("El nombre del presupuesto no puede estar vacío.")
        return value
    # Validación individual para el campo 'monto_total'
    def validate_monto_total(self, value):
        if value < 100:
            raise serializers.ValidationError("El monto mínimo del presupuesto debe ser de S/ 100.")
        return value
    # Validación general (de varios campos a la vez)
    def validate(self, data):
        if data['fecha_fin'] < data['fecha_inicio']:
            raise serializers.ValidationError("La fecha de fin no puede ser menor a la fecha de inicio.")
        return data
     # Sobrescribe el método create para asignar monto_restante igual al monto_total al crear el presupuesto
    def create(self, validated_data):
        validated_data['monto_restante'] = validated_data['monto_total']
        return super().create(validated_data)

# Convierte datos de gastos a formato JSON y viceversa,
# incluye validaciones antes de guardar el gasto.
class GastoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gasto
        fields = ['id', 'presupuesto', 'descripcion', 'monto', 'fecha']
        extra_kwargs = {
            'presupuesto': {'required': False}
        }

    def validate(self, data):
        presupuesto = data.get('presupuesto')  # ✅ ya no lanza error si no se envía
        monto = data['monto']

        if monto <= 0:
            raise serializers.ValidationError("El monto debe ser mayor que cero.")

        if not data.get('descripcion') or not data['descripcion'].strip():
            raise serializers.ValidationError("La descripción no puede estar vacía.")

        # Esta validación solo se ejecuta si `presupuesto` está presente
        if presupuesto and monto > presupuesto.monto_restante:
            raise serializers.ValidationError(
                f"No puedes registrar un gasto mayor al monto restante (S/ {presupuesto.monto_restante})."
            )

        return data
