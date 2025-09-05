from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from calendars.models.calendar import Calendar
from calendars.models.contact import Contact
import datetime
from calendars.models.invitee import Invitee

class InviteeViewSetTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password')

        # Create a calendar associated with the user
        self.calendar = Calendar.objects.create(
            name="Test Calendar",
            description="Test Description",
            start_date=datetime.date.today(),
            end_date=datetime.date.today() + datetime.timedelta(days=7),
            finalized=False,
            duration=60,
            deadline=datetime.datetime.now() + datetime.timedelta(days=1),
            owner=self.user  # Associate the calendar with the authenticated user
        )

        # Create a contact associated with the user
        self.contact = Contact.objects.create(
            name="Test Contact",
            email="testcontact@example.com",
            owner=self.user  # Associate the contact with the authenticated user
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_create_invitee(self):
        data = {
            'calendar': self.calendar.id,
            'contact': self.contact.id
        }
        response = self.client.post(f'/calendars/{self.calendar.id}/invitees/', data, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Invitee.objects.count(), 1)
        self.assertEqual(Invitee.objects.first().contact, self.contact)
        self.assertEqual(Invitee.objects.first().calendar, self.calendar)