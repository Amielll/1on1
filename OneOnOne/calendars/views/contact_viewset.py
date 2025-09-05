from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiParameter
from django.shortcuts import get_object_or_404

from ..serializers.contact_serializer import ContactSerializer
from ..models.contact import Contact
from ..models.calendar import Calendar
from ..permissions.contact_permission import ContactPermission

@extend_schema_view(
    retrieve=extend_schema(
        description="Retrieve details of a specific contact.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
        responses={200: ContactSerializer()}
    ),
    update=extend_schema(
        description="Update details of a specific contact.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
        request=ContactSerializer,
        responses={200: ContactSerializer()}
    ),
    partial_update=extend_schema(
        description="Partially update details of a specific contact.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
        request=ContactSerializer,
        responses={200: ContactSerializer()}
    ),
    destroy=extend_schema(
        description="Delete a specific contact.",
        parameters=[OpenApiParameter(name="id", type=int, location=OpenApiParameter.PATH)],
    ),
    list=extend_schema(
        description="Retrieve a list of contacts owned by the current user.",
        responses={200: ContactSerializer(many=True)}
    ),
    create=extend_schema(
        description="Create a new contact.",
        request=ContactSerializer,
        responses={201: ContactSerializer()}
    )
)

class ContactViewSet(ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [ContactPermission]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = Contact.objects.filter(owner=self.request.user)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)