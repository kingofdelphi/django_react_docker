# Create your tests here.
from rest_framework.views import status
from django.contrib.auth import get_user_model

import json

from .models import TimeZone
from .serializers import TimeZoneSerializer

from accounts.tests import AccountTestCase

# to speed up testing use custom hasher
class TimeZoneTest(AccountTestCase):

    def create_timezone(self, data, user = None):
        return self.client.post(
            '/timezones/{}'.format('?username={}'.format(user) if user else ''),
            data=json.dumps(data),
            content_type="application/json"
        )

    def update_timezone(self, timezone_id, data):
        return self.client.put(
            '/timezones/{}/'.format(timezone_id),
            data=json.dumps(data),
            content_type="application/json"
        )

    def get_timezone(self, timezone_id):
        return self.client.get(
            '/timezones/{}/'.format(timezone_id),
        )

    def get_timezones(self, user = None):
        return self.client.get(
            '/timezones/{}'.format('?username={}'.format(user) if user else '')
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

    def test_time_difference_validity(self):
        self.login_user('admin', 'changeme')
        data = {
                "name": "Asia",
                "city": "Kathmandu",
                "difference_to_GMT": "+ 3:32"
                }
        response = self.create_timezone(data, 'admin')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data['difference_to_GMT'] = 'a 3:3'
        response = self.create_timezone(data, 'admin')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data['difference_to_GMT'] = '- 3:3'
        response = self.create_timezone(data, 'admin')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data['difference_to_GMT'] = '- 12:3'
        response = self.create_timezone(data, 'admin')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data['difference_to_GMT'] = '- 11:388'
        response = self.create_timezone(data, 'admin')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data['difference_to_GMT'] = '- 11:38'
        response = self.create_timezone(data, 'admin')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data['difference_to_GMT'] = '- 11:60'
        response = self.create_timezone(data, 'admin')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data['difference_to_GMT'] = '- 11:59'
        response = self.create_timezone(data, 'admin')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data['difference_to_GMT'] = '+ 13:59'
        response = self.create_timezone(data, 'admin')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data['difference_to_GMT'] = '+ 13:60'
        response = self.create_timezone(data, 'admin')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data['difference_to_GMT'] = '+ 13:6a'
        response = self.create_timezone(data, 'admin')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_timezone_list(self):
        response = self.get_timezones()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.login_user('admin', 'changeme')
        response = self.get_timezones()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = {
                "name": "Asia",
                "city": "Kathmandu",
                "difference_to_GMT": "+ 3:32"
                }
        response = self.create_timezone(data, 'admin')
        result = response.data.pop('id')
        self.assertEqual(response.data, data)

        data = {
                "name": "for you",
                "city": "abcd",
                "difference_to_GMT": "+ 2:32"
                }
        response = self.create_timezone(data, 'guest1')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        id = response.data['id']
        result = response.data.pop('id')
        self.assertEqual(response.data, data)

        data = {
                "name": "for you too",
                "city": "abcdefgh",
                "difference_to_GMT": "+ 2:32"
                }
        response = self.update_timezone(id, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        result = response.data.pop('id')
        self.assertEqual(response.data, data)

        response = self.get_timezones('guest1')
        expected = response.data
        for i in expected:
            i.pop('id')
        self.assertEqual([data], expected)

        self.login_user('usermanager', 'changeme')
        response = self.get_timezones('guest1')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.get_timezones('usermanager')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

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

        # admin retrieves timezone of guest1
        response = self.get_timezone(id1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected = {**data, 'id': id1}
        self.assertEqual(TimeZoneSerializer(response.data).data, expected)

        # admin updates timezone of guest1
        data = {
                "name": "Mumbai",
                "city": "Kathmandu",
                "difference_to_GMT": "+ 3:32"
                }
        response = self.update_timezone(id1, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected = {**data, 'id': id1}
        self.assertEqual(TimeZoneSerializer(response.data).data, expected)

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

        response = self.get_timezone(id1)
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

        # invalid id sent in put data, it is ignored, as resource id is obtained from url
        data = {
                'id': 20,
                "name": "America",
                "city": "New York",
                "difference_to_GMT": "- 2:32"
                }
        response = self.update_timezone(id1, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # missing fields
        data.pop('name')
        response = self.update_timezone(id1, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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

