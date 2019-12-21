from django.urls import path

from .views import TimeZoneList, TimeZoneDetail


urlpatterns = [
    path('', TimeZoneList.as_view()),
    path('<int:pk>/', TimeZoneDetail.as_view()),
]
