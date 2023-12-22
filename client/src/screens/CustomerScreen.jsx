import {  Routes, Route, Outlet } from "react-router-dom";
import DashboardSlideBar from "../components/customer/DashboarSlideBar";

import Schedules from "../screens/FilterScreen";
import Appointments from "../components/customer/views/Appointments";
import Profile from "../components/customer/views/profile/Profile";
import FormContainer from '../components/FormContainer';

export default function CustomerScreen() {
  return (
    <>
        <FormContainer>
          <div className="grid grid-flow-col auto-cols-max">
            <div className="mt-14">
              <DashboardSlideBar />
            </div>
            <div className="ml-10 mt-20" >
            <Routes>
              <Route path="/filter" element={<Schedules />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            </div>
          </div>
        </FormContainer>  
    </>
  );
}