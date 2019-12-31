from rest_framework.views import APIView
from rest_framework import generics
from rest_framework_jwt.settings import api_settings
from rest_framework import permissions, status
from rest_framework.response import Response

from django.contrib.auth import get_user_model
from django.db.models import Q
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login

from .utils import get_user_role
from .permissions import \
        IsOwnerOrAdminOrUserManager, \
        UserListPermission

from .serializers import UserSerializer, \
        PasswordEqualitySerializer, \
        LoginUserSerializer, \
        ChangePasswordSerializer, \
        UserSerializerWithToken

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class UserList(generics.ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (UserListPermission, )

    def get_queryset(self):
        queryset = get_user_model().objects.all()
        if self.request.user.is_superuser:
            return queryset.filter(
                    Q(id=self.request.user.id) | 
                    Q(is_superuser=False)
                )
        if self.request.user.is_user_manager:
            return queryset.filter(
                    Q(id=self.request.user.id) | 
                    (Q(is_superuser=False) & Q(is_user_manager=False))
                )
        return queryset.filter(Q(id=self.request.user.id))

    def post(self, request, format=None):
        password_equality_serializer = PasswordEqualitySerializer(
            data={
                'password': request.data.get('password'),
                'password1': request.data.get('password1'),
            }
        )
        register_user_serializer = UserSerializer(data=request.data)
        valid1 = password_equality_serializer.is_valid()
        valid2 = register_user_serializer.is_valid()
        if valid1 and valid2:
            register_user_serializer.save()
            return Response(register_user_serializer.data, status=status.HTTP_201_CREATED)

        # CAUTION: non-field-errors must be merged separately *************************
        errors = { **register_user_serializer.errors, **password_equality_serializer.errors }
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(generics.CreateAPIView):
    
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        user_serializer = LoginUserSerializer(data=request.data)
        if not user_serializer.is_valid():
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # manually update the last_login time, 
            # the problem may be because we are just using JWT authentication only
            update_last_login(None, user)
            data = {
                "username": username,
                "id": user.id,
                "role": get_user_role(user),
                "token": jwt_encode_handler(jwt_payload_handler(user)),
            }
            return Response(data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

class LoginInfoView(generics.RetrieveAPIView):

    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        data = {
                "username": request.user.get_username(),
                "id": request.user.id,
                "role": get_user_role(request.user),
                }
        return Response(data)

class PasswordChangeView(generics.UpdateAPIView):
    
    queryset = get_user_model().objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        if request.user.id != int(kwargs['pk']):
            return Response(status=status.HTTP_403_FORBIDDEN)
        serializer = ChangePasswordSerializer(data=request.data, context=dict(user=request.user))
        if serializer.is_valid():
            request.user.set_password(request.data['password1'])
            request.user.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = get_user_model().objects.all()
    def get_serializer_class(self):
        if self.request.method == 'PUT' and int(self.kwargs['pk']) == self.request.user.id:
            return UserSerializerWithToken
        return UserSerializer
    # bitwise or is not working
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdminOrUserManager]
