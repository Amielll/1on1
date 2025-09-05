function CalendarSearch() {
    return (
        <div className="mx-4 mt-4 flex flex-col gap-2">
            <h2 className="font-bold text-xl">Calendars</h2>
            <input placeholder="Search for a calendar..." className="rounded-lg border-0 bg-gray-200 p-2 px-3 mb-1">

            </input>
            <div className="flex flex-col bg-white drop-shadow-md rounded-lg overflow-auto">
                <button className="flex flex-col py-2 px-4 text-left gap-0.5 bg-shadow hover:bg-shadow">
                    <p className="text-lg"> A1 Meeting </p>
                    <p className="font-light">CSC309H1 2023-24</p>
                </button>
                <button className="flex flex-col py-2 px-4 text-left gap-0.5 hover:bg-shadow">
                    <p className="text-lg"> A2 Meeting </p>
                    <p className="font-light">CSC309H1 2023-24</p>
                </button>
                <button className="flex flex-col py-2 px-4 text-left  gap-0.5 hover:bg-shadow cursor-pointer">
                    <p className="text-lg"> P1 Meeting </p>
                    <p className="font-light">CSC309H1 2023-24</p>
                </button>
                <button className="flex flex-col py-2 px-4 text-left  hover:bg-shadow cursor-pointer">
                    <p className="text-lg"> P2 Meeting </p>
                    <p className="font-light">CSC309H1 2023-24</p>
                </button>
                <button className="flex flex-col py-2 px-4 text-left  hover:bg-shadow cursor-pointer">
                    <p className="text-lg"> Week 4 Office Hours </p>
                    <p className="font-light">CSC309H1 2023-24</p>
                </button>
                <button className="flex flex-col py-2 px-4 text-left  hover:bg-shadow cursor-pointer">
                    <p className="text-lg"> Week 3 Office Hours </p>
                    <p className="font-light">CSC300H1 2023-24</p>
                </button>
            </div>

            <a href="calendar-create.html" className="text-center mb-2 bg-dark-green text-white rounded-lg text-lg">+ Create</a>
        </div>
    );
}

export default CalendarSearch;
