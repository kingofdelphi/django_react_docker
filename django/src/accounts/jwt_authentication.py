from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.settings import api_settings

from rest_framework import exceptions

from calendar import timegm

jwt_decode_handler = api_settings.JWT_DECODE_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

# disallow concurrent sessions for same user
class Authentication(JSONWebTokenAuthentication):
    def authenticate(self, request):
        response = super().authenticate(request)
        if not response:
            return response
        user, payload = response
        data = jwt_decode_handler(payload)

        last_login_to_utc = timegm(user.last_login.utctimetuple())
        if data['last_login'] != last_login_to_utc:
            msg = _('Signature has expired due to login from different system.')
            raise exceptions.AuthenticationFailed(msg)
        return user, payload
