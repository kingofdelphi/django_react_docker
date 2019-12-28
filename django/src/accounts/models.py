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
    
    objects = TimeZoneUserManager()

