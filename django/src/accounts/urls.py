from django.urls import path

from .views import UserDetail, UserList, LoginView, PasswordChangeView


urlpatterns = [
    path('', UserList.as_view()),
    path('<username>/', UserDetail.as_view()),
    path('<username>/password/', PasswordChangeView.as_view()),
]
