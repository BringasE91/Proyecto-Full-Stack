# gastos/models.py
from django.db import models
from usuarios.models import Usuario
from datetime import date

# Modelo que representa un presupuesto asociado a un usuario.
# Incluye información como nombre, fechas de inicio y fin, monto total y monto restante.
class Presupuesto(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='presupuestos')
    nombre_presupuesto = models.CharField(max_length=100)
    fecha_inicio = models.DateField(default=date.today)
    fecha_fin = models.DateField()
    monto_total = models.DecimalField(max_digits=10, decimal_places=2)
    monto_restante = models.DecimalField(max_digits=10, decimal_places=2)
    
    def actualizar_monto_restante(self):
        total_gastado = sum(gasto.monto for gasto in self.gastos.all())
        self.monto_restante = self.monto_total - total_gastado
        self.save()

    def __str__(self):
        return f"{self.nombre_presupuesto} - Del {self.fecha_inicio} al {self.fecha_fin} - S/ {self.monto_total}"

# Modelo que representa un gasto individual asociado a un presupuesto.
# Incluye descripción, monto y la fecha en que se realizó el gasto.
class Gasto(models.Model):
    presupuesto = models.ForeignKey(Presupuesto, on_delete=models.CASCADE, related_name='gastos')
    descripcion = models.CharField(max_length=100)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha = models.DateField(default=date.today)

    def __str__(self):
        return f"{self.descripcion} - S/ {self.monto}"
