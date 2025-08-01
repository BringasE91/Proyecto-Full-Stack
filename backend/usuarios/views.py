from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Usuario
from .serializers import (
    UsuarioSerializer,
    RegistroSerializer,
    CustomTokenObtainPairSerializer,
)

# Vista para registrar un usuario (sin generar tokens)
class RegistroView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            },
            'message': 'Usuario registrado correctamente. Ahora puedes iniciar sesión.'
        }, status=status.HTTP_201_CREATED)

# Vista para hacer logout (revocar token refresh)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

# Vista para login (obtener access y refresh tokens)
class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
