from django.urls import path

from .views import (
    AdminDashboardAPIView,
    CustomerDashboardAPIView,
    CustomerRegisterAPIView,
    DriverRegisterAPIView,
    DriverDashboardAPIView,
    LoginAPIView,
)

urlpatterns = [

    path(
        "customer/register/",
        CustomerRegisterAPIView.as_view(),
        name="customer-register",
    ),

    path(
        "driver/register/",
        DriverRegisterAPIView.as_view(),
        name="driver-register",
    ),

    path(
        "login/",
        LoginAPIView.as_view(),
        name="login",
    ),
    
    path(
        "customer/dashboard/",
        CustomerDashboardAPIView.as_view(),
    ),

    path(
        "driver/dashboard/",
        DriverDashboardAPIView.as_view(),
    ),
    path(
        "admin/dashboard/",
        AdminDashboardAPIView.as_view(),
    ),
]