from django.urls import path

from .views import UserList, LoginView


urlpatterns = [
    path('', UserList.as_view()),
    # removed obtain_jwt_token as
    # it was sending 400 bad request on login fail, but 401 unauthorized
    # looks proper
    path('login/', LoginView.as_view()),
]
