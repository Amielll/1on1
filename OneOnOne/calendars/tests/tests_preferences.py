import json
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from calendars.models.calendar import Calendar
from calendars.models.event import Event
from calendars.models.contact import Contact
from calendars.models.invitee import Invitee

class PreferenceTestCase(TestCase):
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

        self.invitee1 = Invitee.objects.create(
            id=1,
            calendar=self.calendar1,
            contact=self.contact1
        )

        self.invitee2 = Invitee.objects.create(
            id=2,
            calendar=self.calendar1,
            contact=self.contact2
        )

        self.invitee3 = Invitee.objects.create(
            id=3,
            calendar=self.calendar3,
            contact=self.contact3
        )
    
    def test_preference_create(self):
        client = APIClient()
        owner_pref_valid = {
            'level': 1,
            'start': '2024-01-02T13:00:00'
        }

        invitee_pref_valid = {
            'level': 1,
            'start': '2024-01-02T13:00:00',
            'invitee': 1
        }

        # No invitee field and No Auth
        res_unauth_no_invitee = client.post('/calendars/1/preferences/', owner_pref_valid)
        self.assertEquals(res_unauth_no_invitee.status_code, 400)

        # Invitee field and Auth
        client.force_authenticate(user=self.user1)
        res_auth_invitee = client.post('/calendars/1/preferences/', invitee_pref_valid)
        self.assertEquals(res_auth_invitee.status_code, 201)
        
        # Incorrect User
        client.force_authenticate(user=self.user1)
        res_wrong_auth = client.post('/calendars/1/preferences/', owner_pref_valid)
        self.assertEquals(res_wrong_auth.status_code, 400)

    def test_preference_update(self):
        client = APIClient()
        invitee_pref_valid = {
            'level': 1,
            'start': '2024-01-02T13:00:00',
            'invitee': 1
        }

        res_unauth_invitee = client.post('/calendars/1/preferences/', invitee_pref_valid)
        self.assertEquals(res_unauth_invitee.status_code, 201)

        invitee_pref_valid['level'] = 2

        res_update = client.put('/calendars/1/preferences/1/', invitee_pref_valid)
        self.assertEquals(res_update.status_code, 200)

    def test_preference_delete(self):
        client = APIClient()
        invitee_pref_valid = {
            'level': 1,
            'start': '2024-01-02T13:00:00',
            'invitee': 1
        }

        res_unauth_invitee = client.post('/calendars/1/preferences/', invitee_pref_valid)
        self.assertEquals(res_unauth_invitee.status_code, 201)

        res_delete = client.delete('/calendars/1/preferences/1/')
        self.assertEquals(res_delete.status_code, 204)
