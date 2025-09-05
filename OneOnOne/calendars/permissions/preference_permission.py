from rest_framework import permissions

class PreferencePermission(permissions.AllowAny):

    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        if obj.invitee is None:
            return obj.calendar.owner == request.user
        else:
            return True