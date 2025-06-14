import { useState, useRef} from "react";
import  axios  from "axios";
import { Table } from 'flowbite-react'
import { useQuery } from "react-query";

const fetchAvailability = async () => {
  const response = await axios.get('/api/availability/specialist/65787dc83e6f9c65bbf20464').catch(() => {
    throw new Error('Error fetching specialists');
  });
  return response.data;
};

export default function AvailabilityView() {

  const { data, status} = useQuery("availability", fetchAvailability);
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
            <Table.HeadCell>Hour</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Delete</span>
            </Table.HeadCell>
          </Table.Head>
          
          <Table.Body className="divide-y">
          {(data || []).map((availability) => (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={availability._id}>
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {availability.specialistId.firstName}
              </Table.Cell>
              <Table.Cell>{availability.dayOfWeek == 1 ? 'Mon' : 'Thus'}</Table.Cell>
              <Table.Cell>{availability.specificHours.startTime}</Table.Cell>
              <Table.Cell>{availability.status}</Table.Cell>
              <Table.Cell>
                <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                  Edit
                </a>
              </Table.Cell>
              <Table.Cell>
                <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                  Delete
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
