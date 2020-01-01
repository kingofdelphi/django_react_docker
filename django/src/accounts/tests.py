# Create your tests here.
from rest_framework.test import APITestCase, APIClient
from rest_framework.views import status
from django.test import override_settings
from django.contrib.auth import get_user_model

import json

User = get_user_model()

def to_dict(userlist):
    result = dict()
    for user in userlist:
        result[user['username']] = user
    return result

# to speed up testing use custom hasher
@override_settings(PASSWORD_HASHERS=['django.contrib.auth.hashers.MD5PasswordHasher'])
class AccountTestCase(APITestCase):
    client = APIClient()
    
    loginUser = None

    def login_user(self, username, password):
        # initialize every time to remove previous credentials
        self.client = APIClient()
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
        self.loginUser = User.objects.get(username=username)
        self.client.credentials(
            HTTP_AUTHORIZATION='JWT ' + token
        )

    def form_create_user_dump(self, data):
        response = self.client.post(
            '/users/',
            data=json.dumps(data),
            content_type='application/json'
        )
        return response

    def form_create_user(self, username, password1, password2):
        response = self.client.post(
            '/users/',
            data=json.dumps({
                'username': username,
                'first_name': '',
                'last_name': '',
                'password': password1,
                'password1': password2
            }),
            content_type='application/json'
        )
        return response

    def form_change_password(self, user_id, current_password, password, password1):
        response = self.client.put(
            '/users/{}/password/'.format(user_id),
            data=json.dumps({
                'current_password': current_password,
                'password': password,
                'password1': password1
            }),
            content_type='application/json'
        )
        return response

    def delete_user(self, userid):
        response = self.client.delete('/users/{}/'.format(userid))
        return response

    def get_users(self):
        response = self.client.get('/users/')
        return response

    def get_user(self, userid):
        response = self.client.get('/users/{}/'.format(userid))
        return response

    def update_user(self, userid, data):
        response = self.client.put(
                '/users/{}/'.format(userid),
                data=json.dumps(data),
                content_type='application/json'
                )
        return response

    def setUp(self):
        self.admin = User.objects.create_superuser(
            username="admin",
            password="changeme"
        )

        self.usermanager = User.objects.create_usermanager(
            username="usermanager",
            password="changeme",
        )

