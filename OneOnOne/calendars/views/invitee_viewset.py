from rest_framework import viewsets, mixins, exceptions
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from smtplib import SMTPException
import os

from ..serializers.invitee_serializer import InviteeSerializer
from ..models.invitee import Invitee
from ..models.calendar import Calendar
from ..models.contact import Contact
from ..permissions.invitee_permission import InviteePermission

@extend_schema_view(
    retrieve=extend_schema(
        description="Retrieve details of a specific invitee.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
        responses={200: InviteeSerializer()}
    ),
    destroy=extend_schema(
        description="Delete a specific invitee.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
    ),
    create=extend_schema(
        description="Create a new invitee for the specified calendar.",
        request=InviteeSerializer,
        responses={201: InviteeSerializer()}
    ),
    list=extend_schema(
        description="Retrieve a list of invitees for the specified calendar.",
        parameters=[OpenApiParameter(name="calendar_pk", type=int, location=OpenApiParameter.PATH)],
        responses={200: InviteeSerializer(many=True)}
    )
)
class InviteeViewSet(mixins.CreateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.DestroyModelMixin,
                     mixins.ListModelMixin,
                     viewsets.GenericViewSet):
    queryset = Invitee.objects.all()
    serializer_class = InviteeSerializer
    permission_classes = [InviteePermission]
    
    def get_queryset(self):
        calendar_pk = self.kwargs.get('calendar_pk')
        calendar = get_object_or_404(Calendar, pk=calendar_pk)
        return self.queryset.filter(calendar=calendar)


    def perform_create(self, serializer):
        """
        Custom method for creating a new invitee for the specified calendar.

        This method is called internally by DRF during object creation. It performs
        additional actions such as sending invitation emails and handling permissions.

        Args:
            serializer: Serializer instance containing data for the invitee.

        Returns:
            The created invitee object.
        """
        calendar_pk = self.kwargs.get('calendar_pk')
        calendar = get_object_or_404(Calendar, pk=calendar_pk)

        if calendar.owner != self.request.user:
            raise exceptions.PermissionDenied()

        contact = serializer.validated_data.get('contact')
        if contact.owner != self.request.user:
            raise exceptions.ValidationError("Invalid contact: Only user's own contacts can be invited")
        
        existing_invitee = Invitee.objects.filter(calendar=calendar, contact=contact)
        if existing_invitee.exists():
            invitee = existing_invitee.first()
        else:
            invitee = serializer.save(calendar=calendar)
        
        subject = f'You have been invited to a calendar by {self.request.user.first_name or self.request.user.username}!'
        front_end_url = os.getenv("FRONTEND_URL", "localhost:3000")
        from_email = os.getenv("EMAIL_SENDER_ADD")
        body = f"""
            {self.request.user.first_name or self.request.user.username} {self.request.user.last_name or ''} has invited you to a calendar.

            Name: {calendar.name}
            Description: {calendar.description}
            Start Date: {calendar.start_date}
            End Date: {calendar.end_date}
            Meeting Duration: {calendar.duration}

            To submit your preferences, use the following link: {front_end_url + "/invitee?calendar_id=" + str(calendar.pk) + "&invitee_id=" + str(invitee.pk)}.
            The deadline to submit your preferences is {calendar.deadline}.
        """
        recipient = contact.email
        try:
            send_mail(subject=subject, message=body, from_email=from_email, recipient_list=[recipient], fail_silently=False)
        except SMTPException as e:
            print(e)

        return invitee
