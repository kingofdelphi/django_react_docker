from rest_framework import serializers
import re

from .models import TimeZone

#Check if the string contains either "falls" or "stays":

class TimeZoneSerializer(serializers.ModelSerializer):
    # this doesnot get serialized in the json output
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    regex = re.compile(r"(\+|-)\s\d\d?:\d\d?")
    
    def validate_difference_to_GMT(self, value):
        if not self.regex.match(value):
            raise serializers.ValidationError("Incorrect format supplied for GMT time difference")
        return value

    class Meta:
        model = TimeZone
        fields = ('id', 'user', 'name', 'city', 'difference_to_GMT')
