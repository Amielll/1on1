import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { RotatingLines } from 'react-loader-spinner';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../global_state/AuthProvider';

function Invitee() {
    const [searchParams] = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [calendar, setCalendar] = useState(null);
    const [preferences, setPreferences] = useState([]);
    const [inviteeId, setInviteeId] = useState('');
    const [removeIds, setRemoveIds] = useState([]);
    const [validation, setValidation] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        const calendarId = searchParams.get('calendar_id');
        const inviteeId = searchParams.get('invitee_id');

        if (!calendarId || (!inviteeId && !token)) {
            setLoading(false);
            setError('Invalid URL');
            return;
        }

        fetchData(calendarId, inviteeId);
    }, []);

    const fetchData = async (calendarId, inviteeId) => {
        try {
            const calendar = (await axios.get(`/calendars/${calendarId}`)).data;

            if (inviteeId) {
                const invitee = (await axios.get(`/calendars/${calendarId}/invitees/${inviteeId}`)).data;

                if (invitee.calendar !== calendar.id) {
                    setError('Invalid URL');
                    setLoading(false);
                    return;
                }
            }

            if (new Date(calendar.deadline) < new Date()) {
                setError('URL Expired: Calendar deadline has passed.');
                setLoading(false);
                return;
            }

            const prefs = (await axios.get(`/calendars/${calendarId}/preferences?invitee=${inviteeId || '0'}`)).data;
            if (prefs.length === 0) {
                prefs.push({ id: 0, calendar: calendarId, level: 2, start: null, invitee: inviteeId });
            }
            setPreferences(prefs);

            setInviteeId(inviteeId);
            setCalendar(calendar);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setError('Failed to load data');
            setLoading(false);
        }
    };

    const padZero = (str) => {
        return str.length > 1 ? str : `0${str}`;
    };

    const utcStringToLocalString = (utcStr) => {
        const date = new Date(utcStr);
        return `${date.getFullYear()}-${padZero((date.getMonth() + 1).toString())}-${padZero(date.getDate().toString())}T${padZero(date.getHours().toString())}:${padZero(date.getMinutes().toString())}:${padZero(date.getSeconds().toString())}`;
    };

    const addPref = () => {
        setPreferences([...preferences, { id: 0, calendar: calendar.id, level: 2, start: '', invitee: inviteeId }]);
    };

    const removePref = (index) => {
        if (preferences[index].id > 0) {
            setRemoveIds([...removeIds, preferences[index].id]);
        }
        const newPrefs = [...preferences];
        newPrefs.splice(index, 1);
        setPreferences(newPrefs);
    };

    const handleStartChange = (index, value) => {
        const startDate = new Date(value);
        const calendarStart = new Date(calendar.start_date);
        const calendarEnd = new Date(calendar.end_date);
        calendarEnd.setUTCHours(11);
        calendarEnd.setUTCMinutes(59);
        calendarEnd.setUTCSeconds(59);

        if (startDate < calendarStart || startDate > calendarEnd) {
            setValidation('Start time must be in the valid calendar range.');
            return;
        }

        const newPrefs = [...preferences];
        newPrefs[index].start = startDate.toISOString();
        setPreferences(newPrefs);
        setValidation('');
    };

    const handleLevelChange = (index, value) => {
        const newPrefs = [...preferences];
        newPrefs[index].level = value;
        setPreferences(newPrefs);
    };

    const handleSubmit = async () => {
        setLoading(true);

        for (const pref of preferences) {
            if (!pref.start) {
                setValidation('Some fields are missing.');
                setLoading(false);
                return;
            }
        }

        const ax = axios.create();
        if (inviteeId) {
            ax.interceptors.request.use(config => {
                console.log(config);
                config.headers.Authorization = '';
                return config;
            });
        }

        try {
            for (const removeId of removeIds) {
                await ax.delete(`/calendars/${calendar.id}/preferences/${removeId}`);
            }

            for (const pref of preferences) {
                if (pref.id > 0) {
                    await ax.put(`/calendars/${calendar.id}/preferences/${pref.id}/`, {
                        level: pref.level,
                        start: pref.start
                    });
                } else {
                    await ax.post(`/calendars/${calendar.id}/preferences/`, {
                        level: pref.level,
                        start: pref.start,
                        invitee: pref.invitee
                    });
                }
            }
            setLoading(false);
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setError('Failed to submit. Please refresh the page to try again.');
        }
    };

    return (
        <div className="bg-shadow flex h-dvh md:items-center min-h-[550px] justify-center p-2">
            {loading
                ? <RotatingLines height='50' width='50'/>
                : submitted
                    ? <div
                        className="flex flex-col w-full h-full md:max-h-[550px] lg:max-w-[1100px] bg-white rounded-lg drop-shadow-md p-6 md:justify-center md:items-center">
                        <p className="font-bold text-3xl">All Done!</p>
                        <p>Look out for further emails about schedule confirmations.</p>
                        <div className="mt-6">
                            <div className="flex flex-row items-center gap-4 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='w-6 h-6'>
                                    <path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z"/>
                                </svg>
                                <p>{`${calendar.start_date} ~ ${calendar.end_date}`}</p>
                            </div>
                            <div className="flex flex-row items-center gap-4 mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                    stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p>{`${calendar.duration} mins`}</p>
                            </div>
                            <div className="flex flex-col">
                                <div>You can continue to edit your preferences before:</div>
                                {new Date(calendar.deadline).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    : error.length > 0
                        ? <div
                            className="flex flex-col w-full h-full md:max-h-[550px] lg:max-w-[1100px] bg-white rounded-lg drop-shadow-md p-6 md:justify-center md:items-center">
                            <ErrorMessage msg={error} />
                        </div>
                        : <div
                            className="flex flex-col md:flex-row w-full h-min md:h-full md:max-h-[550px] lg:max-w-[900px] bg-white rounded-lg drop-shadow-md divide-y md:divide-x">
                            <div className="h-full md:w-5/12 md:flexrounded-tl-lg rounded-tr-lg md:rounded-tr-none md:rounded-bl-lg p-5">
                                <p className="font-bold text-3xl">{calendar.name}</p>
                                <p className="text-base">{calendar.description}</p>
                                <div className="mt-4 mb-4">
                                    <div className="overflow-x-auto rounded-xl md:max-h-[300px]">
                                    </div>
                                </div>
                                <p className="text-base">Select your preferences.</p>
                                <div className='m-4'></div>
                                <div>
                                    <div className="flex flex-row items-center gap-4 mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='w-6 h-6'>
                                            <path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z"/>
                                        </svg>
                                        <p>{`${calendar.start_date} ~ ${calendar.end_date}`}</p>
                                    </div>
                                    <div className="flex flex-row items-center gap-4 mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                            stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        <p>{`${calendar.duration} mins`}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <div>Submit your preferences before</div>
                                        {new Date(calendar.deadline).toLocaleString()}
                                    </div>
                                    <div className='mt-4'>
                                        {validation.length > 0 ? <ErrorMessage msg={validation} /> : <></>}
                                    </div>
                                </div>
                            </div>
                            <div className="py-4 px-3 md:w-7/12">
                                <div className="h-[90%] overflow-auto" id="sch-list">
                                    {preferences.map((pref, index) => (
                                        <div key={Math.random()} className="flex flex-col items-stretch mb-4">
                                            <div className="flex flex-row items-center justify-between">
                                                <div className="flex flex-row items-center gap-8">
                                                    <div>
                                                        <label className='mr-2'>Start:</label>
                                                        <input type="datetime-local" className="rounded-lg h-8 mr-4 border p-1" value={pref.start ? utcStringToLocalString(pref.start) : ''} onChange={(event) => handleStartChange(index, event.target.value)} />
                                                    </div>
                                                </div>
                                                <button onClick={() => removePref(index)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                                        stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex flex-row items-center gap-2 mt-4">
                                                <label htmlFor="end">Level:</label>
                                                <select id="level" name="level" className="bg-shadow p-1 rounded-lg h-8" placeholder="Select" value={pref.level} onChange={(event) => handleLevelChange(index, event.target.value)}>
                                                    <option value={1}>Low</option>
                                                    <option value={2}>Medium</option>
                                                    <option value={3}>High</option>
                                                </select>
                                            </div>
                                            <div className="h-0.5 bg-shadow mt-4 rounded-lg"></div>
                                        </div>))}
                                    <div className="flex flex-row justify-center mt-4 mb-4" id="add-btn">
                                        <button className="bg-green rounded-full h-8 w-8 text-white self-center" onClick={addPref}>+</button>
                                    </div>
                                </div>
                                <div className="h-[10%] flex flex-col">
                                    <div className="h-0.5 bg-shadow rounded-lg"></div>
                                    <button
                                        className="grow w-full h-full bg-dark-green rounded-lg  text-white" onClick={handleSubmit}>Submit</button>
                                </div>
                            </div>
                        </div>}
        </div>
    );
}

export default Invitee;
