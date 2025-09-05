from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from calendars.models.contact import Contact

class ContactViewSetTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser',
                                 email='testuser@email.com',
                                 password='testpassword',
                                 first_name='Test',
                                 last_name='User')

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.contact = Contact.objects.create(
            name='Test Contact',
            email='test@email.com',
            owner=self.user
        )

    def test_contact_list(self):
        response = self.client.get('/contacts/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)  # Check if the response contains the created contact

    def test_contact_retrieve(self):
        response = self.client.get(f'/contacts/{self.contact.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'Test Contact')

    def test_contact_update(self):
        data = {'name': 'Updated Contact'}
        response = self.client.patch(f'/contacts/{self.contact.id}/', data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'Updated Contact')

    def test_contact_partial_update(self):
        data = {'name': 'Updated Contact'}
        response = self.client.patch(f'/contacts/{self.contact.id}/', data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['name'], 'Updated Contact')

    def test_contact_destroy(self):
        response = self.client.delete(f'/contacts/{self.contact.id}/')
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Contact.objects.filter(id=self.contact.id).exists())