import { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 


const AppointmentForm = ({ selectedSlot, selectedDate, availability, onSubmit }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [customerName, setCustomerName] = useState('');
  const [comments, setComments] = useState('');
  const { specialistId } = useParams();
  const navigate = useNavigate();
  
  
  
  const date = new Date(selectedDate);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // mes empieza en 0
  const day = date.getDate();
  const selectDate = `${year}-${month}-${day}`;
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedSlot) {
      toast.warning('Register an hour');
      return;
    }
  
    if (!customerName.trim()) {
      toast.warning('Register a name');
      return;
    }

    const formData = {
      customerName, 
      comments,
      customerId: userInfo._doc._id,
      specialistId: specialistId,
      availabilityId: selectedSlot._id, 
      startTime: `${selectDate}${selectedSlot.startTime}`,
      endTime: `${selectDate}${selectedSlot.endTime}`,
    };

    if (!userInfo) {
      // Si el usuario no está autenticado
      navigate('/login', { state: { from: 'availability', formData } });
      return;
    }

    try {
      const apiUrl = '/api/appointments';

      // Realiza una solicitud al servidor para guardar la cita
      const response = await axios.post(apiUrl, formData);
      
      // Clean inputs after submit form
      setCustomerName('');
      setComments('');

      onSubmit(response.data);
      toast.success('Appointment successfully created');
      
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  

  return (
    <>
      <div className='ml-5 p-5 border rounded-lg border-gray-400'>
        <form onSubmit={handleSubmit} className='rounded-sm border-sky-400'>
          <h3 >Schedule appointment</h3>

          {/* Muestra la información del horario seleccionado */}
          <p className='mt-4'>Hours: {selectedSlot.displayTime}</p>

          {/* Campos del formulario */}
          
          <div>
            <label htmlFor="customerName" className="block mt-4 mb-2 text-sm font-medium dark:text-white">
              Name:
            </label>
            <input 
              type='text'
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            />
          </div>
          
          <div>
            <label htmlFor="comments" className="block mt-4 mb-2 text-sm font-medium dark:text-white">
              Comments:
            </label>
            <textarea 
              type='tex'
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            />
          </div>

          {/* Botón de envío del formulario */}
          <button type="submit" className=" mt-5 bg-blue-700 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Schedule</button>
        </form>
      </div>
    </>
  );
};

export default AppointmentForm;
