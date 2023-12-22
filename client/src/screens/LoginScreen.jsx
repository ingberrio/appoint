import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/userApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { Spinner } from 'flowbite-react';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // to get the location state

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);
    
    useEffect(() => {
        if (userInfo) {

            if (userInfo._doc.role === "specialist") {
                navigate(`/specialist/availability`)
            }else {
            navigate('/');
            }
        }
    }, [navigate, userInfo]);
    console.log(userInfo)


    const submitHandler = async (e) => {
        e.preventDefault();
        try {
          const res = await login({ email, password }).unwrap();
          dispatch(setCredentials({ ...res }));
    
          // Check if there is a state in the location and it's coming from the appointment screen
          if (location.state && location.state.from === 'appointment') {
            // Redirect back to the appointment screen with stored form data
            navigate('/appointment', { state: location.state.formData });
            
            } else {
            // If not coming from the appointment screen, redirect to the default location
            navigate('/');
           
          }
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      };

    return (
        <>
            <FormContainer>
            <section className="bg-gray-50 dark:bg-gray-900 mt-20">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input 
                                    type="email" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    id="email" 
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input 
                                    type="password" 
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    id="password" 
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <a href="#" className="text-sm text-gray-500 font-medium text-primary-600 hover:underline dark:text-primary-800">Forgot password?</a>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full bg-purple-500 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet? <a href="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                        </p>
                        </form>
                        {isLoading && 
                            <div className="text-center">
                                <Spinner aria-label="Center-aligned spinner example" />
                            </div>
                        }
                        </div>
                        </div>
                </div>
            </section>
            </FormContainer>
        </>
    )
}

export default LoginScreen
