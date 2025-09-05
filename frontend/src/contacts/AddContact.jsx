import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../global_state/AuthProvider.js';
import { Navigate } from 'react-router-dom';

function AddContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { token } = useAuth();
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [redirectToContacts, setRedirectToContacts] = useState(false);

  useEffect(() => {
    if (token) {
      setRedirectToLogin(false);
    } else {
        setRedirectToLogin(true);
    }
  }, [token]);
  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async () => {
    // Validate input
    if (!name || !email) {
      setErrorMessage('Please fill in all the fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      // Fetch existing contacts
      const response = await axios.get('/contacts/');
      const existingContacts = response.data;

      // Check if email already exists in the list of existing contacts
      const emailExists = existingContacts.some(contact => contact.email === email);
      if (emailExists) {
        setErrorMessage('This email is already in our system.');
        return;
      }

      // Prepare data for POST request
      const requestData = {
        name: name,
        email: email
      };

      // Send POST request to Django endpoint to add contact
      await axios.post('/contacts/', requestData);
      console.log('Contact added successfully');
      setErrorMessage('Contact added successfully');
      // You can redirect to another page here if needed
      setRedirectToContacts(true);
    } catch (error) {
      console.error('Error adding contact:', error);
      setErrorMessage('An error occurred while adding the contact.');
    }
  };

  if (redirectToContacts) {
    return <Navigate to="/contacts" />;
  }

  return (
    <div className="bg-shadow">
      <div className="flex h-full items-center min-h-[650px] sm:h-dvh justify-center p-2">
        <div className="flex flex-col md:flex-row w-full h-full md:max-h-[600px] lg:max-w-[1024px] bg-white rounded-lg drop-shadow-md">
          <div className="h-min md:h-full md:w-1/3 md:flex md:justify-center rounded-tl-lg rounded-tr-lg md:rounded-tr-none md:rounded-bl-lg bg-pale-green">
            <h1 className='font-bold text-4xl p-6 text-dark-green'>Add a Contact</h1>
          </div>
          <div className="w-full py-4 px-8 mb-6 md:py-10">
            <button
              onClick={() => window.history.back()}
              className="rounded-lg text-xl mb-7"
            >
              &larr; Back
            </button>
            <p className="font-semibold text-3xl">Name<span className="text-red-600"> *</span></p>
            <input
              type="text"
              name="contact-name"
              id="contact-name"
              className="w-1/2 rounded-lg border-0 py-1.5 mt-3 mb-4 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent text-sm leading-6"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="font-semibold text-3xl">Email<span className="text-red-600"> *</span></p>
            <input
              type="text"
              name="contact-email"
              id="contact-email"
              className="w-1/2 rounded-lg border-0 py-1.5 mt-3 mb-4 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent text-sm leading-6"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="h-10">
              <button
                type="button"
                className="mt-2 bg-dark-green text-white p-2 rounded-lg w-52 sm:mt-0 "
                onClick={handleSubmit}
              >
                Add contact
              </button>
              <p className="text-green-600 mt-4">{errorMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddContact;
