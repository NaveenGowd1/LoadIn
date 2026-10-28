from rest_framework import serializers
from django.utils import timezone

from accounts.models import CustomUser

from .models import Load, LoadStatusHistory
# from . import LoadCustomerSerializer, LoadDriverSerializer


    
class LoadStatusHistorySerializer(serializers.ModelSerializer):

    changed_by_email = serializers.EmailField(
        source="changed_by.email",
        read_only=True
    )

    class Meta:
        model = LoadStatusHistory
        fields = [
            "status",
            "changed_by_email",
            "changed_at",
        ]
        
class LoadCustomerSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "phone_number",
        ]
        
from drivers.models import DriverProfile


class LoadDriverSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    phone_number = serializers.CharField(
        source="user.phone_number",
        read_only=True
    )

    class Meta:
        model = DriverProfile
        fields = [
            "email",
            "phone_number",
            "vehicle_number",
            "vehicle_type",
        ]
        
class LoadSerializer(serializers.ModelSerializer):

    customer = LoadCustomerSerializer(
        read_only=True
    )

    driver = LoadDriverSerializer(
        source="assigned_driver.driver_profile",
        read_only=True
    )

    class Meta:
        model = Load
        fields = [
            "id",
            "pickup_location",
            "delivery_location",
            "goods_description",
            "weight",
            "vehicle_type",
            "pickup_date",
            "delivery_date",
            "price",
            "status",
            "customer",
            "driver",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "status",
            "customer",
            "driver",
            "created_at",
        ]

    def validate(self, attrs):

        pickup_date = attrs.get("pickup_date")
        delivery_date = attrs.get("delivery_date")

        if pickup_date < timezone.now().date():
            raise serializers.ValidationError({
                "pickup_date": "Pickup date cannot be in the past."
            })

        if delivery_date < pickup_date:
            raise serializers.ValidationError({
                "delivery_date": "Delivery date cannot be before pickup date."
            })

        return attrs