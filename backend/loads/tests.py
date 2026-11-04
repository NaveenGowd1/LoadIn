from django.test import TestCase

from datetime import date, timedelta
from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import CustomUser
from drivers.models import DriverProfile
from loads.models import Load, LoadStatusHistory


class AcceptLoadAPITests(APITestCase):

    def setUp(self):
        # Create a customer
        self.customer = CustomUser.objects.create_user(
            email="customer@test.com",
            password="TestPass123!",
            phone_number="9000000001",
            role=CustomUser.Role.CUSTOMER,
        )

        # Create a driver
        self.driver = CustomUser.objects.create_user(
            email="driver@test.com",
            password="TestPass123!",
            phone_number="9000000002",
            role=CustomUser.Role.DRIVER,
        )

        # Create a completed and verified driver profile
        self.driver_profile = DriverProfile.objects.create(
            user=self.driver,
            date_of_birth=date(1998, 1, 1),
            address="Hyderabad",
            license_number="TEST-LICENSE-001",
            license_expiry_date=date.today() + timedelta(days=365),
            vehicle_number="TEST-VEHICLE-001",
            vehicle_type="Truck",
            verification_status=DriverProfile.VerificationStatus.VERIFIED,
            profile_completed=True,
        )

        # Create an available load
        self.load = Load.objects.create(
            customer=self.customer,
            pickup_location="Hyderabad",
            delivery_location="Vijayawada",
            goods_description="Electronics",
            weight=Decimal("500.00"),
            vehicle_type="Truck",
            pickup_date=date.today() + timedelta(days=2),
            delivery_date=date.today() + timedelta(days=4),
            price=Decimal("5000.00"),
            status=Load.Status.AVAILABLE,
        )

    def test_driver_can_accept_available_load(self):
        # Authenticate as the driver
        self.client.force_authenticate(user=self.driver)

        # Call the accept-load API
        url = reverse("accept-load", kwargs={"pk": self.load.pk})
        response = self.client.post(url)

        # Check the API response
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh the load from the database
        self.load.refresh_from_db()

        # Verify the load assignment
        self.assertEqual(self.load.assigned_driver, self.driver)
        self.assertEqual(self.load.status, Load.Status.ASSIGNED)

        # Verify the status history
        history = LoadStatusHistory.objects.filter(
            load=self.load,
            status=Load.Status.ASSIGNED,
            changed_by=self.driver,
        )

        self.assertEqual(history.count(), 1)
        
    
    def test_another_driver_cannot_accept_assigned_load(self):
        # Driver 1 accepts the load
        self.client.force_authenticate(user=self.driver)

        url = reverse("accept-load", kwargs={"pk": self.load.pk})
        first_response = self.client.post(url)

        self.assertEqual(
            first_response.status_code,
            status.HTTP_200_OK,
        )

        # Create a second driver
        second_driver = CustomUser.objects.create_user(
            email="driver2@test.com",
            password="TestPass123!",
            phone_number="9000000003",
            role=CustomUser.Role.DRIVER,
        )

        DriverProfile.objects.create(
            user=second_driver,
            date_of_birth=date(1999, 1, 1),
            address="Vijayawada",
            license_number="TEST-LICENSE-002",
            license_expiry_date=date.today() + timedelta(days=365),
            vehicle_number="TEST-VEHICLE-002",
            vehicle_type="Truck",
            verification_status=DriverProfile.VerificationStatus.VERIFIED,
            profile_completed=True,
        )

        # Driver 2 attempts to accept the same load
        self.client.force_authenticate(user=second_driver)

        second_response = self.client.post(url)

        # The second request must be rejected
        self.assertEqual(
            second_response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        # The original assignment must remain unchanged
        self.load.refresh_from_db()

        self.assertEqual(
            self.load.assigned_driver,
            self.driver,
        )

        self.assertEqual(
            self.load.status,
            Load.Status.ASSIGNED,
        )

        # Only one ASSIGNED history entry should exist
        assigned_history_count = LoadStatusHistory.objects.filter(
            load=self.load,
            status=Load.Status.ASSIGNED,
        ).count()

        self.assertEqual(assigned_history_count, 1)
    
    def test_driver_cannot_accept_second_active_load(self):
        # Give the driver an existing active load
        self.load.assigned_driver = self.driver
        self.load.status = Load.Status.ASSIGNED
        self.load.save(
            update_fields=["assigned_driver", "status", "updated_at"]
        )

        # Create another available load
        second_load = Load.objects.create(
            customer=self.customer,
            pickup_location="Vijayawada",
            delivery_location="Guntur",
            goods_description="Furniture",
            weight=Decimal("300.00"),
            vehicle_type="Truck",
            pickup_date=date.today() + timedelta(days=3),
            delivery_date=date.today() + timedelta(days=5),
            price=Decimal("3000.00"),
            status=Load.Status.AVAILABLE,
        )

        # Authenticate as the driver who already has an active load
        self.client.force_authenticate(user=self.driver)

        url = reverse("accept-load", kwargs={"pk": second_load.pk})
        response = self.client.post(url)

        # The API must reject the second assignment
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        # The second load must remain available and unassigned
        second_load.refresh_from_db()

        self.assertEqual(
            second_load.status,
            Load.Status.AVAILABLE,
        )
        self.assertIsNone(second_load.assigned_driver)

        # No ASSIGNED history entry should have been created for it
        self.assertFalse(
            LoadStatusHistory.objects.filter(
                load=second_load,
                status=Load.Status.ASSIGNED,
            ).exists()
        )
        
    def test_driver_with_incomplete_profile_cannot_accept_load(self):
        # Mark the driver's profile as incomplete
        self.driver_profile.profile_completed = False
        self.driver_profile.save(update_fields=["profile_completed"])

        # Authenticate as the driver
        self.client.force_authenticate(user=self.driver)

        url = reverse("accept-load", kwargs={"pk": self.load.pk})
        response = self.client.post(url)

        # The request must be rejected
        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

        # The load must remain available and unassigned
        self.load.refresh_from_db()

        self.assertEqual(self.load.status, Load.Status.AVAILABLE)
        self.assertIsNone(self.load.assigned_driver)

        # No assignment history should be created
        self.assertFalse(
            LoadStatusHistory.objects.filter(
                load=self.load,
                status=Load.Status.ASSIGNED,
            ).exists()
        )
    
    def test_unverified_driver_cannot_accept_load(self):
        # Keep the profile complete but mark it as pending verification
        self.driver_profile.verification_status = (
            DriverProfile.VerificationStatus.PENDING
        )
        self.driver_profile.save(update_fields=["verification_status"])

        # Authenticate as the driver
        self.client.force_authenticate(user=self.driver)

        url = reverse("accept-load", kwargs={"pk": self.load.pk})
        response = self.client.post(url)

        # The request must be rejected
        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

        # The load must remain available and unassigned
        self.load.refresh_from_db()

        self.assertEqual(self.load.status, Load.Status.AVAILABLE)
        self.assertIsNone(self.load.assigned_driver)

        # No assignment history should exist
        self.assertFalse(
            LoadStatusHistory.objects.filter(
                load=self.load,
                status=Load.Status.ASSIGNED,
            ).exists()
        )
    def test_customer_cannot_accept_load(self):
        # Authenticate as a customer
        self.client.force_authenticate(user=self.customer)

        url = reverse("accept-load", kwargs={"pk": self.load.pk})
        response = self.client.post(url)

        # The request must be forbidden
        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

        # The load must remain available
        self.load.refresh_from_db()

        self.assertEqual(
            self.load.status,
            Load.Status.AVAILABLE,
        )
        self.assertIsNone(self.load.assigned_driver)

        # No assignment history should exist
        self.assertFalse(
            LoadStatusHistory.objects.filter(
                load=self.load,
                status=Load.Status.ASSIGNED,
            ).exists()
        )
    
    def test_unauthenticated_user_cannot_accept_load(self):
        # Make the request without authenticating a user
        self.client.force_authenticate(user=None)

        url = reverse("accept-load", kwargs={"pk": self.load.pk})
        response = self.client.post(url)

        # Unauthenticated requests should be rejected
        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        # The load must remain available and unassigned
        self.load.refresh_from_db()

        self.assertEqual(self.load.status, Load.Status.AVAILABLE)
        self.assertIsNone(self.load.assigned_driver)

        # No assignment history should exist
        self.assertFalse(
            LoadStatusHistory.objects.filter(
                load=self.load,
                status=Load.Status.ASSIGNED,
            ).exists()
        )
        
    def test_accept_nonexistent_load_returns_404(self):
        self.client.force_authenticate(user=self.driver)

        # Use an ID that does not exist
        nonexistent_id = 999999
        url = reverse(
            "accept-load",
            kwargs={"pk": nonexistent_id},
        )

        response = self.client.post(url)

        # The API should return Not Found
        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )
    
    def test_same_driver_cannot_accept_load_twice(self):
        self.client.force_authenticate(user=self.driver)

        url = reverse("accept-load", kwargs={"pk": self.load.pk})

        # First request should succeed
        first_response = self.client.post(url)
        self.assertEqual(
            first_response.status_code,
            status.HTTP_200_OK,
        )

        # Same driver tries to accept the same load again
        second_response = self.client.post(url)
        self.assertEqual(
            second_response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        # Verify the load is still assigned to the same driver
        self.load.refresh_from_db()
        self.assertEqual(self.load.assigned_driver, self.driver)
        self.assertEqual(self.load.status, Load.Status.ASSIGNED)

        # Only one assignment history entry should exist
        history_count = LoadStatusHistory.objects.filter(
            load=self.load,
            status=Load.Status.ASSIGNED,
        ).count()

        self.assertEqual(history_count, 1)
    
    def test_driver_cannot_accept_cancelled_load(self):
        # Change the load to CANCELLED
        self.load.status = Load.Status.CANCELLED
        self.load.save(update_fields=["status", "updated_at"])

        self.client.force_authenticate(user=self.driver)

        url = reverse("accept-load", kwargs={"pk": self.load.pk})
        response = self.client.post(url)

        # Acceptance should be rejected
        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        # The load must remain cancelled and unassigned
        self.load.refresh_from_db()

        self.assertEqual(self.load.status, Load.Status.CANCELLED)
        self.assertIsNone(self.load.assigned_driver)

        # No assignment history should be created
        self.assertFalse(
            LoadStatusHistory.objects.filter(
                load=self.load,
                status=Load.Status.ASSIGNED,
            ).exists()
        )


class StartLoadAPITests(APITestCase):

    def setUp(self):
        self.customer = CustomUser.objects.create_user(
            email="start_customer@test.com",
            password="TestPass123!",
            phone_number="9000000011",
            role=CustomUser.Role.CUSTOMER,
        )

        self.driver = CustomUser.objects.create_user(
            email="start_driver@test.com",
            password="TestPass123!",
            phone_number="9000000012",
            role=CustomUser.Role.DRIVER,
        )

        self.other_driver = CustomUser.objects.create_user(
            email="other_driver@test.com",
            password="TestPass123!",
            phone_number="9000000013",
            role=CustomUser.Role.DRIVER,
        )

        self.load = Load.objects.create(
            customer=self.customer,
            pickup_location="Hyderabad",
            delivery_location="Vijayawada",
            goods_description="Electronics",
            weight=Decimal("500.00"),
            vehicle_type="Truck",
            pickup_date=date.today() + timedelta(days=2),
            delivery_date=date.today() + timedelta(days=4),
            price=Decimal("5000.00"),
            assigned_driver=self.driver,
            status=Load.Status.ASSIGNED,
        )

        self.url = reverse(
            "start-load",
            kwargs={"pk": self.load.pk},
        )

    def test_assigned_driver_can_start_load(self):
        self.client.force_authenticate(user=self.driver)

        response = self.client.post(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.load.refresh_from_db()

        self.assertEqual(
            self.load.status,
            Load.Status.IN_TRANSIT,
        )
        self.assertEqual(
            self.load.assigned_driver,
            self.driver,
        )

        self.assertTrue(
            LoadStatusHistory.objects.filter(
                load=self.load,
                status=Load.Status.IN_TRANSIT,
                changed_by=self.driver,
            ).exists()
        )

    def test_unassigned_driver_cannot_start_load(self):
        self.client.force_authenticate(user=self.other_driver)

        response = self.client.post(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

        self.load.refresh_from_db()

        # The original assignment and status must remain unchanged
        self.assertEqual(
            self.load.assigned_driver,
            self.driver,
        )
        self.assertEqual(
            self.load.status,
            Load.Status.ASSIGNED,
        )

        # No IN_TRANSIT history should be created
        self.assertFalse(
            LoadStatusHistory.objects.filter(
                load=self.load,
                status=Load.Status.IN_TRANSIT,
            ).exists()
        )
    
    def test_driver_cannot_start_load_twice(self):
        self.client.force_authenticate(user=self.driver)

        # First request: start the load successfully
        first_response = self.client.post(self.url)

        self.assertEqual(
            first_response.status_code,
            status.HTTP_200_OK,
        )

        # Second request: the load is already IN_TRANSIT
        second_response = self.client.post(self.url)

        self.assertEqual(
            second_response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.load.refresh_from_db()

        self.assertEqual(
            self.load.status,
            Load.Status.IN_TRANSIT,
        )

        # Only one IN_TRANSIT history entry should exist
        self.assertEqual(
            LoadStatusHistory.objects.filter(
                load=self.load,
                status=Load.Status.IN_TRANSIT,
            ).count(),
            1,
        )
class DeliverLoadAPITests(APITestCase):

    def setUp(self):
        self.customer = CustomUser.objects.create_user(
            email="deliver_customer@test.com",
            password="TestPass123!",
            phone_number="9000000021",
            role=CustomUser.Role.CUSTOMER,
        )

        self.driver = CustomUser.objects.create_user(
            email="deliver_driver@test.com",
            password="TestPass123!",
            phone_number="9000000022",
            role=CustomUser.Role.DRIVER,
        )

        self.load = Load.objects.create(
            customer=self.customer,
            pickup_location="Hyderabad",
            delivery_location="Vijayawada",
            goods_description="Electronics",
            weight=Decimal("500.00"),
            vehicle_type="Truck",
            pickup_date=date.today() + timedelta(days=2),
            delivery_date=date.today() + timedelta(days=4),
            price=Decimal("5000.00"),
            assigned_driver=self.driver,
            status=Load.Status.IN_TRANSIT,
        )

        self.url = reverse(
            "deliver-load",
            kwargs={"pk": self.load.pk},
        )

    def test_assigned_driver_can_deliver_load(self):
        self.client.force_authenticate(user=self.driver)

        response = self.client.post(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.load.refresh_from_db()

        self.assertEqual(
            self.load.status,
            Load.Status.DELIVERED,
        )

        self.assertEqual(
            self.load.assigned_driver,
            self.driver,
        )

        self.assertTrue(
            LoadStatusHistory.objects.filter(
                load=self.load,
                status=Load.Status.DELIVERED,
                changed_by=self.driver,
            ).exists()
        )
    def test_unassigned_driver_cannot_deliver_load(self):
                other_driver = CustomUser.objects.create_user(
                    email="other_deliver_driver@test.com",
                    password="TestPass123!",
                    phone_number="9000000023",
                    role=CustomUser.Role.DRIVER,
                )
    
                self.client.force_authenticate(user=other_driver)
    
                response = self.client.post(self.url)
    
                self.assertEqual(
                    response.status_code,
                    status.HTTP_403_FORBIDDEN,
                )
    
                self.load.refresh_from_db()
    
                # The load must remain IN_TRANSIT
                self.assertEqual(
                    self.load.status,
                    Load.Status.IN_TRANSIT,
                )
    
                # No delivery history should be created
                self.assertFalse(
                    LoadStatusHistory.objects.filter(
                        load=self.load,
                        status=Load.Status.DELIVERED,
                    ).exists()
                )
    def test_driver_cannot_deliver_load_before_starting(self):
        # Change the load back to ASSIGNED
        self.load.status = Load.Status.ASSIGNED
        self.load.save(update_fields=["status", "updated_at"])

        self.client.force_authenticate(user=self.driver)

        response = self.client.post(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.load.refresh_from_db()

        # The load must remain ASSIGNED
        self.assertEqual(
            self.load.status,
            Load.Status.ASSIGNED,
        )

        # No DELIVERED history should be created
        self.assertFalse(
            LoadStatusHistory.objects.filter(
                load=self.load,
                status=Load.Status.DELIVERED,
            ).exists()
        )
        

# loads/tests/test_cancel_load.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import CustomUser
from loads.models import Load, LoadStatusHistory


class CancelLoadAPITests(APITestCase):

    def setUp(self):
        self.customer = CustomUser.objects.create_user(
            email="customer@example.com",
            password="TestPass123!",
            role="CUSTOMER",
            phone_number="9000000001",
        )

        self.other_customer = CustomUser.objects.create_user(
            email="other@example.com",
            password="TestPass123!",
            role="CUSTOMER",
            phone_number="9000000002",
        )

        self.driver = CustomUser.objects.create_user(
            email="driver@example.com",
            password="TestPass123!",
            role="DRIVER",
            phone_number="9000000003",
        )

        # Add any other required Load fields from your model here.
        self.load = Load.objects.create(
            customer=self.customer,
            pickup_location="Hyderabad",
            delivery_location="Vijayawada",
            goods_description="Electronics",
            weight=Decimal("100.00"),
            vehicle_type="Truck",
            pickup_date=date.today() + timedelta(days=2),
            delivery_date=date.today() + timedelta(days=4),
            price=Decimal("1000.00"),
            status=Load.Status.AVAILABLE,
        )

        self.url = reverse(
            "cancel-load",
            kwargs={"pk": self.load.pk},
        )

        self.client.force_authenticate(user=self.customer)

    def test_customer_can_cancel_available_load(self):
        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.load.refresh_from_db()
        self.assertEqual(
            self.load.status,
            Load.Status.CANCELLED,
        )

        self.assertTrue(
            LoadStatusHistory.objects.filter(
                load=self.load,
                status=Load.Status.CANCELLED,
                changed_by=self.customer,
            ).exists()
        )

    def test_cannot_cancel_assigned_load(self):
        self.load.status = Load.Status.ASSIGNED
        self.load.save()

        response = self.client.post(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.load.refresh_from_db()
        self.assertEqual(self.load.status, Load.Status.ASSIGNED)

    def test_cannot_cancel_in_transit_load(self):
        self.load.status = Load.Status.IN_TRANSIT
        self.load.save()

        response = self.client.post(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.load.refresh_from_db()
        self.assertEqual(self.load.status, Load.Status.IN_TRANSIT)

    def test_cannot_cancel_delivered_load(self):
        self.load.status = Load.Status.DELIVERED
        self.load.save()

        response = self.client.post(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_cannot_cancel_already_cancelled_load(self):
        self.load.status = Load.Status.CANCELLED
        self.load.save()

        response = self.client.post(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_customer_cannot_cancel_another_customers_load(self):
        self.load.customer = self.other_customer
        self.load.save()

        response = self.client.post(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_driver_cannot_cancel_load(self):
        self.client.force_authenticate(user=self.driver)

        response = self.client.post(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_unauthenticated_user_cannot_cancel_load(self):
        self.client.force_authenticate(user=None)

        response = self.client.post(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_cancellation_creates_one_history_record(self):
        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        history_count = LoadStatusHistory.objects.filter(
            load=self.load,
            status=Load.Status.CANCELLED,
            changed_by=self.customer,
        ).count()

        self.assertEqual(history_count, 1)
