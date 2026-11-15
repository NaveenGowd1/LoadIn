from urllib import request
from rest_framework.views import APIView
from drivers.models import DriverProfile

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Load, LoadStatusHistory
from .serializers import LoadSerializer, LoadStatusHistorySerializer, MatchLoadsSerializer,DriverLoadHistorySerializer
from accounts.permissions import IsCustomer

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from .models import Load
from accounts.permissions import IsDriver

from django.db import models, transaction


class CreateLoadAPIView(generics.CreateAPIView):

    serializer_class = LoadSerializer

    permission_classes = [
        IsAuthenticated,
        IsCustomer,
    ]

    def perform_create(self, serializer):

        load =serializer.save(
            customer=self.request.user
        )
        
                
        LoadStatusHistory.objects.create(
                                load=load,
                                status=Load.Status.AVAILABLE,
                                changed_by=self.request.user
                            )       
        
        
from accounts.permissions import IsDriver


class AvailableLoadsAPIView(generics.ListAPIView):

    serializer_class = LoadSerializer

    permission_classes = [
        IsAuthenticated,
        IsDriver,
    ]

    def get_queryset(self):

        try:
            profile = self.request.user.driver_profile
        except DriverProfile.DoesNotExist:
            return Load.objects.none()

        return (
            Load.objects
            .select_related("customer", "assigned_driver")
            .filter(
                status=Load.Status.AVAILABLE,
                vehicle_type=profile.vehicle_type
            )
            .order_by("-created_at")
        )
        
