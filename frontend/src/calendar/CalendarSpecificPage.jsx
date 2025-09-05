import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { RotatingLines } from 'react-loader-spinner';
import ErrorMessage from '../components/ErrorMessage';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

function CalendarSpecificPage() {
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [calendar, setCalendar] = useState(null);
    const [invitees, setInvitees] = useState({});
    const [events, setEvents] = useState([]);
    const [success, setSuccess] = useState('');
    const localizer = momentLocalizer(moment);

    useEffect(() => {
        if (!id) {
            setError('Invalid URL');
            return;
        }

        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const calendarRes = await axios.get(`/calendars/${id}`);
            setCalendar(calendarRes.data);
            const inviteeRes = await axios.get(`/calendars/${id}/invitees/`);
            const preferences = (await axios.get(`/calendars/${id}/preferences`)).data;
            const contacts = {};
            for (const invitee of inviteeRes.data) {
                const contact = (await axios.get(`/contacts/${invitee.contact}`)).data;
                contact.inviteeId = invitee.id;

                if (preferences.some((pref) => pref.invitee === contact.inviteeId)) {
                    contact.submitted = true;
                } else {
                    contact.submitted = false;
                }
                contacts[contact.inviteeId] = contact;
            }
            setInvitees(contacts);

            const allEvents = [];

            if (calendarRes.data.finalized) {
                const eventRes = await axios.get(`/calendars/${id}/events`);
                eventRes.data.forEach((event) => {
                    const startTime = moment(event.date + ' ' + event.start_time);
                    const endTime = startTime.clone().add(calendarRes.data.duration, 'minutes');

                    allEvents.push({
                        title: event.name,
                        start: startTime.toDate(),
                        end: endTime.toDate()
                    });
                });
            } else {
                const schedule = (await axios.get(`/calendars/${id}/schedule`)).data;
                schedule.forEach((event) => {
                    const { name } = contacts[event.invitee_id];
                    const initials = name.split(' ').map(subname => subname.charAt(0)).join('');
                    const startTime = moment(event.date + ' ' + event.start_time);
                    const endTime = startTime.clone().add(calendarRes.data.duration, 'minutes');
                    allEvents.push({
                        title: initials,
                        contact: contacts[event.invitee_id],
                        start: startTime.toDate(),
                        end: endTime.toDate()
                    });
                });
            }

            setEvents(allEvents);
        } catch (error) {
            console.error(error);
            setError('Failed to load data.');
        }
        setLoading(false);
    };

    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: '#C4D6B0',
            color: 'white',
            borderRadius: '5px',
            border: 'none'
        };
        return {
            style: style
        };
    };

    const updateDeadline = async (deadline) => {
        const deadlineDate = new Date(deadline);

        const newCalendar = { ...calendar };
        newCalendar.deadline = deadlineDate.toISOString();
        console.log(newCalendar);
        try {
            await axios.put(`/calendars/${calendar.id}/`, newCalendar);
            setCalendar(newCalendar);
        } catch (error) {
            console.error(error);
            setError('Failed to update deadline.');
        }
    };

    const handleFinalize = async () => {
        if (events.length === 0) {
            setError('No events to finalize.');
            return;
        }

        if (calendar.finalized) {
            setError('Calendar already finalized');
            return;
        }

        setLoading(true);
        try {
            for (const event of events) {
                const data = {
                    name: event.contact.name,
                    description: `Meeting with ${event.contact.name}`,
                    date: event.start.toISOString().split('T')[0],
                    start_time: event.start.toISOString().split('T')[1].slice(0, 5),
                    last_modified: new Date().toISOString(),
                    attendee: event.contact.id
                };

                await axios.post(`/calendars/${calendar.id}/events/`, data);
            }

            const newCalendar = { ...calendar };
            newCalendar.finalized = true;

            await axios.put(`/calendars/${calendar.id}/`, newCalendar);
            window.location.reload();
        } catch (error) {
            console.error(error);
            setError('Failed to finalize calendar');
        }
    };

    const sendReminder = async () => {
        try {
            for (const invitee of Object.values(invitees)) {
                await axios.post(`/calendars/${calendar.id}/invitees/`, { contact: invitee.id });
            }
            setSuccess('Successfully sent reminders.');
        } catch (error) {
            console.error(error);
            setError('Failed to send reminders.');
        }
    };

    return (
        <div className="flex flex-col h-full items-center min-h-[1000px] sm:h-dvh pt-5 mt-4 p-2">
            {success.length > 0
                ? <div className='bg-light-green rounded-md p-2'>
                    {
                        success
                    }
                </div>
                : <></>}
            {error.length > 0 ? <ErrorMessage msg={error} /> : <></>}
            {loading
                ? <div className='self-center m-4'><RotatingLines height='50' width='50' /></div>
                : calendar === null
                    ? <></>
                    : (
                        <>
                            <div className="flex flex-row justify-between items-center w-full md:max-h-[500px] lg:max-w-[1100px]">
                                <div className="flex flex-col">
                                    <h1 className="text-left text-3xl font-bold mr-8 cursor-pointer">{calendar.name}</h1>
                                    <h3>{calendar.description}</h3>
                                </div>
                                <div className="h-8">
                                    <label>Deadline: </label>
                                    <input type="date" className="px-5 mb-3 mr-3 rounded-lg h-full border" value={calendar.deadline.split('T')[0]} onChange={(event) => updateDeadline(event.target.value)}/>
                                    {calendar.finalized
                                        ? <></>
                                        : <button onClick={handleFinalize}
                                            className="px-8 py-2 mt-3 bg-dark-green text-white rounded-lg text-lg">Finalize</button>}
                                </div>
                            </div>

                            <div className="mt-10"></div>

                            <div
                                className="mt-2 flex justify-center md:flex-row w-full h-full md:max-h-[500px] lg:max-w-[1100px] bg-white rounded-lg drop-shadow-lg mb-8 gap-4">

                                <div className='px-2 py-10 h-full w-full lg:w-2/4 xl:w-4/5'>
                                    <Calendar
                                        localizer={localizer}
                                        events={events}
                                        eventPropGetter={eventStyleGetter}
                                    />
                                </div>
                            </div>

                            <div className="flex md:flex-row flex-col justify-between items-center w-full lg:max-w-[1100px] drop-shadow-xl mb-2">
                                <div className="flex md:flex-row flex-col  text-dark-green mb-3">
                                    <span className="mr-5 font-bold text-3xl">Invited:</span>
                                </div>
                                <div className="flex md:flex-row flex-col  text-dark-green mb-3">
                                    <Link to='/contacts'><button
                                        className="px-8 py-1 m-4 bg-dark-green text-white rounded-lg text-xl">Invite</button></Link>
                                    <button id="invite" onClick={sendReminder} className="px-8 py-1 m-4 bg-dark-green text-white rounded-lg text-xl">Send Reminder</button>
                                    <Link to={`/invitee?calendar_id=${calendar.id}`} className="px-8 py-1 m-4 bg-dark-green text-white rounded-lg text-xl">Submit Preferences</Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-between items-center w-full lg:max-w-[1100px] drop-shadow-md">
                                {invitees === null
                                    ? <></>
                                    : Object.values(invitees).map((invitee) => (<div key={invitee.id} className="flex md:flex-row items-center border rounded-md p-3 pl-4 pr-4 bg-white justify-between">
                                        <div className='flex flex-row items-center'>
                                            <div className={`w-5 h-5 mr-4 ${invitee.submitted ? 'bg-dark-green' : 'bg-no-resp'} text-black rounded-full`}></div>
                                            <p className="text-xl font-medium block rounded-xl md:bg-transparent">{invitee.name}</p>
                                        </div>
                                        <div className='w-8 h-8 border p-2 rounded-md bg-white hover:bg-shadow drop-shadow-md cursor-pointer'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                            </svg>
                                        </div>
                                    </div>))}
                            </div>
                        </>
                    )}

        </div>
    );
}

export default CalendarSpecificPage;
