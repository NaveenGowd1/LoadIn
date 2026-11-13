from rest_framework import serializers
from django.utils import timezone
from .models import DriverProfile


class DriverProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    phone_number = serializers.CharField(source="user.phone_number", read_only=True)

    class Meta:
        model = DriverProfile
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "date_of_birth",
            "address",
            "license_number",
            "license_expiry_date",
            "vehicle_number",
            "vehicle_type",
            "verification_status",
            "profile_completed",
        ]
        read_only_fields = [
            "verification_status",
            "profile_completed",
        ]

    def validate_license_expiry_date(self, value):
        if value <= timezone.now().date():
            raise serializers.ValidationError("License must not be expired.")
        return value
    
from rest_framework import serializers
from .models import DriverProfile


from rest_framework import serializers

from .models import DriverProfile


class DriverDashboardSerializer(serializers.ModelSerializer):

    completion_percentage = serializers.SerializerMethodField()

    class Meta:
        model = DriverProfile

        fields = [
            "completion_percentage",
            "profile_completed",
            "verification_status",
        ]

    def get_completion_percentage(self, obj):

        return obj.get_completion_percentage()