class AcceptLoadAPIView(generics.GenericAPIView):

    permission_classes = [
        IsAuthenticated,
        IsDriver,
    ]

    @transaction.atomic
    def post(self, request, pk):

        try:
            load = Load.objects.select_for_update().get(pk=pk)
        except Load.DoesNotExist:
            raise NotFound("Load does not exist.")

        # Check driver profile
        # Lock the driver's profile row
        try:
            profile = DriverProfile.objects.select_for_update().get(
            user=request.user
            )
        except DriverProfile.DoesNotExist:
            return Response(
                {"detail": "Complete your driver profile first."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check profile completion
        if not profile.profile_completed:
            return Response(
                {
                    "detail": "Complete your driver profile before accepting loads."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Check verification
        if profile.verification_status != profile.VerificationStatus.VERIFIED:
            return Response(
                {
                    "detail": "Your driver profile is not verified yet."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Check active load
        # active_load_exists = Load.objects.filter(
        #     assigned_driver=request.user,
        #     status__in=[
        #         Load.Status.ASSIGNED,
        #         Load.Status.IN_TRANSIT,
        #     ]
        # ).exists()
        
        loads = Load.objects.filter(assigned_driver=request.user)
        
        active_load_exists = Load.objects.filter(
            assigned_driver=request.user,
            status__in=[
                Load.Status.ASSIGNED,
                Load.Status.IN_TRANSIT,
            ],
        ).exists()
        
        if active_load_exists:
            return Response(
                {
                    "detail": (
                        "You already have an active load. "
                        "Complete it before accepting another load."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check whether requested load is available
        if load.status != Load.Status.AVAILABLE:
            return Response(
                {
                    "detail": "This load is no longer available."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Assign load
        load.assigned_driver = request.user
        load.status = Load.Status.ASSIGNED
        

        load.save(
            update_fields=[
                "assigned_driver",
                "status",
                "updated_at",
            ]
        )
        
        LoadStatusHistory.objects.create(
                load=load,
                status=Load.Status.ASSIGNED,
                changed_by=request.user
            )

        return Response(
            {
                "message": "Load accepted successfully.",
                "load_id": load.id,
                "status": load.status,
            },
            status=status.HTTP_200_OK
        )
        
class MyLoadsAPIView(generics.ListAPIView):
    serializer_class = LoadSerializer
    permission_classes = [
        IsAuthenticated,
        IsCustomer,
    ]

    def get_queryset(self):
        return (
            Load.objects
            .select_related(
                "customer",
                "assigned_driver",
                "assigned_driver__driver_profile",
            )
            .filter(customer=self.request.user)
            .order_by("-created_at")
        )
        
class MyAcceptedLoadsAPIView(generics.ListAPIView):
    serializer_class = LoadSerializer
    permission_classes = [
        IsAuthenticated,
        IsDriver,
    ]

    def get_queryset(self):
        return (
            Load.objects
            .select_related(
                "customer",
                "assigned_driver",
                "assigned_driver__driver_profile",
            )
            .filter(
                assigned_driver=self.request.user,
                status__in=[
                    Load.Status.ASSIGNED,
                    Load.Status.IN_TRANSIT,
                ],
            )
            .order_by("-created_at")
        )
        
class LoadDetailAPIView(generics.RetrieveAPIView):
    serializer_class = LoadSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        user = self.request.user

        return (
            Load.objects
            .select_related(
                "customer",
                "assigned_driver",
                "assigned_driver__driver_profile",
            )
            .filter(
                models.Q(customer=user) |
                models.Q(assigned_driver=user)
            )
        )
        
class StartLoadAPIView(generics.GenericAPIView):

    permission_classes = [
        IsAuthenticated,
        IsDriver,
    ]

    def post(self, request, pk):

        try:
            load = Load.objects.get(pk=pk)

        except Load.DoesNotExist:
            raise NotFound(
                "Load does not exist."
            )

        # Check if the requesting driver is assigned to this load
        if load.assigned_driver != request.user:
            return Response(
                {
                    "detail":
                    "You are not assigned to this load."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if the load is in the correct status to start
        if load.status != Load.Status.ASSIGNED:
            return Response(
                {
                    "detail":
                    "This load cannot be started at this time."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the load status to IN_TRANSIT
        load.status = Load.Status.IN_TRANSIT
        load.save(
        update_fields=[
            "status",
            "updated_at",
        ]
    )
        
        LoadStatusHistory.objects.create(
        load=load,
        status=Load.Status.IN_TRANSIT,
        changed_by=request.user
    )

        return Response(
            {
                "message":
                "Load has been started successfully.",
                "load_id":
                load.id,
                "status":
                load.status,
            },
            status=status.HTTP_200_OK
        )
        
class DeliverLoadAPIView(generics.GenericAPIView):

    permission_classes = [
        IsAuthenticated,
        IsDriver,
    ]

    def post(self, request, pk):

        try:
            load = Load.objects.get(pk=pk)

        except Load.DoesNotExist:
            raise NotFound(
                "Load does not exist."
            )

        # Check if the requesting driver is assigned to this load
        if load.assigned_driver != request.user:
            return Response(
                {
                    "detail":
                    "You are not assigned to this load."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if the load is in the correct status to deliver
        if load.status != Load.Status.IN_TRANSIT:
            return Response(
                {
                    "detail":
                    "This load cannot be delivered at this time."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update the load status to DELIVERED
        load.status = Load.Status.DELIVERED

        load.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        LoadStatusHistory.objects.create(
            load=load,
            status=Load.Status.DELIVERED,
            changed_by=request.user
        )

        return Response(
            {
                "message":
                "Load has been delivered successfully.",
                "load_id":
                load.id,
                "status":
                load.status,
            },
            status=status.HTTP_200_OK
        )
        
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from accounts.permissions import IsCustomer
from .models import Load

import math


def haversine_km(lat1, lon1, lat2, lon2):
    r = 6371.0  # Earth radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(d_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    )
    return 2 * r * math.atan2(math.sqrt(a), math.sqrt(1 - a))


class CancelLoadAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated, IsCustomer]

    def post(self, request, pk):
        with transaction.atomic():
            try:
                load = (
                    Load.objects
                    .select_for_update()
                    .get(pk=pk, customer=request.user)
                )
            except Load.DoesNotExist:
                raise NotFound(
                    "Load does not exist or you do not have access to it."
                )

            if load.status != Load.Status.AVAILABLE:
                return Response(
                    {"detail": "Only available loads can be cancelled."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            load.status = Load.Status.CANCELLED
            load.save(update_fields=["status", "updated_at"])

            LoadStatusHistory.objects.create(
                load=load,
                status=Load.Status.CANCELLED,
                changed_by=request.user,
            )

        return Response(
            {
                "message": "Load cancelled successfully.",
                "load_id": load.id,
                "status": load.status,
            },
            status=status.HTTP_200_OK,
        )

class LoadHistoryAPIView(generics.ListAPIView):

    serializer_class = LoadStatusHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        user = self.request.user

        return LoadStatusHistory.objects.filter(
            models.Q(load__customer=user) |
            models.Q(load__assigned_driver=user)
        ).filter(
            load_id=self.kwargs["pk"]
        ).order_by("changed_at")
        
class MatchLoadsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsDriver]

    def post(self, request):
        serializer = MatchLoadsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            driver_profile = request.user.driver_profile
        except DriverProfile.DoesNotExist:
            return Response(
                {"detail": "Please complete your driver profile first."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        base_qs = (
            Load.objects
            .select_related("customer", "assigned_driver", "assigned_driver__driver_profile")
            .filter(
                status=Load.Status.AVAILABLE,
                vehicle_type=driver_profile.vehicle_type,
            )
            .order_by("-price", "-created_at")
        )

        cur_lat = data.get("current_latitude")
        cur_lng = data.get("current_longitude")
        dest_lat = data.get("destination_latitude")
        dest_lng = data.get("destination_longitude")
        radius_km = data.get("radius_km", 30.0)

        # Coordinate-based radius matching when pins are provided
        if None not in (cur_lat, cur_lng, dest_lat, dest_lng):
            matched = []
            for load in base_qs:
                if None not in (
                    load.pickup_latitude,
                    load.pickup_longitude,
                    load.delivery_latitude,
                    load.delivery_longitude,
                ):
                    pickup_dist = haversine_km(
                        cur_lat, cur_lng, load.pickup_latitude, load.pickup_longitude
                    )
                    drop_dist = haversine_km(
                        dest_lat, dest_lng, load.delivery_latitude, load.delivery_longitude
                    )
                    if pickup_dist <= radius_km and drop_dist <= radius_km:
                        matched.append(load)
            matching_loads = matched
        else:
            # Fallback to text search
            current_location = data.get("current_location", "").strip()
            return_destination = data.get("return_destination", "").strip()
            if current_location:
                base_qs = base_qs.filter(pickup_location__icontains=current_location)
            if return_destination:
                base_qs = base_qs.filter(delivery_location__icontains=return_destination)
            matching_loads = list(base_qs)

        response_serializer = LoadSerializer(matching_loads, many=True)

        return Response({
            "count": len(matching_loads),
            "current_location": data.get("current_location", ""),
            "return_destination": data.get("return_destination", ""),
            "results": response_serializer.data,
        })
        
class DriverLoadHistoryAPIView(generics.ListAPIView):
    serializer_class = DriverLoadHistorySerializer
    permission_classes = [
        IsAuthenticated,
        IsDriver,
    ]

    def get_queryset(self):
        return (
            Load.objects
            .select_related(
                "customer",
                "assigned_driver",
                "assigned_driver__driver_profile",
            )
            .filter(
                assigned_driver=self.request.user,
                status=Load.Status.DELIVERED,
            )
            .prefetch_related("status_history__changed_by")
            .order_by("-updated_at")
        )
        
