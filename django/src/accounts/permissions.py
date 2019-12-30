from rest_framework import permissions
from django.contrib.auth import get_user_model

SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']

User = get_user_model()

class IsOwnerOrAdminOrUserManager(permissions.BasePermission):
    def has_object_permission(self, request, view, user_obj):
        if user_obj.username == request.user.get_username():
            return True
        if not request.user.is_superuser and not request.user.is_user_manager:
            return False

        user_owning_obj = User.objects.get(username=user_obj.username)

        if request.user.is_superuser:
            # superuser cannot act on other superusers
            return not user_owning_obj.is_superuser

        # user manager cannot act on other usermanagers or superusers
        return not user_owning_obj.is_superuser and not user_owning_obj.is_user_manager

class UserListPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            # creating new user
            return True

        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated

        return False
