import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../global_state/AuthProvider.js';
import { Link, Navigate } from 'react-router-dom';

function EditContact() {
  const { token } = useAuth(); // Get token from AuthProvider
  const [contacts, setContacts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [redirectToContacts, setRedirectToContacts] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    if (token) {
      // Fetch contacts data from Django endpoint only if user is authenticated
      axios.get('/contacts/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setContacts(response.data);
        if (response.data.length > 0) {
            setSelectedContact(response.data[0]);
          }
      })
      .catch(error => {
        console.error('Error fetching contacts:', error);
      });
    } else {
        setRedirectToLogin(true);
    }
  }, [token]);

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleDeleteContact = () => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    axios.delete(`/contacts/${selectedContact.id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('Contact deleted successfully:', response.data);
      setRedirectToContacts(true);
    })
    .catch(error => {
      console.error('Error deleting contact:', error);
      setErrorMessage('Error deleting contact. Please try again later.');
    });
  };

  const handleSubmit = () => {
    // Validate input
    if (!name || !email) {
      setErrorMessage('Please fill in all the fields.');
      return;
    }

    // Prepare data for POST request
    const requestData = {
      name: name,
      email: email
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // Send PUT request to Django endpoint to update contact
    const endpointUrl = `/contacts/${selectedContact.id}/`;
    axios.put(endpointUrl, requestData)
      .then(response => {
        console.log('Contact updated successfully:', response.data);
        setRedirectToContacts(true);
      })
      .catch(error => {
        console.error('Error updating contact:', error);
        setErrorMessage('Error updating contact. Please try again later.');
      });
  };

  if (redirectToContacts) {
    return <Navigate to="/contacts" />;
  }

  return (
    <div className="bg-shadow">
      {/* Navigation */}
      {/* Navigation code goes here */}

      <div className="flex h-full items-center min-h-[650px] sm:h-dvh justify-center p-2">
        {/*  card */}
        <div className="flex flex-col md:flex-row w-full h-full md:max-h-[600px] lg:max-w-[1024px] bg-white rounded-lg drop-shadow-md">
            <div className="h-min md:h-full md:w-1/3 md:flex md:justify-center rounded-tl-lg rounded-tr-lg md:rounded-tr-none md:rounded-bl-lg bg-pale-green">
                <div className="w-full">
                <input
                    placeholder="Search for a contact..."
                    className="rounded-lg border-0 bg-gray-200 p-2 px-3 m-4"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <Link to="/contacts/add"><button className="rounded-lg border-0 font-semibold bg-white p-2 px-4 mb-4 mx-4">+ Add a contact</button></Link>
                {/* Render filtered contacts based on search query */}
                {contacts.length === 0
                ? (<p className="text-xl font-medium px-4">Add a contact to get started.</p>)
                : (
                    contacts
                    .filter(contact => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(contact => (
                        <div key={contact.id} className="border-b-2 py-2 border-gray-500 cursor-pointer hover:bg-light-green" onClick={() => handleContactClick(contact)}>
                        <p className={`block font-medium text-xl px-4 ${selectedContact && selectedContact.id === contact.id ? 'bg-light-green' : ''}`}>{contact.name}</p>
                        </div>
                    ))
                )}
                </div>
          </div>
          <div className="w-full py-4 px-8 mb-6 md:py-10">
            <div className="flex justify-between items-center">
              <button
                onClick={() => window.history.back()}
                className="rounded-lg text-xl"
              >
                &larr; Back
              </button>
              <button
                type="button"
                className="bg-red-600 text-white p-2 rounded-lg"
                onClick={handleDeleteContact}
              >
                Delete contact
              </button>
            </div>
            <p className="font-semibold text-3xl mt-6">Edit Name</p>
            <input
              type="text"
              name="contact-name"
              id="contact-name"
              className="w-1/2 rounded-lg border-0 py-1.5 mt-3 mb-4 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent text-sm leading-6"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="font-semibold text-3xl">Edit Email</p>
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
                Update contact
              </button>
              <p className="text-green-600 mt-4">{errorMessage}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditContact;
