from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import DriverProfile
from .serializers import DriverDashboardSerializer, DriverProfileSerializer
from accounts.permissions import IsDriver, IsAdmin
from rest_framework.exceptions import NotFound
from rest_framework import generics, status
from rest_framework.response import Response


class CreateDriverProfileAPIView(generics.CreateAPIView):

    serializer_class = DriverProfileSerializer

    permission_classes = [
        IsAuthenticated,
        IsDriver,
    ]

    def perform_create(self, serializer):

        if DriverProfile.objects.filter(
            user=self.request.user
        ).exists():

            from rest_framework.exceptions import ValidationError

            raise ValidationError(
                {
                    "profile": "Driver profile already exists."
                }
            )

        serializer.save(
            user=self.request.user,
            profile_completed=True,
            verification_status=DriverProfile.VerificationStatus.PENDING
        )




class GetDriverProfileAPIView(generics.RetrieveAPIView):

    serializer_class = DriverProfileSerializer

    permission_classes = [
        IsAuthenticated,
        IsDriver,
    ]

    def get_object(self):

        try:
            return DriverProfile.objects.get(
                user=self.request.user
            )

        except DriverProfile.DoesNotExist:
            raise NotFound(
                "Driver profile has not been created yet."
            )
            
            
class UpdateDriverProfileAPIView(generics.UpdateAPIView):

    serializer_class = DriverProfileSerializer

    permission_classes = [
        IsAuthenticated,
        IsDriver,
    ]

    def get_object(self):

        try:
            return DriverProfile.objects.get(
                user=self.request.user
            )

        except DriverProfile.DoesNotExist:
            raise NotFound(
                "Driver profile has not been created yet."
            )

class DriverOnboardingAPIView(generics.GenericAPIView):

    permission_classes = [
        IsAuthenticated,
        IsDriver,
    ]

    def get(self, request):

        try:
            profile = DriverProfile.objects.get(
                user=request.user
            )

            if profile.profile_completed:

                return Response(
                    {
                        "profile_completed": True,
                        "verification_status": profile.verification_status,
                        "next_step": "DASHBOARD"
                    },
                    status=status.HTTP_200_OK
                )

            return Response(
                {
                    "profile_completed": False,
                    "verification_status": profile.verification_status,
                    "next_step": "COMPLETE_PROFILE"
                },
                status=status.HTTP_200_OK
            )

        except DriverProfile.DoesNotExist:

            return Response(
                {
                    "profile_completed": False,
                    "verification_status": None,
                    "next_step": "COMPLETE_PROFILE"
                },
                status=status.HTTP_200_OK
            )
            
class DriverDashboardAPIView(generics.GenericAPIView):

    permission_classes = [
        IsAuthenticated,
        IsDriver,
    ]

    serializer_class = DriverDashboardSerializer

    def get(self, request):

        try:
            profile = request.user.driver_profile

        except DriverProfile.DoesNotExist:

            return Response(
                {
                    "driver": {
                        "email": request.user.email,
                        "phone_number": request.user.phone_number,
                    },

                    "profile": None,

                    "permissions": {
                        "can_view_loads": True,
                        "can_accept_loads": False,
                    },

                    "next_step": "COMPLETE_PROFILE",
                },
                status=status.HTTP_200_OK
            )

        serializer = self.get_serializer(profile)

        can_accept_loads = (
            profile.profile_completed
            and
            profile.verification_status
            == DriverProfile.VerificationStatus.VERIFIED
        )

        return Response(
            {
                "driver": {
                    "email": request.user.email,
                    "phone_number": request.user.phone_number,
                },

                "profile": serializer.data,

                "permissions": {
                    "can_view_loads": True,
                    "can_accept_loads": can_accept_loads,
                },

                "next_step": (
                    "DASHBOARD"
                    if can_accept_loads
                    else "WAIT_FOR_VERIFICATION"
                ),
            },

            status=status.HTTP_200_OK
        )
        
class VerifyDriverAPIView(generics.GenericAPIView):

    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    def post(self, request, pk):

        try:
            profile = DriverProfile.objects.get(
                pk=pk
            )

        except DriverProfile.DoesNotExist:
            raise NotFound(
                "Driver profile does not exist."
            )

        if not profile.profile_completed:

            return Response(
                {
                    "detail":
                    "Driver profile is not complete."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if (
            profile.verification_status
            == DriverProfile.VerificationStatus.VERIFIED
        ):

            return Response(
                {
                    "detail":
                    "Driver is already verified."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        profile.verification_status = (
            DriverProfile.VerificationStatus.VERIFIED
        )

        profile.save(
            update_fields=[
                "verification_status",
                "updated_at",
            ]
        )

        return Response(
            {
                "message":
                "Driver verified successfully.",
                "driver_profile_id":
                profile.id,
                "verification_status":
                profile.verification_status,
            },
            status=status.HTTP_200_OK
        )