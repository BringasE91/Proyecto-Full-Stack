from rest_framework import serializers
from .models import Usuario
import re
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import authenticate
# Serializer que muestra los datos públicos del usuario (para respuestas, no creación)
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email']
# Serializer para registrar nuevos usuarios con validaciones personalizadas
class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['email', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}} # oculta la contraseña en respuestas
    # Valida que el email tenga formato correcto
    def validate_email(self, value):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise serializers.ValidationError("Ingresa un correo válido.")
        return value
    # Valida que la contraseña tenga al menos 8 caracteres
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("La contraseña debe tener al menos 8 caracteres.")
        return value
    # Valida que el username no contenga espacios
    def validate_username(self, value):
        if " " in value:
            raise serializers.ValidationError("El nombre de usuario no debe contener espacios.")
        return value
    # Crea el usuario usando el método `create_user()` de Django
    def create(self, validated_data):
        user = Usuario.objects.create_user(**validated_data)
        return user
    
# Serializer personalizado para login con JWT que valida credenciales y devuelve info adicional
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Agregar información personalizada al token
        token['username'] = user.username
        token['email'] = user.email

        return token

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email:
            raise serializers.ValidationError({"email": "El correo es obligatorio."})
        if not password:
            raise serializers.ValidationError({"password": "La contraseña es obligatoria."})

        user = authenticate(request=self.context.get('request'), email=email, password=password)
        if not user:
            raise serializers.ValidationError({"detail": "Credenciales inválidas o el usuario no existe."})
        if not user.is_active:
            raise serializers.ValidationError({"detail": "El usuario está inactivo."})

        data = super().validate(attrs)

        # También devolver los campos en la respuesta
        data['username'] = user.username
        data['email'] = user.email
        return data
