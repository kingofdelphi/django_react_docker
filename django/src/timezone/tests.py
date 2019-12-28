# Create your tests here.
from rest_framework.test import APITestCase, APIClient
from rest_framework.views import status
from django.test import override_settings
from django.contrib.auth import get_user_model

import json

from .models import TimeZone

from accounts.tests import AccountTestCase

# to speed up testing use custom hasher
class TimeZoneTest(AccountTestCase):

    def create_timezone(self, data):
        return self.client.post(
            '/timezones/',
            data=json.dumps(data),
            content_type="application/json"
        )

    def update_timezone(self, timezone_id, data):
        return self.client.put(
            '/timezones/{}/'.format(timezone_id),
            data=json.dumps(data),
            content_type="application/json"
        )

    def delete_timezone(self, id):
        return self.client.delete('/timezones/{}/'.format(id))
    
    def test_create_timezone(self):
        data = {
                "name": "Asia",
                "city": "Kathmandu",
                "difference_to_GMT": "+ 3:32"
                }
        response = self.create_timezone(data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.login_user('admin', 'changeme')
        response = self.create_timezone(data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        expected = TimeZone.objects.all()
        self.assertEqual(len(expected), 1)

    def test_admin_vs_guest_cross_user_crud(self):
        data = {
                "name": "Asia",
                "city": "Kathmandu",
                "difference_to_GMT": "+ 3:32"
                }
        self.login_user('guest1', 'changeme')
        response = self.create_timezone(data)
        id1 = response.data['id']

        self.login_user('admin', 'changeme')
        response = self.delete_timezone(id1)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        response = self.create_timezone(data)
        id2 = response.data['id']
            
        # guest tries to delete timezone of admin
        self.login_user('guest1', 'changeme')
        response = self.delete_timezone(id2)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_manager_vs_guest_user_crud(self):
        data = {
                "name": "Asia",
                "city": "Kathmandu",
                "difference_to_GMT": "+ 3:32"
                }
        self.login_user('guest1', 'changeme')
        response = self.create_timezone(data)
        id1 = response.data['id']

        self.login_user('usermanager', 'changeme')
        response = self.delete_timezone(id1)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.create_timezone(data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_timezone_detail_update(self):
        data = {
                "name": "Asia",
                "city": "Kathmandu",
                "difference_to_GMT": "+ 3:32"
                }
        self.login_user('guest1', 'changeme')
        response = self.create_timezone(data)
        id1 = response.data['id']
        data['name'] = "Earth"
        data['city'] = "Pokhara"
        response = self.update_timezone(id1, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data['id'] = id1
        self.assertEqual(response.data, data)

    def test_guest_vs_guest_cross_user_crd(self):
        data = {
                "name": "Asia",
                "city": "Kathmandu",
                "difference_to_GMT": "+ 3:32"
                }
        # guest1 creates timezone
        self.login_user('guest1', 'changeme')
        response = self.create_timezone(data)
        id1 = response.data['id']

        # guest2 creates timezone
        self.login_user('guest2', 'changeme')
        response = self.create_timezone(data)
        id2 = response.data['id']

        # guest2 creates another timezone
        response = self.create_timezone(data)
        id3 = response.data['id']

        # guest 2 tries to delete timezone of guest 1
        response = self.delete_timezone(id1)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # guest 2 tries to delete timezone of guest 2
        response = self.delete_timezone(id2)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # guest 1 tries to delete timezone of guest 2
        self.login_user('guest1', 'changeme')
        response = self.delete_timezone(id3)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # guest 1 tries to delete timezone of guest 1
        response = self.delete_timezone(id1)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def setUp(self):
        super().setUp()
        # create a admin user
        User = get_user_model()
        # create guest users
        User.objects.create_user(
            username="guest1",
            password="changeme",
        )
        User.objects.create_user(
            username="guest2",
            password="changeme",
        )

