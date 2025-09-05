from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter
from django.shortcuts import get_object_or_404

from ..serializers.event_serializer import EventSerializer
from ..models.calendar import Calendar
from ..models.event import Event
from ..permissions.event_permission import EventPermission

@extend_schema_view(
    retrieve=extend_schema(
        description="Retrieve details of a specific event.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
        responses={200: EventSerializer()}
    ),
    update=extend_schema(
        description="Update details of a specific event.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
        request=EventSerializer,
        responses={200: EventSerializer()}
    ),
    partial_update=extend_schema(
        description="Partially update details of a specific event.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
        request=EventSerializer,
        responses={200: EventSerializer()}
    ),
    destroy=extend_schema(
        description="Delete a specific event.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
    ),
    create=extend_schema(
        description="Create a new event for the specified calendar.",
        request=EventSerializer,
        responses={201: EventSerializer()}
    ),
    list=extend_schema(
        description="Retrieve a list of events for the specified calendar.",
        parameters=[OpenApiParameter(name="calendar_pk", type=int, location=OpenApiParameter.PATH)],
        responses={200: EventSerializer(many=True)}
    )
)
class EventViewSet(ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [EventPermission]

    def get_queryset(self):
        calendar_pk = self.kwargs.get('calendar_pk')
        calendar = get_object_or_404(Calendar, pk=calendar_pk)
        return Event.objects.filter(calendar=calendar)

    
    def perform_create(self, serializer):
        calendar_pk = self.kwargs.get('calendar_pk')
        serializer.validated_data['calendar_id'] = calendar_pk
        # Save the event
        serializer.save()
