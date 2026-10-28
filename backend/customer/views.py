from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.permissions import IsCustomer
from loads.models import Load
from loads.serializers import LoadSerializer


class CustomerDashboardAPIView(generics.GenericAPIView):

    permission_classes = [
        IsAuthenticated,
        IsCustomer,
    ]

    def get(self, request):
        
        customer = request.user

        loads = Load.objects.filter(customer=customer)
        
        recent_loads = loads.order_by("-created_at")[:5]

        total_loads = loads.count()

        available_loads = loads.filter(
            status=Load.Status.AVAILABLE
        ).count()

        assigned_loads = loads.filter(
            status=Load.Status.ASSIGNED
        ).count()

        in_transit_loads = loads.filter(
            status=Load.Status.IN_TRANSIT
        ).count()

        delivered_loads = loads.filter(
            status=Load.Status.DELIVERED
        ).count()

        return Response({
            "customer": {
                "email": customer.email,
                "phone_number": customer.phone_number,
            },

            "statistics": {
                "total_loads": total_loads,
                "available": available_loads,
                "assigned": assigned_loads,
                "in_transit": in_transit_loads,
                "delivered": delivered_loads,
            },

            "recent_loads": LoadSerializer(
                recent_loads,
                many=True
            ).data
        })