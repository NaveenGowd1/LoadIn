from django.db import models
from accounts.models import CustomUser


class Load(models.Model):

    class Status(models.TextChoices):
        AVAILABLE = "AVAILABLE", "Available"
        ASSIGNED = "ASSIGNED", "Assigned"
        IN_TRANSIT = "IN_TRANSIT", "In Transit"
        DELIVERED = "DELIVERED", "Delivered"
        CANCELLED = "CANCELLED", "Cancelled"

    customer = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="loads",
        limit_choices_to={"role": CustomUser.Role.CUSTOMER},
    )

    pickup_location = models.CharField(
        max_length=255
    )

    delivery_location = models.CharField(
        max_length=255
    )

    goods_description = models.TextField()

    weight = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    vehicle_type = models.CharField(
        max_length=50
    )

    pickup_date = models.DateField()

    delivery_date = models.DateField()

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.AVAILABLE
    )

    assigned_driver = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        related_name="assigned_loads",
        null=True,
        blank=True,
        limit_choices_to={"role": CustomUser.Role.DRIVER},
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"{self.pickup_location} → "
            f"{self.delivery_location}"
        )
        
class LoadStatusHistory(models.Model):

    load = models.ForeignKey(
        Load,
        on_delete=models.CASCADE,
        related_name="status_history"
    )

    status = models.CharField(
        max_length=20,
        choices=Load.Status.choices
    )

    changed_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="load_status_changes"
    )

    changed_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.load.id} - {self.status}"