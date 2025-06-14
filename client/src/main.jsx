import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import store from './store.js';
import { Provider } from 'react-redux';
import App from './App.jsx';
import './index.css';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PrivateRoute from './screens/PrivateRoute';
import ProfileScreen from './screens/ProfileScreen.jsx';
import FilterScreen from './screens/FilterScreen.jsx';
import AvailabilityScreen from './screens/AvailabilityScreen.jsx';

import ScheduleScreen from './screens/ScheduleScreen.jsx';

import { QueryClient, QueryClientProvider } from 'react-query';
import SpecialistScreen from './screens/SpecialistScreen.jsx';
import CustomerScreen from './screens/CustomerScreen.jsx';


const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/filter' element={<FilterScreen />} />
      <Route path="/availability/:specialistId" element={<AvailabilityScreen />} />
      <Route path='/specialist/*' element={<SpecialistScreen />} />
      <Route path='/customer/*' element={<CustomerScreen />} />
      {/* Private Routes */}
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/schedule' element={<ScheduleScreen />} />
      </Route>
    </Route>
  )
); 

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={ router } />
      </QueryClientProvider>
    </React.StrictMode>
  </Provider>
)
