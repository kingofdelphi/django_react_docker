from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser

from django.contrib.auth.models import (
    UserManager,
)

class TimeZoneUserManager(UserManager):
    def create_usermanager(self, username, password):
        user = self.create_user(
                username=username,
                password=password,
                )
        user.is_user_manager = True
        user.save(using=self._db)
        return user



class TimeZoneUser(AbstractUser):
    is_user_manager = models.BooleanField(default=False)
    username = models.CharField(max_length=30, unique=True)
    USERNAME_FIELD = 'username'
    
    objects = TimeZoneUserManager()

    @property
    def role(self):
        if self.is_superuser:
            return 'admin'
        if self.is_user_manager:
            return 'user_manager'
        return 'normal_user'


