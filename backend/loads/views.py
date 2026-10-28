from drivers.models import DriverProfile

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Load, LoadStatusHistory
from .serializers import LoadSerializer, LoadStatusHistorySerializer
from accounts.permissions import IsCustomer

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from .models import Load
from accounts.permissions import IsDriver

from django.db import models


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

    def post(self, request, pk):

        try:
            load = Load.objects.get(pk=pk)
        except Load.DoesNotExist:
            raise NotFound("Load does not exist.")

        # Check driver profile
        try:
            profile = request.user.driver_profile
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
        
        active_load_exists = False
        for st in loads:
            if st.status in ["ASSIGNED", "IN_TRANSIT"]:
                active_load_exists = True
                break

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
            .filter(assigned_driver=self.request.user)
            .order_by("-created_at")
        )
        
class LoadDetailAPIView(generics.RetrieveAPIView):

    serializer_class = LoadSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):

        user = self.request.user

        return Load.objects.filter(
            models.Q(customer=user) |
            models.Q(assigned_driver=user)
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


class CancelLoadAPIView(generics.GenericAPIView):

    permission_classes = [
        IsAuthenticated,
        IsCustomer,
    ]

    def post(self, request, pk):

        try:
            load = Load.objects.get(
                pk=pk,
                customer=request.user
            )
        except Load.DoesNotExist:
            raise NotFound(
                "Load does not exist or you do not have access to it."
            )

        if load.status != Load.Status.AVAILABLE:
            return Response(
                {
                    "detail": (
                        "Only available loads can be cancelled."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        load.status = Load.Status.CANCELLED

        load.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        LoadStatusHistory.objects.create(
            load=load,
            status=Load.Status.CANCELLED,
            changed_by=request.user
        )

        return Response(
            {
                "message": "Load cancelled successfully.",
                "load_id": load.id,
                "status": load.status
            },
            status=status.HTTP_200_OK
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
        