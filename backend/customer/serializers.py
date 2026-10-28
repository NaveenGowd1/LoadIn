from rest_framework import serializers
from loads.models import Load


class CustomerDashboardSerializer(serializers.Serializer):
    email = serializers.EmailField()
    phone_number = serializers.CharField()
    total_loads = serializers.IntegerField()
    available_loads = serializers.IntegerField()
    assigned_loads = serializers.IntegerField()
    in_transit_loads = serializers.IntegerField()
    delivered_loads = serializers.IntegerField()