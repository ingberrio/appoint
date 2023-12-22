import React from 'react'
import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards } from 'react-icons/hi';

const AppoinmentSidebar = () => {
    return (
        <Sidebar className='mt-20 z-100'> 
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item href="http://localhost:3000/schedule" icon={HiChartPie}>
                        Dashboard
                    </Sidebar.Item>
                    <Sidebar.Item href="#" icon={HiInbox}>
                        Appoinments {/* this button send to new appointments registration page */}
                    </Sidebar.Item>
                    <Sidebar.Item href="http://localhost:3000/profile" icon={HiUser}>
                        Profile
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default AppoinmentSidebar