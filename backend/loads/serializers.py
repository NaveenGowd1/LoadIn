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

    first_name = serializers.CharField(
        source="user.first_name",
        read_only=True
    )

    last_name = serializers.CharField(
        source="user.last_name",
        read_only=True
    )

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
            "first_name",
            "last_name",
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
                "customer",
                "assigned_driver",
                "driver",
                "pickup_location",
                "pickup_latitude",
                "pickup_longitude",
                "delivery_location",
                "delivery_latitude",
                "delivery_longitude",
                "goods_description",
                "weight",
                "vehicle_type",
                "pickup_date",
                "delivery_date",
                "price",
                "status",
                "pickup_otp",
                "delivery_otp",
                "created_at",
                "updated_at",
            ]
            read_only_fields = [
                "id",
                "customer",
                "assigned_driver",
                "status",
                "pickup_otp",
                "delivery_otp",
                "created_at",
                "updated_at",
            ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if not request or request.user != instance.customer:
            data.pop("pickup_otp", None)
            data.pop("delivery_otp", None)
        return data

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

class MatchLoadsSerializer(serializers.Serializer):
    current_location = serializers.CharField(required=False, allow_blank=True)
    current_latitude = serializers.FloatField(required=False, allow_null=True)
    current_longitude = serializers.FloatField(required=False, allow_null=True)

    return_destination = serializers.CharField(required=False, allow_blank=True)
    destination_latitude = serializers.FloatField(required=False, allow_null=True)
    destination_longitude = serializers.FloatField(required=False, allow_null=True)

    radius_km = serializers.FloatField(required=False, default=30.0, min_value=1.0, max_value=500.0)
    current_location = serializers.CharField(
        max_length=255,
        trim_whitespace=True
    )

    return_destination = serializers.CharField(
        max_length=255,
        trim_whitespace=True
    )
    
class DriverLoadHistorySerializer(serializers.ModelSerializer):
    status_history = LoadStatusHistorySerializer(
        many=True,
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
            "updated_at",
            "status_history",
        ]
        
class LoadUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Load
        fields = [
            "pickup_location",
            "pickup_latitude",
            "pickup_longitude",
            "delivery_location",
            "delivery_latitude",
            "delivery_longitude",
            "goods_description",
            "weight",
            "vehicle_type",
            "pickup_date",
            "delivery_date",
            "price",
        ]

    def validate_weight(self, value):
        if value <= 0:
            raise serializers.ValidationError("Weight must be greater than 0.")
        return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Offered price must be greater than 0.")
        return value

    def validate(self, attrs):
        pickup_date = attrs.get("pickup_date", getattr(self.instance, "pickup_date", None))
        delivery_date = attrs.get("delivery_date", getattr(self.instance, "delivery_date", None))

        if pickup_date and delivery_date and delivery_date < pickup_date:
            raise serializers.ValidationError(
                {"delivery_date": "Delivery date cannot be earlier than pickup date."}
            )
        return attrs