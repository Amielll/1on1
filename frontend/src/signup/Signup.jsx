import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/1on1.png';
import { useState } from 'react';
import axios from 'axios';
import ErrorMessage from '../components/ErrorMessage';

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState([]);

    const navigate = useNavigate();

    const handleFirstNameChange = (e) => setFirstName(e.target.value);
    const handleLastNameChange = (e) => setLastName(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

    const signUp = async () => {
        const newError = [];

        if (firstName === '' || lastName === '' || email === '' || username === '' ||
            password === '' || confirmPassword === '') {
            newError.push('Required field is empty.');
        }

        if (password !== confirmPassword) {
            newError.push('Passwords don\'t match');
        }

        if (newError.length > 0) {
            setError(newError);
            return;
        }

        const user = {
            first_name: firstName,
            last_name: lastName,
            email,
            username,
            password
        };

        try {
            await axios.post('/accounts/api/signup', user);
            navigate('/login');
        } catch (err) {
            if (err.response.status === 400) {
                const msg = err.response.data?.username?.[0];
                if (msg) {
                    setError([msg]);
                }
                return;
            }
            console.error(err);
        }
    };

    return (
        <div className="bg-shadow flex items-center min-h-[550px] h-dvh justify-center p-2">
            <div
                className="flex flex-col md:flex-row w-full h-full md:max-h-[700px] lg:max-w-[900px] bg-white rounded-lg drop-shadow-md">
                <div
                    className="h-min md:h-full md:w-1/2 md:flex md:justify-center rounded-tl-lg rounded-tr-lg md:rounded-tr-none md:rounded-bl-lg bg-pale-green p-10">
                    <img src={logo} alt="1on1" className="mx-auto md:self-center" />
                </div>
                <div className="py-4 px-8 md:py-14 md:w-1/2">
                    <p className="font-bold text-3xl">Sign Up</p>
                    <p className="text-base">Enter your information to sign up.</p>

                    <form className="mt-6">
                        <div className="mb-4 flex flex-row gap-2 w-full justify-stretch">
                            <div className="w-full">
                                <label htmlFor="first-name">
                                    <p className="font-bold">First Name<span className="text-red-600">*</span></p>
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input type="text" name="first-name" id="first-name"
                                        className="block w-full rounded-lg border-0 py-1.5 pl-4 pr-4 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-dark-green text-sm leading-6"
                                        placeholder="First Name"
                                        onChange={handleFirstNameChange} />
                                </div>
                            </div>
                            <div className="w-full">
                                <label htmlFor="last-name">
                                    <p className="font-bold">Last Name<span className="text-red-600">*</span></p>
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input type="text" name="last-name" id="last-name"
                                        className="block w-full rounded-lg border-0 py-1.5 pl-4 pr-4 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-dark-green text-sm leading-6"
                                        placeholder="Last name"
                                        onChange={handleLastNameChange} />
                                </div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="username">
                                <p className="font-bold">Username<span className="text-red-600">*</span></p>
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <input type="text" name="username" id="username"
                                    className="block w-full rounded-lg border-0 py-1.5 pl-4 pr-20 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-dark-green text-sm leading-6"
                                    placeholder="Enter your email address"
                                    onChange={handleUsernameChange} />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email">
                                <p className="font-bold">Email<span className="text-red-600">*</span></p>
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <input type="email" name="email" id="email"
                                    className="block w-full rounded-lg border-0 py-1.5 pl-4 pr-20 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-dark-green text-sm leading-6"
                                    placeholder="Enter your email address"
                                    onChange={handleEmailChange} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password">
                                <p className="font-bold">Password<span className="text-red-600">*</span></p>
                            </label>
                            <input type="password" name="password" id="password"
                                className="block w-full rounded-lg border-0 py-1.5 pl-4 pr-20 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-dark-green text-sm leading-6"
                                placeholder="Enter your password"
                                onChange={handlePasswordChange} />
                            <input type="password" name="confirm" id="confirm"
                                className="mt-2 block w-full rounded-lg border-0 py-1.5 pl-4 pr-20 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-dark-green text-sm leading-6"
                                placeholder="Confirm your password"
                                onChange={handleConfirmPasswordChange} />
                        </div>
                        <div className='mt-4'>
                            {error.length > 0 ? <ErrorMessage msgs={error}/> : <></>}
                        </div>
                        <div className="mt-6">
                            <button type="button"
                                className="bg-dark-green text-white w-full p-1 rounded-lg" onClick={signUp}>Sign Up</button>
                        </div>
                    </form>
                    <div className="h-px rounded bg-gray-300 mt-3"></div>
                    <div className="text-center mt-2">
                        <p>Already have an account? <Link to='/login'><span
                            className="text-dark-green underline font-bold hover:cursor-pointer">Log In</span></Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
