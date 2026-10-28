from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import authenticate


class BaseRegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser

        fields = (
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "password",
            "confirm_password",
        )

    def validate(self, attrs):

        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"password": "Passwords do not match."}
            )

        return attrs


class CustomerRegisterSerializer(BaseRegisterSerializer):

    def create(self, validated_data):

        validated_data.pop("confirm_password")

        return CustomUser.objects.create_user(
            role=CustomUser.Role.CUSTOMER,
            **validated_data
        )


class DriverRegisterSerializer(BaseRegisterSerializer):

    def create(self, validated_data):

        validated_data.pop("confirm_password")

        return CustomUser.objects.create_user(
            role=CustomUser.Role.DRIVER,
            **validated_data
        )
        
    from django.contrib.auth import authenticate


# class LoginSerializer(serializers.Serializer):

#     email = serializers.EmailField()
#     password = serializers.CharField(write_only=True)
#     role = serializers.CharField(write_only=True)

#     def validate(self, attrs):

#         email = attrs.get("email")
#         password = attrs.get("password")
#         role = attrs.get("role")

#         user = authenticate(
#             email=email,
#             password=password
#         )

#         if user is None:
#             raise serializers.ValidationError(
#                 "Invalid email or password."
#             )

#         if user.role != role:
#             raise serializers.ValidationError(
#                 f"This account is registered as a {user.role.lower()}. Please use the correct login page."
#             )

#         attrs["user"] = user

#         return attrs