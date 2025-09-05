import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import { useEffect } from 'react';
const localizer = momentLocalizer(moment);

const events = [
    {
        'title': 'C1',
        'start': new Date('2024-05-01T21:30:00.000Z'),
        'end': new Date('2024-05-01T21:30:00.000Z')
    },
    {
        'title': 'C2',
        'start': new Date('2024-05-01T16:30:00.000Z'),
        'end': new Date('2024-05-01T16:30:00.000Z')
    },
    {
        'title': 'C3',
        'start': new Date('2024-05-01T22:30:00.000Z'),
        'end': new Date('2024-05-01T22:30:00.000Z')
    }
];

function TestCalendar() {
    return (
        <Calendar className='h-full'
            style={{ height: 100 + 'vh' }}
            localizer={localizer}
            events={events}
        />
    );
}
export default TestCalendar;
