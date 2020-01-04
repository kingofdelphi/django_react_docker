from rest_framework import permissions

from django.contrib.auth import get_user_model

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, timezone_obj):
        return request.user.is_superuser or timezone_obj.user == request.user

class IsNotCrossOriginOrIsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        custom_user = request.GET.get('username')

        if not custom_user or custom_user == request.user.get_username():
            # request is not cross origin
            return True

        if not request.user.is_superuser:
            return False

        custom_user_objs = get_user_model().objects.filter(username=custom_user)

        # user with name in query param not found
        if not custom_user_objs:
            return False

        # user with name in query param is superuser
        return not custom_user_objs[0].is_superuser



