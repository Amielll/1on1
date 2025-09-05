import { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorMessage from '../components/ErrorMessage';
import { RotatingLines } from 'react-loader-spinner';
import { Link } from 'react-router-dom';

function CalendarPage() {
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [calendars, setCalendars] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCalendars();
    }, [search]);

    const fetchCalendars = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/calendars?search=${search}`);
            setCalendars(res.data);
            setError('');
        } catch (error) {
            console.error(error);
            setError('Failed to load data.');
        }
        setLoading(false);
    };

    return (
        <div className="mx-4 mt-4 flex flex-col gap-2">
            {error.length > 0 ? <ErrorMessage msg={error} msgs={[]}/> : <></>}
            <div className='flex flex-row justify-between items-center'>
                <h2 className="font-bold text-xl">Calendars</h2>
                <Link to='/calendar-create' className="text-center mb-2 bg-dark-green text-white rounded-lg text-lg pl-2 pr-2 pt-1 pb-1 hover:bg-green">+ Create</Link>
            </div>
            <input placeholder="Search for a calendar..." className="rounded-lg border-0 bg-gray-200 p-2 px-3 mb-1" onChange={(event) => setSearch(event.target.value)}>

            </input>
            <div className='flex flex-col bg-white drop-shadow-md rounded-lg overflow-auto'>
                { loading
                    ? <div className='self-center m-4'><RotatingLines height='50' width='50'/></div>
                    : calendars.map((calendar) => (
                        <Link key={calendar.id} to={`/calendar-specific/${calendar.id}`} className="flex flex-col py-2 px-4 text-left gap-0.5 hover:bg-shadow">
                            <div className='flex flex-row justify-between'>
                                <p className="text-lg"> {calendar.name} </p>
                                { calendar.finalized ? <p className='text-red'>Finalized</p> : <></> }
                            </div>
                            <p className="font-light">{calendar.description}</p>
                        </Link>
                    )) }
            </div>
        </div>
    );
}

export default CalendarPage;
