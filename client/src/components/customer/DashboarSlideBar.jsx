import "flowbite";
import { Link } from "react-router-dom";
import { Sidebar } from 'flowbite-react';
import { BiBuoy } from 'react-icons/bi';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';
import axios from "axios";
import { useQuery } from 'react-query';

export default function DashboarSlideBar() {
  const fetchAvailability = async () => {
    const response = await axios.get('/api/specialists').catch(() => {
      throw new Error('Error fetching appointments');
    });
    return response.data;
  };
  const { data, status } = useQuery("specialist", fetchAvailability);

  console.log(data);
  return (
    <Sidebar aria-label="Sidebar with content separator example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="#" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="appointments" icon={HiViewBoards}>
            Appointments
          </Sidebar.Item>
          <Sidebar.Item href="/filter" icon={HiTable}>
            Schedule
          </Sidebar.Item>
          <Sidebar.Item href="profile" icon={HiUser}>
            Profile
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        
      </Sidebar.Items>
    </Sidebar>
  );
}
