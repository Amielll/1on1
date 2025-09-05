import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/1on1.png';
import { useState } from 'react';
import { useAuth } from '../global_state/AuthProvider';
import ErrorMessage from '../components/ErrorMessage';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState([]);
    const { setToken, setRefresh } = useAuth();

    const navigate = useNavigate();

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const login = async () => {
        const newError = [...error];
        if (username === '') {
            newError.push('Username cannot be empty.');
        }

        if (password === '') {
            newError.push('Password cannot be empty.');
        }

        if (newError.length > 0) {
            setError(newError);
            return;
        }

        try {
            const res = await axios.post('/accounts/api/login', {
                username,
                password
            });
            setToken(res.data.access);
            setRefresh(res.data.refresh);
            setError([]);

            navigate('/');
        } catch (err) {
            if (err.response.status === 401) {
                setError([err.response.data.detail]);
            } else {
                console.error(err);
            }
        }
    };

    return (
        <div className='bg-shadow flex items-center min-h-[550px] h-dvh justify-center p-2'>
            <div className="flex flex-col md:flex-row w-full h-full md:max-h-[550px] lg:max-w-[900px] bg-white rounded-lg drop-shadow-md">
                <div className="h-min md:h-full md:w-1/2 md:flex md:justify-center rounded-tl-lg rounded-tr-lg md:rounded-tr-none md:rounded-bl-lg bg-pale-green p-10">
                    <img src={logo} alt="1on1" className="mx-auto md:self-center" />
                </div>
                <div className="py-4 px-8 md:py-14 md:w-1/2">
                    <p className="font-bold text-3xl">Welcome Back!</p>
                    <p className="text-base">Enter your account information to get started.</p>

                    <form className="mt-6">
                        <div className="mb-4">
                            <label htmlFor="email">
                                <p className="font-bold">Username<span className="text-red-600">*</span></p>
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <input type="text" name="email" id="email"
                                    className="block w-full rounded-lg border-0 py-1.5 pl-4 pr-20 ring-2 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-dark-green text-sm leading-6"
                                    placeholder="Enter your username"
                                    onChange={handleUsernameChange} />
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
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <input type="checkbox" className="text-dark-green focus:ring-0 focus:ring-transparent rounded" />
                                <label htmlFor="remember" className="ml-1">Remember Me</label>
                            </div>
                            <div className="hover:cursor-pointer">
                                <p className="text-dark-green">Forgot password?</p>
                            </div>
                        </div>
                        <div className='mt-4'>
                            {error.length > 0 ? <ErrorMessage msgs={error}></ErrorMessage> : <div></div>}
                        </div>
                        <div className="mt-6">
                            <button type="button" className="bg-dark-green text-white w-full p-1 rounded-lg" onClick={login}>Log In</button>
                        </div>
                    </form>
                    <div className="h-px rounded bg-gray-300 mt-3"></div>
                    <div className="text-center mt-2">
                        <p>Don't have an account? <Link to="/signup"><span className="text-dark-green underline font-bold hover:cursor-pointer">Sign Up</span></Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
