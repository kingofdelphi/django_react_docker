from rest_framework import serializers
import re
from django.contrib.auth import get_user_model

from .models import TimeZone

regex = re.compile(r"(\+|-)\s(\d\d?):(\d\d?)")

class BaseTimeZoneSerializer(serializers.ModelSerializer):
    
    def validate_difference_to_GMT(self, value):
        match_info = regex.match(value)
        if not match_info:
            raise serializers.ValidationError("Format must be +/- H:M e.g. + 5:45")
        sign = 1 if match_info.group(1) == '+' else -1
        hours = int(match_info.group(2))
        mins = int(match_info.group(3))
        minDiff = -12 * 60
        maxDiff = 14 * 60

        minutes = sign * (hours * 60 + mins)

        if sign * hours >= -12 and sign * hours <= 14 and mins < 60 and minDiff <= minutes <= maxDiff:
            return value
        raise serializers.ValidationError("Value must be within range [-12:00, +14:00] ")

    class Meta:
        model = TimeZone

class TimeZoneSerializer(BaseTimeZoneSerializer):
    # this doesnot get serialized in the json output
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = TimeZone
        fields = ('id', 'user', 'name', 'city', 'difference_to_GMT')

class TimeZoneSerializerWithoutUser(BaseTimeZoneSerializer):
    class Meta:
        model = TimeZone
        fields = ('id', 'name', 'city', 'difference_to_GMT')
