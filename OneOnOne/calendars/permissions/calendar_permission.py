from rest_framework import permissions


class CalendarPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if view.action == 'retrieve':
            return True
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        if view.action == 'retrieve':
            return True
        return obj.owner == request.user
