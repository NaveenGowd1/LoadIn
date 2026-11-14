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
        

from rest_framework.permissions import IsAuthenticated
from .serializers import (
    CustomerRegisterSerializer,
    DriverRegisterSerializer,
    CustomerProfileSerializer,
)


class CustomerProfileAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsAuthenticated, IsCustomer]

    def get_object(self):
        return self.request.user