import json
from datetime import datetime, timedelta
from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.test import APIClient

from calendars.models.calendar import Calendar
from calendars.models.preference import Preference
from calendars.models.invitee import Invitee
from calendars.models.contact import Contact


class SchedulingTestCase(TestCase):
    def setUp(self):
        # Create users
        self.user1 = User.objects.create_user(username='user1', password='12345')
        self.user2 = User.objects.create_user(username='user2', password='54321')

        # Create calendar
        self.calendar = Calendar.objects.create(
            id=1,
            name='John\'s first calendar',
            description='First calendar',
            start_date='2024-03-17',
            end_date='2024-03-18',
            duration=30,
            deadline='2024-03-16',
            owner=self.user1,
            finalized=False
        )

        # Create contacts
        self.contact1 = Contact.objects.create(name='Contact 1',
                                               email='contact1@email.com',
                                               owner=self.user1)

        self.contact2 = Contact.objects.create(name='Contact 2',
                                               email='contact2@email.com',
                                               owner=self.user2)

        # Create invitees
        self.invitee1 = Invitee.objects.create(calendar=self.calendar,
                                               contact=self.contact1)
        self.invitee2 = Invitee.objects.create(calendar=self.calendar,
                                               contact=self.contact1)

        Preference.objects.create(invitee=self.invitee1,
                                  calendar=self.calendar,
                                  start='2024-03-17',
                                  level=2)

        Preference.objects.create(invitee=self.invitee2,
                                  calendar=self.calendar,
                                  start='2024-03-17',
                                  level=1)

    def test_get_schedule(self):
        client = APIClient()
        client.force_authenticate(user=self.user1)

        response = client.get('/calendars/1/schedule/')
        print(response.content)
        self.assertEqual(response.status_code, 200)
