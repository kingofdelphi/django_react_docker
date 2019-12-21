from rest_framework import serializers

from .models import TimeZone

class TimeZoneSerializer(serializers.ModelSerializer):
    # this doesnot get serialized in the json output
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    
    class Meta:
        model = TimeZone
        fields = ('user', 'name', 'city', 'difference_to_GMT')
