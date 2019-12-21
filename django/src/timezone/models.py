from django.db import models

from django.contrib.auth.models import User

# Create your models here.
class TimeZone(models.Model):
    # time zone title
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    name = models.CharField(max_length=40, null=False)

    city = models.CharField(max_length=40, null=False)

    difference_to_GMT = models.CharField(max_length=255, null=False)

    def __str__(self):
        return "{} - {}".format(self.name, self.city)

