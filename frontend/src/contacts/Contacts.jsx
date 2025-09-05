import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../global_state/AuthProvider.js';
import { Link, Navigate } from 'react-router-dom';

function Contacts() {
  const { token } = useAuth(); // Get token from AuthProvider
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState('');
  const [successMessage, setSuccessMessage] = useState(' ');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

      // Fetch calendars data from Django endpoint
      axios.get('/calendars/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setCalendars(response.data);
      })
      .catch(error => {
        console.error('Error fetching calendars:', error);
      })
    } else {
        setRedirectToLogin(true);
    }
  }, [token]);
  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setIsButtonDisabled(false);
    setSuccessMessage('');
    setSelectedCalendar('');
  };

  const handleCalendarSelect = (event) => {
    setSelectedCalendar(event.target.value);
    setSuccessMessage('');
    setIsButtonDisabled(false);
    // Check if a contact is selected
    if (selectedContact) {
        // Send GET request to retrieve the list of invitees for the selected calendar
        axios.get(`/calendars/${event.target.value}/invitees/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                // Extract emails of invitees from the response data
                const inviteeID = response.data.map(invitee => invitee.contact);
                // Check if the email of the selected contact exists in the list of invitees' emails
                const isInvited = inviteeID.includes(selectedContact.id);
                if (isInvited) {
                    // Set success message for already invited contact
                    setSuccessMessage('You have already invited this user for the selected calendar.');
                    // Disable the button if contact is already invited
                    setIsButtonDisabled(true);
                } else {
                    // Clear success message if the contact is not already invited
                    setSuccessMessage('');
                    // Enable the button if contact is not already invited
                    setIsButtonDisabled(false);
                }
            })
            .catch(error => {
                // Handle error
                console.error('Error retrieving invitees:', error);
            });
    } else {
        // Clear success message and enable the button if no contact is selected
        setSuccessMessage('');
        setIsButtonDisabled(false);
    }
};

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    // Gather data from the form
    const formData = new FormData(event.target);
    const selectedCalendarId = formData.get('select-calendar');
    // Check if a contact is selected
    if (!selectedContact) {
        alert('Please select a contact.');
        return;
    }
    // Send GET request to retrieve the list of invitees for the selected calendar
    axios.get(`/calendars/${selectedCalendarId}/invitees/`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
        .then(response => {
            // Extract emails of invitees from the response data
            const inviteeEmails = response.data.map(invitee => invitee.contact);
            // Check if the email of the selected contact exists in the list of invitees' emails
            const isAlreadyInvited = inviteeEmails.includes(selectedContact.id);
            if (isAlreadyInvited) {
                // Set success message for already invited contact
                setSuccessMessage('You have already invited this user.');
            } else {
                // Prepare data for POST request
                const requestData = {
                    contact: selectedContact.id
                };
                const postEndpointUrl = `/calendars/${selectedCalendarId}/invitees/`;
                // Send POST request to send invite
                axios.post(postEndpointUrl, requestData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(response => {
                        // Handle successful response
                        console.log('POST request successful:', response.data);
                        // Set success message
                        setSuccessMessage('Invitation sent successfully!');
                        // Reset the form
                        event.target.reset();
                    })
                    .catch(error => {
                        // Handle error
                        console.error('Error sending POST request:', error);
                    });
            }
        })
        .catch(error => {
            // Handle error
            console.error('Error retrieving invitees:', error);
            // Set error message
        });
};

  return (
    <div className="bg-shadow">
      {/* Navigation */}
      {/* Navigation code goes here */}

      <div className="flex h-full items-center min-h-[650px] sm:h-dvh justify-center p-2">
        {/*  card */}
        <div className="flex flex-col md:flex-row w-full h-full md:max-h-[600px] lg:max-w-[1024px] bg-white rounded-lg drop-shadow-md">
          {/* contacts menu */}
          <div className="h-min md:h-full md:w-1/3 md:flex md:justify-center rounded-tl-lg rounded-tr-lg md:rounded-tr-none md:rounded-bl-lg bg-pale-green">
            <div className="w-full">
              <input
                placeholder="Search for a contact..."
                className="rounded-lg border-0 bg-gray-200 p-2 px-3 m-4"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Link to="/contacts/add"><button className="rounded-lg border-0 font-semibold bg-white p-2 px-2 mb-4 mx-4">+ Add a contact</button></Link>
              <Link to="/contacts/edit"><button
                  className="rounded-lg border-0 font-semibold bg-light-green p-2 px-4 mt-2"
                >
                  Edit
                </button></Link>
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
          {/* single contact view */}
          <div className="w-full py-4 px-8 md:py-14">
            {selectedContact && (
              <>
                <p className="font-bold text-4xl">{selectedContact.name}</p>
                <p className="text-l sm:text-2xl">{selectedContact.email}</p>
                <form className="mt-6 bg-pale-green p-5 rounded-md" onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-semibold pb-5">Invite to meet</h2>
                  <div className="mb-4 flex-column">
                    <label htmlFor="select-calendar">
                      <p className="font-medium text-xl">
                        Select a calendar...<span className="text-red-600">*</span>
                      </p>
                    </label>
                    <div className="relative rounded-md">
                    <select
                        id="select-calendar"
                        name="select-calendar"
                        value={selectedCalendar}
                        onChange={handleCalendarSelect}
                        className="block w-full rounded-lg border-0 py-1.5 pl-4 pr-4 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent text-sm leading-6"
                        >
                        <option value="">Select a calendar...</option>
                        {calendars
                            .filter(calendar => !calendar.finalized) // Filter calendars where finalized is false
                            .map(calendar => (
                            <option key={calendar.id} value={calendar.id}>{calendar.name}</option>
                            ))}
                        </select>
                    </div>
                  </div>
                  <div className="flex items-center"> {/* Flex container for the button and success message */}
                    <div className="flex-grow"> {/* Use flex-grow to push the success message to the left */}
                    <p className="text-green-600">{successMessage}</p>
                    </div>
                    <button type="submit" className={`bg-dark-green text-white p-2 rounded-lg w-52 sm:mt-0 md:float-right ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isButtonDisabled}>
                      Send invite
                    </button>
                </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contacts;
