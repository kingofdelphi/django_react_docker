from rest_framework import serializers

from .models import TimeZone

class TimeZoneSerializer(serializers.ModelSerializer):

    class Meta:
        model = TimeZone
        fields = ('name', 'city', 'difference_to_GMT')
