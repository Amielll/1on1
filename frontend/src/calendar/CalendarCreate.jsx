import { useState } from 'react';
import ErrorMessage from '../components/ErrorMessage';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CalendarCreatePage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [duration, setDuration] = useState(0);
    const [deadline, setDeadline] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleCreate = async () => {
        if (
            !name ||
            !description ||
            !startDate ||
            !endDate ||
            duration === 0 ||
            !deadline
        ) {
            setError('All fields are required.');
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const deadlineDate = new Date(deadline);

        if (start > end) {
            setError('Start date must be before end date.');
            return;
        }

        const calendar = {
            name,
            description,
            start_date: start.toISOString().split('T')[0],
            end_date: end.toISOString().split('T')[0],
            finalized: false,
            duration,
            deadline: deadlineDate.toISOString()
        };

        try {
            const res = await axios.post('/calendars/', calendar);

            navigate(`/calendar-specific/${res.data.id}`);
        } catch (error) {
            console.error(error);
            setError('Failed to create calendar. Please try again.');
        }
    };

    return (
        <div className="flex flex-col h-full items-center min-h-[1000px] sm:h-dvh pt-5 mt-4 p-2">
            {error.length > 0 ? <ErrorMessage msg={error} /> : <></>}
            <section className="mx-4 mt-4">
                <h1 className="font-bold text-xl">Calendar Information</h1>
                <form method="post" action="#" className="flex flex-col bg-light-green rounded-md p-4 gap-4 items-center">
                    <div className="flex flex-wrap w-full justify-center gap-8 max-w-[900px]">
                        <div className="flex flex-col items-start">
                            <label htmlFor="start-date" className="text-lg">Start Date:</label>

                            <input type="date" name="start-date" id="start-date" value={startDate} onChange={(event) => setStartDate(event.target.value)}
                                className="rounded-lg border-0 py-1.5 px-4 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-dark-green leading-6" />
                        </div>

                        <div className="flex flex-col items-start">
                            <label htmlFor="end-date" className="text-lg">End Date:</label>

                            <input type="date" name="end-date" id="end-date" value={endDate} onChange={(event) => setEndDate(event.target.value)}
                                className="rounded-lg border-0 py-1.5 px-4 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-dark-green leading-6" />
                        </div>

                        <div className="flex flex-col items-start">
                            <label htmlFor="start-time" className="text-lg">Duration (mins):</label>

                            <input type="number" name="start-time" id="start-time" value={duration} onChange={(event) => setDuration(event.target.value)}
                                className="max-w-[150px] rounded-lg border-0 py-1.5 px-4 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-dark-green leading-6" />
                        </div>

                        <div className="flex flex-col items-start">
                            <label htmlFor="end-time" className="text-lg">Deadline:</label>

                            <input type="datetime-local" name="end-time" id="end-time" value={deadline} onChange={(event) => setDeadline(event.target.value)}
                                className="rounded-lg border-0 py-1.5 px-4 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-dark-green leading-6" />
                        </div>

                        <div className="flex flex-col items-start">
                            <label htmlFor="name" className="text-lg">Calendar Name:</label>

                            <input type="text" name="name" id="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={50}
                                className="rounded-lg border-0 py-1.5 px-4 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-dark-green leading-6" />
                            <div className='self-end'>{ `${name.length}/50` }</div>
                        </div>
                        <div className="flex flex-col items-start">
                            <label htmlFor="name" className="text-lg">Calendar Name:</label>

                            <textarea name="name" id="name" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={200}
                                className="rounded-lg border-0 py-1.5 px-4 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-dark-green leading-6" />
                            <div className='self-end'>{ `${description.length}/200` }</div>
                        </div>
                    </div>

                    <div onClick={handleCreate}
                        className=" bg-dark-green hover:bg-green hover:cursor-pointer text-white rounded-xl w-32 py-2 align-middle text-center">Create</div>
                </form>
            </section>

        </div>
    );
}

export default CalendarCreatePage;
