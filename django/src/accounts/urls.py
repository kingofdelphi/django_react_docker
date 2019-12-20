from rest_framework_jwt.views import obtain_jwt_token
from django.urls import path

from .views import UserList


urlpatterns = [
    path('', UserList.as_view()),
    path('login/', obtain_jwt_token),
]
