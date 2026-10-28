from rest_framework import generics

from rest_framework_simplejwt.views import TokenObtainPairView
from .jwt_serializer import CustomTokenObtainPairSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

from .permissions import IsCustomer, IsDriver, IsAdmin


from .serializers import (
    CustomerRegisterSerializer,
    DriverRegisterSerializer,
)


class CustomerRegisterAPIView(generics.CreateAPIView):
    serializer_class = CustomerRegisterSerializer


class DriverRegisterAPIView(generics.CreateAPIView):
    serializer_class = DriverRegisterSerializer
    


class LoginAPIView(TokenObtainPairView):

    serializer_class = CustomTokenObtainPairSerializer
    


class CustomerDashboardAPIView(APIView):

    permission_classes = [IsCustomer]

    def get(self, request):

        return Response(
            {
                "message": "Welcome Customer!"
            }
        )
        
class DriverDashboardAPIView(APIView):

    permission_classes = [IsDriver]

    def get(self, request):

        return Response(
            {
                "message": "Welcome Driver!"
            }
        )
        
class AdminDashboardAPIView(APIView):

    permission_classes = [IsAdmin]

    def get(self, request):

        return Response(
            {
                "message": "Welcome Admin!"
            }
        )