class UsersTest(AccountTestCase):

    def test_unauthorized(self):
        response = self.get_user(2)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

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

        response = self.form_create_user('uttam', 'Hacker123!', 'Hacker123!')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.form_create_user('michael', 'Hacker1234!', None)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_manager_crud(self):
        self.login_user('usermanager', 'changeme')
        uttam = User.objects.create_user(
            username="uttam",
            password="changeme",
        )

        # user manager doesn't have permission over admin
        response = self.delete_user(self.admin.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.get_user(uttam.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.delete_user(uttam.id)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # act on other user manager
        uttam = User.objects.create_usermanager(
            username="uttam",
            password="changeme",
        )
        response = self.delete_user(uttam.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


    def test_guest_update(self):
        uttam = User.objects.create_user(
            username="uttam",
            password="changeme",
        )

        michael = User.objects.create_user(
            username="michael",
            password="changeme",
        )
        self.login_user('uttam', 'changeme')

        # retrieve info of michael
        response = self.get_user(michael.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # update with bad password
        data = dict(
                username='uttam',
                first_name='',
                last_name='',
                password='hack',
                password1='hack'
                )
        response = self.update_user(uttam.id, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = dict(
                username='uttam',
                )
        response = self.update_user(uttam.id, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = dict(
                password='hack123!',
                password1='hack123!',
                )
        response = self.update_user(uttam.id, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # update with correct password
        data = dict(
                username='uttam',
                first_name='',
                last_name='',
                password='Hacker123!',
                password1='Hacker123!'
                )
        response = self.update_user(uttam.id, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # update username
        data = dict(
                username='wrong_user',
                first_name='',
                last_name='',
                password='Hacker123!',
                password1='Hacker123!'
                )
        response = self.update_user(uttam.id, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        #jwt depends on username
        response = self.get_user(uttam.id)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.login_user('wrong_user', 'Hacker123!')
        response = self.update_user(uttam.id, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_get(self):
        uttam = User.objects.create_user(
            username="uttam",
            password="changeme",
        )
        self.login_user('admin', 'changeme')
        response = self.get_user(uttam.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.get_user(self.usermanager.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.login_user('usermanager', 'changeme')

        response = self.get_user(uttam.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.get_user(self.admin.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.get_user(self.usermanager.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_guest_crd(self):
        uttam = User.objects.create_user(
            username="uttam",
            password="changeme",
        )
        guest = User.objects.create_user(
            username="guest",
            password="changeme",
        )
        self.login_user('uttam', 'changeme')

        # retrieve info of admin
        response = self.get_user(self.admin.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # retrieve info of user manager
        response = self.get_user(self.usermanager.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # retrieve info of guest
        response = self.get_user(guest.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # retrieve info of self
        response = self.get_user(uttam.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # delete admin
        response = self.delete_user(self.admin.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # delete guest
        response = self.delete_user(guest.id)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # delete self
        response = self.delete_user(uttam.id)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        

    def test_admin_crud(self):
        self.login_user('admin', 'changeme')
        uttam = User.objects.create_user(
            username="uttam",
            password="changeme",
        )
        # destroy account
        response = self.get_user(uttam.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # try updating account
        response = self.update_user(uttam.id, dict(username='michael'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.update_user(uttam.id, dict(username='okedy', first_name='', last_name='', password='1234!!!23a', password1='1234!!!23a'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.update_user(uttam.id, dict(username='uttami', first_name='', last_name='', password='1234!!!23a', password1='1234!!!23a'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.delete_user(uttam.id)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # destroy it again 
        response = self.delete_user(uttam.id)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # admin deletes user manager
        response = self.delete_user(self.usermanager.id)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # destroy logged in user 
        response = self.delete_user(self.admin.id)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # try requesting again
        response = self.get_user(uttam.id)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_password(self):
        uttam = User.objects.create_user(
            username="uttam",
            password="changeme",
        )
        response = self.form_change_password(uttam.id, 'changeme', 'Hacker123!', 'Hacker123!')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.login_user('admin', 'changeme')

        # try to change other users password
        response = self.form_change_password(uttam.id, 'changeme', 'Hacker123!', 'Hacker123!')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # change password
        response = self.form_change_password(self.admin.id, 'changeme', None, 'Hacker123!')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.form_change_password(self.admin.id, 'changeme', 'Hacker123!', 'Hacker123!')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # try login using old password
        self.assertRaises(TypeError, self.login_user, 'admin', 'changeme')
        self.login_user('admin', 'Hacker123!')

        #set password to same
        response = self.form_change_password(self.admin.id, 'Hacker123!', 'Hacker123!', 'Hacker123!')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # set password to different
        response = self.form_change_password(self.admin.id, 'Hacker123!', 'IHacker123!', 'IHacker123!')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_list(self):
        response = self.get_users()
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.login_user('admin', 'changeme')
        response = self.get_users()
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        users = json.loads(json.dumps(response.data))
        for user in users:
            user.pop('id')
        expected_users = [
                {"username": "admin", "role": "admin", "first_name": "", "last_name": ""}, 
                {"username": "usermanager", "role": "user_manager", "first_name": "", "last_name": ""}
                ]

        self.assertEqual(to_dict(users), to_dict(expected_users))

        uttam = User.objects.create_user(
            username="uttam",
            password="changeme",
        )
        response = self.get_users()
        users = json.loads(json.dumps(response.data))
        for user in users:
            user.pop('id')
        expected_users = [
                {"username": "admin", "role": "admin", "first_name": "", "last_name": ""}, 
                {"username": "usermanager", "role": "user_manager", "first_name": "", "last_name": ""},
                {"username": "uttam", "role": "normal_user", "first_name": "", "last_name": ""},
                ]

        self.assertEqual(to_dict(users), to_dict(expected_users))


        self.login_user('uttam', 'changeme')
        response = self.get_users()
        users = json.loads(json.dumps(response.data))
        for user in users:
            user.pop('id')
        expected_users = [{"username": "uttam", "role": "normal_user", "first_name": "", "last_name": ""}]
        self.assertEqual(users, expected_users)

        usermanager = User.objects.create_usermanager(
            username="michael",
            password="changeme",
        )
        self.login_user('usermanager', 'changeme')
        response = self.get_users()
        users = json.loads(json.dumps(response.data))
        for user in users:
            user.pop('id')
        expected_users = [
                {"username": "usermanager", "role": "user_manager", "first_name": "", "last_name": ""}, 
                {"username": "uttam", "role": "normal_user", "first_name": "", "last_name": ""}
                ]
        self.assertEqual(to_dict(users), to_dict(expected_users))

        admin2 = User.objects.create_superuser(
            username="admin2",
            password="changeme",
        )
        self.login_user('admin2', 'changeme')
        response = self.get_users()
        users = json.loads(json.dumps(response.data))
        for user in users:
            user.pop('id')

        expected_users = [
                {"username": "admin2", "role": "admin", "first_name": "", "last_name": ""}, 
                {"username": "usermanager", "role": "user_manager", "first_name": "", "last_name": ""},
                {"username": "michael", "role": "user_manager", "first_name": "", "last_name": ""},
                {"username": "uttam", "role": "normal_user", "first_name": "", "last_name": ""},
                ]

        self.assertEqual(to_dict(users), to_dict(expected_users))

        self.login_user('uttam', 'changeme')
        response = self.get_users()
        users = json.loads(json.dumps(response.data))
        for user in users:
            user.pop('id')
        expected_users = [
                {"username": "uttam", "role": "normal_user", "first_name": "", "last_name": ""},
                ]
        self.assertEqual(to_dict(users), to_dict(expected_users))

    def test_admin_self_detail(self):
        # no login
        response = self.get_user(1)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # login and retrieve
        self.login_user('admin', 'changeme')
        response = self.get_user(self.admin.id)
        expected_user = {'id': self.admin.id, "username": "admin", "role": "admin", "first_name": "", "last_name": ""}
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(expected_user, response.data)

        data = {"username": "admin", "role": "admin", "password": "ok"}
        response = self.update_user(self.admin.id, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {"username": "admin", "role": "admin", "password": "ok", "password1": "ok"}
        response = self.update_user(self.admin.id, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {"username": "admin", 'role': 'admin', 'first_name':'', 'last_name':'', "password": "Hacker123!", "password1": "Hacker123!"}
        response = self.update_user(self.admin.id, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = {"password": "Hacker123!", 'role': 'admin', 'first_name':'', 'last_name':'', "password1": "Hacker123!"}
        response = self.update_user(self.admin.id, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data = {"username": "adminis", 'role': 'admin', 'first_name':'', 'last_name':'', "password": "Hacker123!", "password1": "Hacker123!"}
        response = self.update_user(self.admin.id, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)

        response = self.get_user(self.admin.id)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.login_user('adminis', 'Hacker123!')

    def test_create_user_with_role(self):
        self.login_user('admin', 'changeme')
        data = {
                "username": "china", 
                "role": "admin", 
                "first_name": "", 
                "last_name": "", 
                "password": "Hacker123!",
                "password1": "Hacker123!",
                }
        response = self.form_create_user_dump(data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # admin cannot create user with role admin
        data['role'] = 'normal_user'
        response = self.form_create_user_dump(data)
        self.assertEqual(response.data['role'], 'normal_user')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        data['role'] = 'user_manager'
        data['username'] = 'uttam'

        response = self.form_create_user_dump(data)
        uttamid = response.data['id']
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['role'], 'user_manager')
        
        # demote admin to user manager
        data['username'] = 'admin'
        response = self.update_user(self.admin.id, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        data.pop('role')
        response = self.update_user(self.admin.id, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        data['role'] = 'nidoormal_user'
        response = self.update_user(uttamid, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        data['role'] = 'normal_user'
        data['username'] = 'uttam'
        response = self.update_user(uttamid, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['role'], 'normal_user')
        self.login_user('uttam', 'Hacker123!')

        data.pop('role')
        response = self.update_user(uttamid, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['role'], 'normal_user')

