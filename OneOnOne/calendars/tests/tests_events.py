import json
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from calendars.models.calendar import Calendar
from calendars.models.event import Event
from calendars.models.contact import Contact


class EventTestCase(TestCase):
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

        self.contact1 = Contact.objects.create(id=1,
                                               name='John\'s first contact',
                                               email='contact1@email.com',
                                               owner=self.user1)

        self.contact2 = Contact.objects.create(id=2,
                                               name='John\'s second contact',
                                               email='contact2@email.com',
                                               owner=self.user1)

        self.contact3 = Contact.objects.create(id=3,
                                               name='Jane\'s first contact',
                                               email='contact3@email.com',
                                               owner=self.user2)

        self.calendar1 = Calendar.objects.create(
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

        self.event1 = Event.objects.create(
            id=1,
            name='John\'s first event',
            description='Test event',
            calendar=self.calendar1,
            date='2024-04-01',
            start_time='12:00',
            last_modified='2024-04-01',
            attendee=self.contact1
        )

        self.event2 = Event.objects.create(
            id=2,
            name='John\'s second event',
            description='Another test event',
            calendar=self.calendar1,
            date='2024-05-01',
            start_time='13:00',
            last_modified='2024-05-01 13:00',
            attendee=self.contact2
        )

        self.event3 = Event.objects.create(
            id=3,
            name='John\'s event on a different calendar',
            description='Different test event',
            calendar=self.calendar2,
            date='2024-07-01',
            start_time='13:00',
            last_modified='2024-05-01 13:00',
            attendee=self.contact1
        )

    def test_event_create(self):
        client = APIClient()
        data_valid = {
            'name': 'Project meeting',
            'description': 'Jane meeting with her contact',
            'date': '2024-04-12',
            'start_time': '13:30',
            'last_modified': '2025-01-01',
            'attendee': self.contact3.id
        }

        data_missing = {
            'name': 'Malformed event',
            'description': 'This event is missing some fields...'
        }

        # Unauthorized case
        res_unauth = client.post('/calendars/1/events/', data_valid)
        self.assertEquals(res_unauth.status_code, 401)

        # Bad request case
        client.force_authenticate(user=self.user2)
        res_missing = client.post('/calendars/3/events/', data_missing)
        self.assertEquals(res_missing.status_code, 400)

        # Success case
        res_valid = client.post('/calendars/3/events/', data_valid)
        self.assertEquals(res_valid.status_code, 201)

    def test_events_view(self):
        client = APIClient()

        # Unauthorized case
        res_unauth = client.get('/calendars/1/events/')
        self.assertEquals(res_unauth.status_code, 401)

        # Success case (user 1)
        client.force_authenticate(user=self.user1)
        res = client.get('/calendars/1/events/')
        res_body = json.loads(res.content)
        self.assertEquals(res.status_code, 200)
        self.assertEquals(len(res_body), 2)

        res = client.get('/calendars/2/events/')
        res_body = json.loads(res.content)
        self.assertEquals(res.status_code, 200)
        self.assertEquals(len(res_body), 1)

        # Success case (user 2)
        client.force_authenticate(user=self.user2)
        res = client.get('/calendars/3/events/')
        res_body = json.loads(res.content)
        self.assertEquals(res.status_code, 200)
        self.assertEquals(len(res_body), 0)

    def test_event_detail(self):
        client = APIClient()

        # Unauthorized case
        res_unauth = client.get('/calendars/1/events/1/')
        self.assertEquals(res_unauth.status_code, 401)

        # Forbidden case
        client.force_authenticate(user=self.user3)
        res_forbid = client.get('/calendars/1/events/1/')
        self.assertEquals(res_forbid.status_code, 403)

        # Not found case
        client.force_authenticate(user=self.user1)
        res_notfound = client.get('/calendars/1/events/100/')
        self.assertEquals(res_notfound.status_code, 404)

        # Success case
        res_1 = client.get('/calendars/1/events/1/')
        res_1_body = json.loads(res_1.content)
        self.assertEquals(res_1.status_code, 200)
        self.assertEquals(res_1_body["calendar"], 1)

        res_2 = client.get('/calendars/2/events/3/')
        res_2_body = json.loads(res_2.content)
        self.assertEquals(res_2.status_code, 200)
        self.assertEquals(res_2_body["calendar"], 2)

    def test_event_update(self):
        client = APIClient()

        data = {
            'name': 'Updated event name',
            'description': 'Updated event description',
            'date': '2024-04-15',
            'start_time': '14:00',
            'last_modified': '2025-01-01',
            'attendee': self.contact3.id
        }

        # Unauthorized case
        res_unauth = client.put('/calendars/1/events/1/', data=data)
        self.assertEquals(res_unauth.status_code, 401)

        # Forbidden case
        client.force_authenticate(user=self.user2)
        res_forbid = client.put('/calendars/1/events/1/', data=data)
        self.assertEquals(res_forbid.status_code, 403)

        # Not found case
        res_notfound = client.put('/calendars/1/events/100/', data=data)
        self.assertEquals(res_notfound.status_code, 404)

        # Success case
        client.force_authenticate(user=self.user1)
        res_success = client.put('/calendars/1/events/1/', data=data)
        self.assertEquals(res_success.status_code, 200)

    def test_event_delete(self):
        client = APIClient()

        # Unauthorized case
        res_unauth = client.delete('/calendars/1/events/2/')
        self.assertEquals(res_unauth.status_code, 401)

        # Forbidden case
        client.force_authenticate(user=self.user2)
        res_forbid = client.delete('/calendars/1/events/2/')
        self.assertEquals(res_forbid.status_code, 403)

        # Not found case
        res_notfound = client.delete('/calendars/1/events/100/')
        self.assertEquals(res_notfound.status_code, 404)

        # Success case
        client.force_authenticate(user=self.user1)
        res_success = client.delete('/calendars/1/events/1/')
        self.assertEquals(res_success.status_code, 204)
