from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter

from ..models.calendar import Calendar
from ..models.invitee import Invitee
from ..models.preference import Preference
from ..serializers.preference_serializer import PreferenceSerializer, PreferenceUpdateSerializer
from ..permissions.preference_permission import PreferencePermission

@extend_schema_view(
    retrieve=extend_schema(
        description="Retrieve details of a specific preference.",
        parameters=[
            OpenApiParameter(name="calendar_pk", type=int, location=OpenApiParameter.PATH),
            OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)
        ],
        responses={200: PreferenceSerializer()}
    ),
    update=extend_schema(
        description="Update details of a specific preference.",
        parameters=[
            OpenApiParameter(name="calendar_pk", type=int, location=OpenApiParameter.PATH),
            OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)
        ],
        request=PreferenceUpdateSerializer,
        responses={200: PreferenceSerializer()}
    ),
    partial_update=extend_schema(
        description="Partially update details of a specific preference.",
        parameters=[
            OpenApiParameter(name="calendar_pk", type=int, location=OpenApiParameter.PATH),
            OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)
        ],
        request=PreferenceUpdateSerializer,
        responses={200: PreferenceSerializer()}
    ),
    destroy=extend_schema(
        description="Delete a specific preference.",
        parameters=[
            OpenApiParameter(name="calendar_pk", type=int, location=OpenApiParameter.PATH),
            OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)
        ],
    ),
    create=extend_schema(
        description="Create a new preference for the specified calendar.",
        request=PreferenceSerializer,
        responses={201: PreferenceSerializer()}
    ),
    list=extend_schema(
        description="Retrieve a list of preferences for the specified calendar.",
        parameters=[OpenApiParameter(name="calendar_pk", type=int, location=OpenApiParameter.PATH)],
        responses={200: PreferenceSerializer(many=True)}
    )
)
class PreferenceViewSet(ModelViewSet):
    serializer_class = PreferenceSerializer
    permission_classes = [PreferencePermission]

    def get_queryset(self):
        calendar_pk = self.kwargs.get('calendar_pk')
        calendar = get_object_or_404(Calendar, pk=calendar_pk)

        invitee_pk = self.request.query_params.get('invitee')
        print(invitee_pk == '0')
        if invitee_pk is not None and invitee_pk != '0': 
            invitee = get_object_or_404(Invitee, pk=invitee_pk)
            return Preference.objects.filter(calendar=calendar, invitee=invitee)
        elif invitee_pk == '0':
            print("here")
            return Preference.objects.filter(calendar=calendar, invitee=None)
        
        return Preference.objects.filter(calendar=calendar)
    

    def perform_create(self, serializer):
        calendar_pk = self.kwargs.get('calendar_pk')
        calendar = get_object_or_404(Calendar, pk=calendar_pk)

        invitee = serializer.validated_data.get('invitee', None)

        if invitee is not None and invitee.calendar != calendar:
            raise ValidationError("Invalid invitee: Invitee is not invited to this calendar.")

        if self.request.user.is_authenticated:
            return serializer.save(invitee=None, calendar=calendar)
        return serializer.save(calendar=calendar)
    
    def get_serializer_class(self):
        if self.request.method == 'PUT':
            return PreferenceUpdateSerializer
        return PreferenceSerializer
