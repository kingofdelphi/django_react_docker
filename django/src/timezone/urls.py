from django.urls import path

from .views import TimeZoneList


urlpatterns = [
    path('', TimeZoneList.as_view()),
]
