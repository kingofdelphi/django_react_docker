from rest_framework import generics

from rest_framework import permissions, status
from django.shortcuts import get_object_or_404

from rest_framework.response import Response

from .models import TimeZone
from .serializers import TimeZoneSerializer

# Create your views here.
class TimeZoneList(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        queryset = TimeZone.objects.filter(user=user)
        return queryset

    def list(self, request):
        # Note the use of `get_queryset()` instead of `self.queryset`
        queryset = self.get_queryset()
        serializer = TimeZoneSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        # serializer needs context to automatically add current user to the timezone
        # about to be created
        serializer = TimeZoneSerializer(data=request.data, context={"request": self.request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TimeZoneDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = TimeZone.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
