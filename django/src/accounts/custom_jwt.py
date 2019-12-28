from datetime import datetime
from calendar import timegm
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.utils  import jwt_payload_handler as base_jwt_payload_handler

def jwt_payload_handler(user):
    """ Custom payload handler
    Token encrypts the dictionary returned by this function, and can be decoded by rest_framework_jwt.utils.jwt_decode_handler
    """
    payload = base_jwt_payload_handler(user)

    payload.update(last_login=timegm(user.last_login.utctimetuple()))
    return payload
