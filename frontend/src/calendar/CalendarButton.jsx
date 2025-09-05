function CalendarButton({ calendarName, courseName }) {

    return (
        <button className="flex flex-col py-2 px-4 text-left gap-0.5 bg-shadow hover:bg-shadow">
            <p className="text-lg">{calendarName}</p>
            <p className="font-light">{courseName}</p>
        </button>
    );
}

export default CalendarButton;