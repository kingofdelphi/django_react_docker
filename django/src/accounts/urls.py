from django.urls import path

from .views import UserDetail, UserList, PasswordChangeView


urlpatterns = [
    path('', UserList.as_view()),
    path('<pk>/', UserDetail.as_view()),
    path('<pk>/password/', PasswordChangeView.as_view()),
]
