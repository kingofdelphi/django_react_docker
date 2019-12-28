from django.urls import path

from .views import UserDetail, UserList, LoginView

urlpatterns = [
    path('', UserList.as_view()),
    path('<username>/', UserDetail.as_view()),
]
