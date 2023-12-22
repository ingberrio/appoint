import React, { useState, useEffect } from 'react';
import AppoinmentSidebar from '../components/AppoinmentSidebar';
import ScheduleList, { weekDays } from '../components/ScheduleList';
import { Button, DropdownItem } from 'flowbite-react';
import { Dropdown } from 'flowbite-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom'; 




const ScheduleScreen = () => {

    const { userInfo } = useSelector((state) => state.auth);

    const navigate = useNavigate();

    const fetchSchedule = async () => {
        const schedule = await axios.get(`/api/appointments/customer/${userInfo._doc._id}`)
        return schedule.data;
    };


    const { data: scheduleData = [], isLoading, error, refetch } = useQuery(['appointments'], fetchSchedule, {
        keepPreviousData: true,
    });

    const [selectedDay, setSelectedDay] = useState('All Days');
    const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');

    const filteredData = scheduleData.filter(
        (schedule) => (selectedDay === "All Days" || schedule.availabilityId.dayOfWeek === selectedDay)
            && (selectedSpecialty === "All Specialties" || schedule.specialistId.specialtyId.name === selectedSpecialty)
    );

    const handlerNewAppointment = () => {
        navigate("/filter?search=")

    };



    return (
        <>

            <div>

                <AppoinmentSidebar />

                <div className='flex justify-center -mt-40 ml-60 gap-20 '>



                    <Dropdown label={selectedSpecialty} size="sm">
                        <Dropdown.Item onClick={() => { setSelectedSpecialty("All Specialties") }}>All Specialties</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedSpecialty("Cardiology") }}>Cardiology</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedSpecialty("Ophthalmology") }}>Ophthalmology</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedSpecialty("Neurology") }}>Neurology</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedSpecialty("Dermatology") }}>Dermatology</Dropdown.Item>
                    </Dropdown>

                    <Dropdown label={weekDays[selectedDay] || "All Days"} size="sm">
                        <Dropdown.Item onClick={() => { setSelectedDay("All Days") }}>All Days</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedDay(0) }}>Sun</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedDay(1) }}>Mon</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedDay(2) }}>Tue</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedDay(3) }}>Wed</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedDay(4) }}>Thur</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedDay(5) }}>Fri</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setSelectedDay(6) }}>Sat</Dropdown.Item>
                    </Dropdown>



                    <Button onClick={() => { handlerNewAppointment() }}>New Appoinment</Button>
                    {/* this button send to new appointments page */}

                </div>

                <ScheduleList scheduleData={filteredData} refetch={refetch} />

            </div>

        </>

    )
}

export default ScheduleScreen