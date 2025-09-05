import json
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from calendars.models.calendar import Calendar


class CalendarTestCase(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1',
                                              email='user1@email.com',
                                              password='password1',
                                              first_name='John',
                                              last_name='Doe')

        self.user2 = User.objects.create_user(username='user2',
                                              email='user2@email.com',
                                              password='password2',
                                              first_name='Jane',
                                              last_name='Kennedy')

        self.user3 = User.objects.create_user(username='user3',
                                              email='user3@email.com',
                                              password='password3',
                                              first_name='Billy',
                                              last_name='Bob')

        self.calendar1_1 = Calendar.objects.create(
            id=1,
            name='John\'s first calendar',
            description='First calendar',
            start_date='2024-01-01',
            end_date='2024-12-31',
            duration=30,
            deadline='2025-01-01',
            owner=self.user1,
            finalized=False
        )

        self.calendar2 = Calendar.objects.create(
            id=2,
            name='John\'s second calendar',
            description='Second calendar',
            start_date='2024-01-01',
            end_date='2024-12-31',
            duration=30,
            deadline='2025-01-01',
            owner=self.user1,
            finalized=False
        )

        self.calendar3 = Calendar.objects.create(
            id=3,
            name='Jane\'s calendar',
            description='Calendar created for CSC309',
            start_date='2024-01-01',
            end_date='2024-12-31',
            duration=30,
            deadline='2025-01-01',
            owner=self.user2,
            finalized=False
        )

    def test_calendar_create(self):
        client = APIClient()
        data_valid = {
            'name': '1on1 New Calendar',
            'description': 'A calendar created via the /calendars/ endpoint',
            'start_date': '2024-01-01',
            'end_date': '2024-12-31',
            'duration': 30,
            'deadline': '2025-01-01'
        }

        data_missing = {
            'name': '1on1 Calendar',
            'description': 'This data is missing some fields',
            'start_date': '2024-01-01',
        }

        # Unauthorized case
        res_unauth = client.post('/calendars/', data_valid)
        self.assertEquals(res_unauth.status_code, 401)

        # Bad request case
        client.force_authenticate(user=self.user1)
        res_missing = client.post('/calendars/', data_missing)
        self.assertEquals(res_missing.status_code, 400)

        # Success case
        res_valid = client.post('/calendars/', data_valid)
        self.assertEquals(res_valid.status_code, 201)

    def test_calendars_view(self):
        client = APIClient()

        # Unauthorized case
        res_unauth = client.get('/calendars/')
        self.assertEquals(res_unauth.status_code, 401)

        # Success case (user 1)
        client.force_authenticate(user=self.user1)
        res = client.get('/calendars/')
        res_body = json.loads(res.content)
        self.assertEquals(res.status_code, 200)
        self.assertEquals(len(res_body), 2)

        # Success case (user 2)
        client.force_authenticate(user=self.user2)
        res = client.get('/calendars/')
        res_body = json.loads(res.content)
        self.assertEquals(res.status_code, 200)
        self.assertEquals(len(res_body), 1)

        # Success case (user 3)
        client.force_authenticate(user=self.user3)
        res = client.get('/calendars/')
        res_body = json.loads(res.content)
        self.assertEquals(res.status_code, 200)
        self.assertEquals(len(res_body), 0)

    def test_calendar_detail(self):
        client = APIClient()

        # Unauthorized case
        res_unauth = client.get('/calendars/1/')
        self.assertEquals(res_unauth.status_code, 401)

        # Forbidden case
        client.force_authenticate(user=self.user3)
        res_forbid = client.get('/calendars/1/')
        self.assertEquals(res_forbid.status_code, 403)

        # Not found case
        res_notfound = client.get('/calendars/100/')
        self.assertEquals(res_notfound.status_code, 404)

        # Success case (user 1)
        client.force_authenticate(user=self.user1)
        res_1 = client.get('/calendars/1/')
        res_1_body = json.loads(res_1.content)
        self.assertEquals(res_1.status_code, 200)
        self.assertEquals(res_1_body["owner"], self.user1.id)

        res_2 = client.get('/calendars/2/')
        res_2_body = json.loads(res_2.content)
        self.assertEquals(res_2.status_code, 200)
        self.assertEquals(res_2_body["owner"], self.user1.id)

        # Success case (user 2)
        client.force_authenticate(user=self.user2)
        res_3 = client.get('/calendars/3/')
        res_3_body = json.loads(res_3.content)
        self.assertEquals(res_3.status_code, 200)
        self.assertEquals(res_3_body["owner"], self.user2.id)

    def test_calendar_update(self):
        client = APIClient()

        data = {
            'name': 'John\'s first calendar',
            'description': 'A new description for John\'s first calendar',
            'start_date': '2024-01-01',
            'end_date': '2024-12-31',
            'duration': 30,
            'deadline': '2025-01-01',
            'owner': self.user1,
            'finalized': False
        }

        bad_data = {
            'description': 'A new description for John\'s first calendar',
        }

        # Unauthorized case
        res_unauth = client.put('/calendars/1/', data=data)
        self.assertEquals(res_unauth.status_code, 401)

        # Forbidden case
        client.force_authenticate(user=self.user3)
        res_forbid = client.put('/calendars/1/', data=data)
        self.assertEquals(res_forbid.status_code, 403)

        # Not found case
        res_notfound = client.put('/calendars/100/', data=data)
        self.assertEquals(res_notfound.status_code, 404)

        # Bad request case
        client.force_authenticate(user=self.user1)
        res_bad = client.put('/calendars/1/', data=bad_data)
        self.assertEquals(res_bad.status_code, 400)

        # Success case
        res = client.put('/calendars/1/', data=data)
        res_body = json.loads(res.content)
        self.assertEquals(res.status_code, 200)
        self.assertEquals(res_body["id"], 1)
        self.assertEquals(res_body["description"], data["description"])

    def test_calendar_delete(self):
        client = APIClient()

        # Unauthorized case
        res_unauth = client.delete('/calendars/1/')
        self.assertEquals(res_unauth.status_code, 401)

        # Forbidden case
        client.force_authenticate(user=self.user3)
        res_forbid = client.delete('/calendars/1/')
        self.assertEquals(res_forbid.status_code, 403)

        # Not found case
        res_notfound = client.delete('/calendars/100/')
        self.assertEquals(res_notfound.status_code, 404)

        # Success case (user 1)
        client.force_authenticate(user=self.user1)
        res = client.delete('/calendars/1/')
        res_get = json.loads(client.get('/calendars/').content)
        self.assertEquals(res.status_code, 204)
        self.assertEquals(len(res_get), 1)

        # Success case (user 2)
        client.force_authenticate(user=self.user2)
        res = client.delete('/calendars/3/')
        res_get = json.loads(client.get('/calendars/').content)
        self.assertEquals(res.status_code, 204)
        self.assertEquals(len(res_get), 0)
