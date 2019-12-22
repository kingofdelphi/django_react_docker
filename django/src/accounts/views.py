from rest_framework.views import APIView
from rest_framework import generics

from rest_framework_jwt.settings import api_settings

from django.contrib.auth import authenticate

from rest_framework import permissions, status
from rest_framework.response import Response

# Get the JWT settings, add these lines after the import/from lines
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


from .serializers import UserSerializer, PasswordEqualitySerializer

# Create your views here.

class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = PasswordEqualitySerializer(
            data={
                'password1': request.data.get('password'),
                'password2': request.data.get('password1'),
            }
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(generics.CreateAPIView):
    
    permission_classes = (permissions.AllowAny,)

    def post(self, request, *args, **kwargs):
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            data = {
                "username": username,
                "token": jwt_encode_handler(jwt_payload_handler(user)),
            }
            return Response(data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)

