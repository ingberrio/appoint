import { useState, useEffect } from 'react';
import { Card, Avatar } from 'flowbite-react';
import { useQuery } from 'react-query';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import { Link } from "react-router-dom";


const FilterScreen = () => {
  const [cityFilter, setCityFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [page, setPage] = useState(1);

  // Obtiene la ubicación actual
  const location = useLocation();

  // Extrae el término de búsqueda de la URL
  const searchTerm = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    setCityFilter('');
    setNameFilter('');
    setSpecialtyFilter(searchTerm);
  }, [searchTerm]);

  const fetchSpecialists = async (pageNum = 1) => {
    const response = await axios.get(`/api/specialists?page=${pageNum}`).catch(() => {
        throw new Error('Error fetching specialists');
    });
    return response.data;
  };

  const { data: specialists = [], isLoading, error, refetch } = useQuery(['specialists', page], () => fetchSpecialists(page), {
    keepPreviousData: true,
  });

  useEffect(() => {
    // Si cambia algún filtro, reiniciar la paginación
    setPage(1);
    refetch();
  }, [cityFilter, nameFilter, specialtyFilter, refetch]);

  if (error) {
    console.error('Error fetching specialists:', error);
  }

  return (
    <>
      <FormContainer>
        <section className="p-40">
          <div className=" flex items-center justify-center py-4 md:py-8 flex-wrap gap-4">
            <input
              type="text"
              placeholder="Filter by city"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by Specialty"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            />
          </div>
          {isLoading ? (
            <div className="text-center">
              <div role="status">
                  <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
              </div>
          </div>
          ) : (
        
          <InfiniteScroll
            dataLength={specialists.length}
            next={() => setPage(prevPage => prevPage + 1)}
            hasMore={!isLoading && specialists.length === page * 9}
            loader={<p className='text-center mt-10'>Loading...</p>}
            endMessage={<p className='text-center mt-10'>No hay más resultados.</p>}
            scrollThreshold={0.7}
          >
            <div className="grid md:grid-cols-3 place-items-center gap-4">
              {(specialists || []).map((specialist, i) => {
                console.log(specialist);
                const cityMatches = cityFilter
                  ? specialist.cityId && specialist.cityId.name
                    ? specialist.cityId.name.toLowerCase().includes(cityFilter.toLowerCase())
                    : false
                  : true;

                const nameMatches = nameFilter
                  ? specialist.firstName && specialist.firstName.toLowerCase().includes(nameFilter.toLowerCase())
                  : true;

                const specialtyMatches = specialtyFilter
                  ? specialist.specialtyId && specialist.specialtyId.name
                    ? specialist.specialtyId.name.toLowerCase().includes(specialtyFilter.toLowerCase())
                    : false
                  : true;

                if (!cityMatches || !nameMatches || !specialtyMatches) {
                  return null;
                }

                return (
                  <div key={i}>
                    <Card className="card max-w-sm" key={i}>
                      <div className="flex flex-wrap gap-2 w-50 h-50">
                        <Avatar img="/logo.svg" rounded size="lg">
                          <div className="space-y-1 font-medium dark:text-white">
                            <h4>
                              {specialist.specialtyId ? specialist.specialtyId.name : 'Specialty Not Available'}
                            </h4>
                            <div>{specialist.firstName}</div>
                            <div>Tel: {specialist.phone}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {specialist.cityId ? specialist.cityId.name : 'City Name Not Available'}
                            </div>
                          </div>
                        </Avatar>
                      </div>
                      <a href="#">
                          <div>{specialist.description}</div>
                      </a>
                      <div className="mb-5 mt-2.5 flex items-center">
                        {/* ... (código anterior) */}
                      </div>
                      <div className="flex items-center justify-between">
                      <Link
                        to={`/abailability/${specialist._id}`} 
                        className="rounded-lg bg-cyan-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                      >
                          Schedule appointment
                        </Link>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        )}  
        </section>
      </FormContainer>
    </>
  );
};

export default FilterScreen;
