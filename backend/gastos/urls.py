# gastos/urls.py
from django.urls import path
from .views import (
    PresupuestoView, GastoCreateView,
    GastosPorPresupuestoView, ResumenPorPresupuestoView,
    PresupuestoDetailView, GastoUpdateView, GastoDeleteView
)

# gastos/urls.py

urlpatterns = [
    # Endpoint para listar todos los presupuestos o crear uno nuevo
    path('presupuesto/', PresupuestoView.as_view(), name='presupuesto'),
    # Endpoint para obtener, actualizar o eliminar un presupuesto específico por ID
    path('presupuesto/<int:pk>/', PresupuestoDetailView.as_view(), name='detalle-presupuesto'),
     # Endpoint para listar todos los gastos asociados a un presupuesto específico
    path('presupuesto/<int:presupuesto_id>/gastos/', GastosPorPresupuestoView.as_view(), name='gastos-por-presupuesto'),
    # Endpoint para crear un nuevo gasto asociado a un presupuesto específico
    path('presupuesto/<int:presupuesto_id>/gastos/nuevo/', GastoCreateView.as_view(), name='crear-gasto'),
    # Endpoint para editar un gasto específico dentro de un presupuesto
    path('presupuesto/<int:presupuesto_id>/gastos/<int:pk>/editar/', GastoUpdateView.as_view(), name='editar-gasto'),
    # Endpoint para eliminar un gasto específico dentro de un presupuesto
    path('presupuesto/<int:presupuesto_id>/gastos/<int:pk>/eliminar/', GastoDeleteView.as_view(), name='eliminar-gasto'),
    # Endpoint que devuelve un resumen del presupuesto (por ejemplo: total, gastado, restante)
    path('presupuesto/<int:presupuesto_id>/resumen/', ResumenPorPresupuestoView.as_view(), name='resumen-por-presupuesto'),
]
