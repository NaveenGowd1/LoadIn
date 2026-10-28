from django.db import models
from accounts.models import CustomUser


class DriverProfile(models.Model):

    class VerificationStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        VERIFIED = "VERIFIED", "Verified"
        REJECTED = "REJECTED", "Rejected"

    user = models.OneToOneField(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="driver_profile"
    )

    date_of_birth = models.DateField()
    address = models.TextField()

    license_number = models.CharField(
        max_length=50,
        unique=True
    )

    license_expiry_date = models.DateField()

    vehicle_number = models.CharField(
        max_length=20,
        unique=True
    )

    vehicle_type = models.CharField(max_length=50)

    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING
    )

    profile_completed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def get_completion_percentage(self):

        fields = [
        self.date_of_birth,
        self.address,
        self.license_number,
        self.license_expiry_date,
        self.vehicle_number,
        self.vehicle_type,
        ]

        completed_fields = sum(
        field not in [None, ""]
        for field in fields
        )

        return int(
        (completed_fields / len(fields)) * 100
        )
    
    def __str__(self):
        return f"{self.user.email} - {self.vehicle_number}"