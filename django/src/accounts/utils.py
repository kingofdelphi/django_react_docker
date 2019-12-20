from .serializers import UserSerializer

def jwt_response_handler(token, user=None, request=None):
    return {
        'token': token,
        'username': UserSerializer(user, context={'request': request}).data['username']
    }
