import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';

import Home from './main/Home';
import Login from './login/Login';
import Signup from './signup/Signup';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import AuthProvider from './global_state/AuthProvider';
import Contacts from './contacts/Contacts';
import AddContact from './contacts/AddContact';
import EditContact from './contacts/EditContact';
import Invitee from './invitee/Invitee';
import CalendarPage from './calendar/CalendarPage';
import Layout from './components/Layout';
import CalendarSpecificPage from './calendar/CalendarSpecificPage';
import TestCalendar from './calendar/TestCalendar';
import CalendarCreatePage from './calendar/CalendarCreate';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path='test' element={<TestCalendar />} />
                    <Route path='login' element={<Login />} />
                    <Route path='signup' element={<Signup />} />
                    <Route path='/' element={<AuthenticatedRoute />}>
                        <Route element={<Layout />}>
                            <Route index element={<CalendarPage />} />
                            <Route path='calendar-specific/:id' element={<CalendarSpecificPage />} />
                            <Route path='contacts' element={<Contacts />} />
                            <Route path='contacts/add' element={<AddContact />} />
                            <Route path='contacts/edit' element={<EditContact />} />
                            <Route path='calendar-create' element={<CalendarCreatePage />} />
                        </Route>
                    </Route>
                    <Route path='invitee' element={<Invitee />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
