import "tailwindcss/tailwind.css";
import FilterScreen from "../../../screens/FilterScreen";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast }  from  'react-toastify'
import { useParams } from 'react-router-dom';
import { Table } from 'flowbite-react';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux'; 


const fetchAvailability = async () => {
  const response = await axios.get(`/api/appointments/customer/${id}`).catch(() => {
    throw new Error('Error fetching appointments');
  });
  return response.data;
};

export default function Appointments() {
  const { data, status } = useQuery("appointments", fetchAvailability);

  console.log(data);

  return (
    <div className="overflow-x-auto">
      {status === "error" && <p>Error fetching data</p>}
      {status === "loading" && <p>Fetching data...</p>}
      {status === "success" && data && (
        
        <Table className="mt-10">
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          
          <Table.Body className="divide-y">
          {(data || []).map((appointment) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={appointment._id}>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {appointment.specialistId.firstName ? appointment.specialistId.firstName : "-"}
              </Table.Cell>
              <Table.Cell>{appointment.startTime}</Table.Cell>
              <Table.Cell className="w-96 h-30">{appointment.specialistId.description ? appointment.specialistId.description : "-"}</Table.Cell>
              <Table.Cell>{appointment.status}</Table.Cell>
              <Table.Cell>
                <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                  Edit
                </a>
              </Table.Cell>
            </Table.Row>
           ))}
          </Table.Body>
          
        </Table>
      )}
      
    </div>
  );
}
