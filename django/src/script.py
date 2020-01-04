from django.contrib.auth import get_user_model
get_user_model().objects.create_superuser(
        username="admin",
        password="changeme"
        )
