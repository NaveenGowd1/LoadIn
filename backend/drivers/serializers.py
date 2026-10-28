from rest_framework import serializers
from django.utils import timezone
from .models import DriverProfile


class DriverProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = DriverProfile

        fields = [
            "date_of_birth",
            "address",
            "license_number",
            "license_expiry_date",
            "vehicle_number",
            "vehicle_type",
        ]

    def validate_license_expiry_date(self, value):

        if value <= timezone.now().date():
            raise serializers.ValidationError(
                "License must not be expired."
            )

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


