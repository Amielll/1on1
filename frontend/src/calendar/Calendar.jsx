// import { useEffect } from 'react';

function Calendar() {
    // const [events, setEvents] = useState([]);

    // useEffect(() => {
    //     getEvents();
    // }, []);

    // const getEvents = async () => {
    //     const endpoint = 'http://localhost:8000/calendars/1/events/';
    //     const res = await fetch(endpoint);
    //     console.log(res);
    // }

    return (
        <div className="overflow-x-auto self-center rounded-xl md:max-h-[500px] lg:max-w-[1100px]">
            <table className="table-auto bg-pale-green">
                <thead>
                    <tr>
                        <th className="px-4 py-2 font-medium">EST</th>
                        <th className="px-4 py-2 font-medium">Monday<br /><span style={{ fontSize: 0.9 + 'rem' }}>5</span></th>
                        <th className="px-4 py-2 font-medium">Tuesday<br /><span style={{ fontSize: 0.9 + 'rem' }}>6</span></th>
                        <th className="px-4 py-2 font-medium">Wednesday<br /><span style={{ fontSize: 0.9 + 'rem' }}>7</span></th>
                        <th className="px-4 py-2 font-medium">Thursday<br /><span style={{ fontSize: 0.9 + 'rem' }}>8</span></th>
                        <th className="px-4 py-2 font-medium">Friday<br /><span style={{ fontSize: 0.9 + 'rem' }}>9</span></th>
                        <th className="px-4 py-2 font-medium">Saturday<br /><span style={{ fontSize: 0.9 + 'rem' }}>10</span></th>
                        <th className="px-4 py-2 font-medium">Sunday<br /><span style={{ fontSize: 0.9 + 'rem' }}>11</span></th>
                    </tr>

                </thead>
                <tbody className="text-center">
                    <tr>
                        <td className="border-2 px-4 py-2 bg-white w-50 h-8">9:00 AM</td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                    </tr>
                    <tr>
                        <td className="border-2 px-4 py-2 bg-white w-50 h-8">10:00 AM</td>
                        <td className="group border-2 px-4 py-2 bg-calendar-3 w-24 h-8 hover:bg-pale-green" rowSpan="1">
                            <div className="invisible group-hover:visible">AW</div>
                        </td>

                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="group border-2 px-4 py-2 bg-calendar-2 w-24 h-8 hover:bg-pale-green" rowSpan="1">
                            <div className="invisible group-hover:visible">AW</div>
                        </td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                    </tr>
                    <tr>
                        <td className="border-2 px-4 py-2 bg-white w-50 h-8">11:00 AM</td>
                        <td className="group border-2 px-4 py-2 bg-calendar-1 w-24 h-8 hover:bg-pale-green" rowSpan="1">
                            <div className="invisible group-hover:visible">BC</div>
                        </td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="group border-2 px-4 py-2 bg-calendar-2 w-24 h-8 hover:bg-pale-green" rowSpan="1">
                            <div className="invisible group-hover:visible">AW, BC</div>
                        </td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                    </tr>
                    <tr>
                        <td className="border-2 px-4 py-2 bg-white w-50 h-8">12:00 PM</td>
                        <td className="group border-2 px-4 py-2 bg-calendar-2 w-24 h-8 hover:bg-pale-green" rowSpan="1">
                            <div className="invisible group-hover:visible">BC</div>
                        </td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="group border-2 px-4 py-2 bg-calendar-2 w-24 h-8 hover:bg-pale-green" rowSpan="1">
                            <div className="invisible group-hover:visible">BC</div>
                        </td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                    </tr>
                    <tr>
                        <td className="border-2 px-4 py-2 bg-white w-50 h-8">1:00 PM</td>
                        <td className="group border-2 px-4 py-2 bg-calendar-2 w-24 h-8 hover:bg-pale-green" rowSpan="1">
                            <div className="invisible group-hover:visible">AW, BC</div>
                        </td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="group border-2 px-4 py-2 bg-calendar-1 w-24 h-8 hover:bg-pale-green" rowSpan="1">
                            <div className="invisible group-hover:visible">BC</div>
                        </td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="group border-2 px-4 py-2 bg-calendar-3 w-24 h-8 hover:bg-pale-green" rowSpan="1">
                            <div className="invisible group-hover:visible">BC</div>
                        </td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="group border-2 px-4 py-2 bg-calendar-3 w-24 h-8 hover:bg-pale-green" rowSpan="1">
                            <div className="invisible group-hover:visible">BC</div>
                        </td>
                    </tr>
                    <tr>
                        <td className="border-2 px-4 py-2 bg-white w-50 h-8">2:00 PM</td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="group border-2 px-4 py-2 bg-calendar-3 w-24 h-8 hover:bg-pale-green" rowSpan="1">
                            <div className="invisible group-hover:visible">BC</div>
                        </td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                    </tr>
                    <tr>
                        <td className="border-2 px-4 py-2 bg-white w-50 h-8">3:00 PM</td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                    </tr>
                    <tr>
                        <td className="border-2 px-4 py-2 bg-white w-50 h-8">4:00 PM</td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                    </tr>
                    <tr>
                        <td className="border-2 px-4 py-2 bg-white w-50 h-8">5:00 PM</td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                        <td className="border-2 px-4 py-2 bg-white w-24 h-8" rowSpan="1"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Calendar;
