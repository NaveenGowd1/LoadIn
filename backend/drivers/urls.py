from django.urls import path

from .views import (
    CreateDriverProfileAPIView,
    GetDriverProfileAPIView,
    UpdateDriverProfileAPIView,
    DriverOnboardingAPIView,
    DriverDashboardAPIView,
    VerifyDriverAPIView,
)


urlpatterns = [

    path(
        "profile/create/",
        CreateDriverProfileAPIView.as_view(),
        name="create-driver-profile",
    ),

    path(
        "profile/",
        GetDriverProfileAPIView.as_view(),
        name="get-driver-profile",
    ),

    path(
        "profile/update/",
        UpdateDriverProfileAPIView.as_view(),
        name="update-driver-profile",
    ),

    path(
        "onboarding/",
        DriverOnboardingAPIView.as_view(),
        name="driver-onboarding",
    ),

    path(
        "dashboard/",
        DriverDashboardAPIView.as_view(),
        name="driver-dashboard",
    ),
    
    path(
        "profile/<int:pk>/verify/",
        VerifyDriverAPIView.as_view(),
        name="verify-driver",
    ),
]