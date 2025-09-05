from rest_framework import permissions

from ..models.calendar import Calendar

class InviteePermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == 'retrieve':
            return True
        calendar_pk = view.kwargs.get('calendar_pk', None)
        if calendar_pk is None:
            return False
        
        calendar = Calendar.objects.get(pk=calendar_pk)
        return request.user and request.user.is_authenticated and calendar.owner == request.user
    
    def has_object_permission(self, request, view, obj):
        if view.action == 'retrieve':
            return True
        return obj.contact.owner == request.user and obj.calendar.owner == request.user