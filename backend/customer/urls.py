from django.urls import path
from .views import CustomerDashboardAPIView


urlpatterns = [
    path(
        "dashboard/",
        CustomerDashboardAPIView.as_view(),
        name="customer-dashboard"
    ),
]