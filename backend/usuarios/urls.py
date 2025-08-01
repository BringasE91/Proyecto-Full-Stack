from django.urls import path
from .views import RegistroView, LogoutView, CustomLoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('registro/', RegistroView.as_view(), name='registro'),
    path('login/', CustomLoginView.as_view(), name='login'),  # ahora usa la tuya
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
