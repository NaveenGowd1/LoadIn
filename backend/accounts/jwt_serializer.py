from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    role = serializers.CharField(write_only=True)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["email"] = user.email

        return token

    def validate(self, attrs):

        requested_role = attrs.pop("role")

        data = super().validate(attrs)

        if self.user.role != requested_role:
            raise AuthenticationFailed(
                f"This account is registered as a {self.user.role.lower()}. Please use the correct login page."
            )

        data["user"] = {
            "id": self.user.id,
            "email": self.user.email,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
            "role": self.user.role,
        }

        return data