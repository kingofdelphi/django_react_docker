# Create your tests here.
from rest_framework.test import APITestCase, APIClient
from rest_framework.views import status
from django.test import override_settings
from django.contrib.auth import get_user_model

import json

User = get_user_model()

# to speed up testing use custom hasher
@override_settings(PASSWORD_HASHERS=['django.contrib.auth.hashers.MD5PasswordHasher'])
class AccountTestCase(APITestCase):
    client = APIClient()

    def login_user(self, username, password):
        response = self.client.post(
            '/login/',
            data=json.dumps({
                'username': username,
                'password': password
            }),
            content_type='application/json'
        )
        token = response.data['token']
        # set the token in the header
        self.client.credentials(
            HTTP_AUTHORIZATION='JWT ' + token
        )

    def form_create_user(self, username, password1, password2):
        response = self.client.post(
            '/users/',
            data=json.dumps({
                'username': username,
                'password': password1,
                'password1': password2
            }),
            content_type='application/json'
        )
        return response

    def delete_user(self, username):
        response = self.client.delete('/users/{}/'.format(username))
        return response

    def get_user(self, username):
        response = self.client.get('/users/{}/'.format(username))
        return response

    def update_user(self, username, data):
        response = self.client.put(
                '/users/{}/'.format(username),
                data=json.dumps(data),
                content_type='application/json'
                )
        return response

    def setUp(self):
        print('setting up users')
        User.objects.create_superuser(
            username="admin",
            password="changeme"
        )

        User.objects.create_usermanager(
            username="usermanager",
            password="changeme",
        )

class UsersTest(AccountTestCase):

    def test_form_create_user(self):
        # password null supplied error check
        response = self.form_create_user('uttam', None, None)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.form_create_user('uttam', 'a', 'b')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.form_create_user('uttam', 'changeme', 'changeme')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.form_create_user('uttam', 'Hacker123!', 'Hacker123!')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_manager_crud(self):
        self.login_user('usermanager', 'changeme')
        User.objects.create_user(
            username="uttam",
            password="changeme",
        )

        # user manager doesn't have permission over admin
        response = self.delete_user('admin')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.delete_user('uttam')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # act on other user manager
        User.objects.create_usermanager(
            username="uttam",
            password="changeme",
        )
        response = self.delete_user('uttam')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_guest_update(self):
        User.objects.create_user(
            username="uttam",
            password="changeme",
        )
        self.login_user('uttam', 'changeme')

        # update with bad password
        data = dict(
                username='uttam',
                password='hack'
                )
        response = self.update_user('uttam', data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # update with correct password
        data = dict(
                username='uttam',
                password='Hacker123!'
                )
        response = self.update_user('uttam', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # update with username not matching logged in user
        data = dict(
                username='wrong_user',
                password='Hacker123!'
                )
        response = self.update_user('uttam', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_guest_crd(self):
        User.objects.create_user(
            username="uttam",
            password="changeme",
        )
        User.objects.create_user(
            username="guest",
            password="changeme",
        )
        self.login_user('uttam', 'changeme')

        # retrieve info of admin
        response = self.get_user('admin')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # retrieve info of user manager
        response = self.get_user('usermanager')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # retrieve info of guest
        response = self.get_user('guest')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # retrieve info of self
        response = self.get_user('uttam')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # delete admin
        response = self.delete_user('admin')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # delete guest
        response = self.delete_user('guest')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # delete self
        response = self.delete_user('uttam')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_admin_crud(self):
        self.login_user('admin', 'changeme')
        User.objects.create_user(
            username="uttam",
            password="changeme",
        )
        # destroy account
        response = self.get_user('uttam')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.delete_user('uttam')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # destroy it again 
        response = self.delete_user('uttam')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # destroy logged in user 
        response = self.delete_user('admin')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


