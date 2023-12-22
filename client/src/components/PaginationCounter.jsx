import React from 'react'
import { Pagination } from 'flowbite-react';




const PaginationCounter = ({numberOfPages, currentPage, setCurrentPage}) => {
    
    const onPageChange = (page) => setCurrentPage(page);

    
    return (

        <>
            <div className="flex overflow-x-auto sm:justify-center mt-10 mr-40">
                <Pagination currentPage={currentPage} totalPages={numberOfPages} onPageChange={onPageChange} showIcons />
            </div>

        </>

    );
}

export default PaginationCounter