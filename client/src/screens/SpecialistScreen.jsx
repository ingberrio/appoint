import {  Routes, Route, Outlet } from "react-router-dom";
import DashboardSlideBar from "../components/specialist/DashboarSlideBar";


import Availability from "../components/specialist/views/Availability";
import Appointment from "../components/specialist/views/Appointment";
import Profile from "../components/specialist/views/profile/Profile";


export default function SpecialistScreen() {
  return (
    <>

        <DashboardSlideBar />
        
          <Routes>
          <Route path="/availability" element={<Availability />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/profile" element={<Profile />} />
          </Routes>
    
          <Outlet /> 

    </>
  );
}