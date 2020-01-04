from rest_framework import permissions
from django.contrib.auth import get_user_model

SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']

User = get_user_model()

class IsChangingBelowPermission(permissions.BasePermission):
    def has_object_permission(self, request, view, user_obj):
        if request.method != 'PUT':
            return True
        if request.user.is_superuser:
            if user_obj.id == request.user.id:
                return 'role' in request.data and request.data['role'] == 'admin'
            return 'role' not in request.data or request.data['role'] != 'admin'

        if request.user.is_user_manager:
            if user_obj.id == request.user.id:
                return 'role' in request.data and request.data['role'] == 'user_manager'
            return 'role' not in request.data or request.data['role'] != 'user_manager'

        return not 'role' in request.data or request.data['role'] == 'normal_user'

class IsOwnerOrAdminOrUserManager(permissions.BasePermission):
    def has_object_permission(self, request, view, user_obj):
        if user_obj.id == request.user.id:
            return True
        if not request.user.is_superuser and not request.user.is_user_manager:
            return False

        if request.user.is_superuser:
            # superuser cannot act on other superusers
            return not user_obj.is_superuser

        # user manager cannot act on other usermanagers or superusers
        return not user_obj.is_superuser and not user_obj.is_user_manager

class UserListPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'POST':
            # creating new user
            if 'role' in request.data and request.data['role'] != 'normal_user':
                # guest user cannot create admin user
                if request.user and request.user.is_authenticated and request.user.is_superuser:
                    # admin cannot create admin
                    return request.data['role'] != 'admin'
                return False
            return True

        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated

        return False
