from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter

from ..serializers.calendar_serializer import CalendarSerializer
from ..models.calendar import Calendar
from ..permissions.calendar_permission import CalendarPermission


@extend_schema_view(
    retrieve=extend_schema(
        description="Retrieve details of a specific calendar.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
        responses={200: CalendarSerializer()}
    ),
    update=extend_schema(
        description="Update details of a specific calendar.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
        request=CalendarSerializer,
        responses={200: CalendarSerializer()}
    ),
    partial_update=extend_schema(
        description="Partially update details of a specific calendar.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
        request=CalendarSerializer,
        responses={200: CalendarSerializer()}
    ),
    destroy=extend_schema(
        description="Delete a specific calendar.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
    ),
    list=extend_schema(
        description="Retrieve a list of calendars owned by the current user.",
        responses={200: CalendarSerializer(many=True)}
    ),
    create=extend_schema(
        description="Create a new calendar.",
        request=CalendarSerializer,
        responses={201: CalendarSerializer()}
    )
)
class CalendarViewSet(ModelViewSet):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer
    permission_classes = [CalendarPermission]

    def perform_create(self, serializer):
        return serializer.save(owner=self.request.user)
    
    def list(self, request, *args, **kwargs):
        search = request.query_params.get('search')

        if search is not None:
            queryset = Calendar.objects.filter(owner=self.request.user, name__contains=search)
        else:
            queryset = Calendar.objects.filter(owner=self.request.user)
        
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)
