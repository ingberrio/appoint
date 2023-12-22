import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Table } from 'flowbite-react';
import PaginationCounter from './PaginationCounter';
import { Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { useQuery } from 'react-query';


export const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const rowsByPage = 3



const ScheduleList = ({refetch, scheduleData}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const initialRowIndex = (currentPage - 1) * rowsByPage
    const finalRowIndex = currentPage * rowsByPage
    const numberOfPages = Math.ceil(scheduleData.length / rowsByPage);

    const deleteAppointment = async (appointmentsId) => {
        await axios.delete(`/api/appointments/${appointmentsId}`)
        refetch();
    }
    
    return (

        <>
            <div className='w-4/5 ml-80 mt-20'>

                <Table striped>
                    <Table.Head>
                        <Table.HeadCell>Specialties</Table.HeadCell>
                        <Table.HeadCell>Date</Table.HeadCell>
                        <Table.HeadCell>Doctor</Table.HeadCell>
                        <Table.HeadCell>City</Table.HeadCell>
                        <Table.HeadCell>Action</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">

                        {scheduleData.slice(initialRowIndex, finalRowIndex).map((schedule) => (
                            <Table.Row key={schedule._id}  className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {schedule.specialistId.specialtyId.name}
                                </Table.Cell>
                                <Table.Cell>{weekDays[schedule.availabilityId?.dayOfWeek]}</Table.Cell>
                                <Table.Cell>{`${schedule.specialistId.firstName} ${schedule.specialistId.lastName}`}</Table.Cell>
                                <Table.Cell>{schedule.specialistId.cityId.name}</Table.Cell>
                                <Table.Cell>

                                    <div className='flex justify-left items-center gap-5'>
                                        <Button size="xs" onClick={()=>deleteAppointment(schedule._id)}>Delete</Button>
                                    </div>


                                </Table.Cell>
                            </Table.Row>)
                        )
                        }
                    </Table.Body>
                </Table>
                {numberOfPages > 1 && <PaginationCounter numberOfPages={numberOfPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />}
            </div >

        </>
    );
}





export default ScheduleList
