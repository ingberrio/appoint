import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/userApiSlice';
import { logout } from '../slices/authSlice';
import { Dropdown } from 'flowbite-react'; 


function Header() {
    const { userInfo } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = () => {
        logoutApiCall()
            .unwrap()
            .then(() => {
                dispatch(logout());
                navigate('/login');
            })
            .catch((err) => {
                console.error(err);
            });
    };


    return (
        <>
            <header>
                <nav className="bg-sky-100 dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 ">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                            <img src="/logo.svg" className="h-14" alt="Appointment Logo" />
                        </a>
                        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                            {userInfo ? (
                                <>
                                    <Dropdown label={userInfo.userName} dismissOnClick={false} color="primary">
                                        <Dropdown.Header>
                                            <img className="ml-3 w-8 h-8 rounded-full" src="/user.png" alt="user photo" />
                                        </Dropdown.Header>
                                        <Dropdown.Item>
                                            <a href="/schedule" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <a href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Profile</a>
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            <div className="py-2">
                                                <a href="/" onClick={logoutHandler} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                                            </div>
                                        </Dropdown.Item>
                                    </Dropdown>
                                </>
                            ) : (
                                <>
                                    <a href="/login" className="text-white bg-purple-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login</a>
                                </>

                            )}
                            {!userInfo && (
                                <button data-collapse-toggle="navbar-dropdown" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-dropdown" aria-expanded="false">
                                    <span className="sr-only">Open main menu</span>
                                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="bg-sky-100 items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-dropdown">
                            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                                <li className="bg-sky-100">
                                    <a href="/" className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</a>
                                </li>
                                <li className="bg-sky-100">
                                    <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
                                </li>
                                <li className="bg-sky-100">
                                    <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
                                </li>
                                <li className="bg-sky-100">
                                    <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Header