from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, timezone_obj):
        return request.user.is_superuser or timezone_obj.user == request.user
