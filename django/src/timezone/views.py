from rest_framework import generics
from rest_framework import permissions, status
from rest_framework.response import Response

from django.contrib.auth import get_user_model

from .models import TimeZone
from .serializers import TimeZoneSerializer, TimeZoneSerializerWithoutUser

from .permissions import IsOwnerOrAdmin, IsNotCrossOriginOrIsSuperUser

class TimeZoneList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated, IsNotCrossOriginOrIsSuperUser)
    serializer_class = TimeZoneSerializer

    def get_queryset(self):
        custom_user = self.request.GET.get('username')
        username = self.request.user.get_username() if not custom_user else custom_user
        queryset = TimeZone.objects.filter(user__username=username)
        return queryset

    def perform_create(self, serializer):
        custom_user = self.request.GET.get('username')
        created_for = get_user_model().objects.get(username=custom_user) if custom_user else self.request.user
        serializer.save(user=created_for)
        
class TimeZoneDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TimeZone.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    serializer_class = TimeZoneSerializerWithoutUser
