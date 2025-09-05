import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from '../assets/1on1.png';
import { useState } from 'react';
import { useAuth } from '../global_state/AuthProvider';

function Layout() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const { setToken, setRefresh } = useAuth();

    const handleOpen = () => setOpen(!open);

    const renderClass = (path) => {
        if (location.pathname === path) {
            return currentClass;
        } else {
            return nonCurrentClass;
        }
    };

    const logout = () => {
        setToken('');
        setRefresh('');
    };

    const currentClass = 'md:text-dark-green bg-light-green md:font-bold md:underline';
    const nonCurrentClass = 'hover:bg-green md:hover:text-black hover:no-underline md:hover:underline md:hover:bg-transparent md:hover:font-bold hover:text-white';

    return (
        <>
            <nav className="flex flex-wrap items-center justify-between md:justify-normal md:gap-4 bg-pale-green md:bg-white drop-shadow-md">
                <img src={logo} alt="1on1" className="md:self-center bg-pale-green p-4 w-44 h-auto" />
                <button type="button" id="toggleButton" onClick={handleOpen}
                    className="flex-end inline-flex items-center justify-center p-2 w-10 h-10 mr-4 text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-dark-green hover:bg-shadow">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M4 12H20M4 18H20" stroke="#042A2B" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round" />
                    </svg>
                </button>

                <div className={`${open ? '' : 'hidden'} w-full md:w-auto mx-4 md:mx-0 md:flex justify-between`} id="menu">
                    <ul
                        className="font-medium text-lg flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:bg-white bg-pale-green">
                        <li>
                            <Link to='/'
                                className={`block p-4 rounded-xl md:bg-transparent ${renderClass('/')}`}>Calendars</Link>
                        </li>
                        <li>
                            <Link to="/contacts"
                                className={`block p-4 rounded-xl md:bg-transparent ${renderClass('/contacts')}`}>Contacts</Link>
                        </li>
                        <li>
                            <div onClick={logout}
                                className="block p-4 rounded-xl md:bg-transparent hover:bg-green md:hover:text-black hover:no-underline md:hover:underline md:hover:bg-transparent md:hover:font-bold hover:text-white">Signout</div>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className='p-4'>
                <Outlet />
            </div>
        </>
    );
}

export default Layout;
