import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AppointmentForm from './AppointmentForm';
import FormContainer from '../components/FormContainer';

const AbailabilityScreen = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formVisible, setFormVisible] = useState(false);  // Nuevo estado para controlar la visibilidad del formulario
  const [selectedSlot, setSelectedSlot] = useState(null);  // Nuevo estado para almacenar el horario seleccionado
  const { specialistId } = useParams();
  
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get(`/api/availability/specialist/${specialistId}`);
        const availabilities = response.data;
        const slots = availabilities.reduce((acc, availability) => {
          const { _id, specificHours, dayOfWeek } = availability;

          specificHours.forEach((slot) => {
            const startTime = `T${slot.startTime}`;
            const endTime = `T${slot.endTime}`;

            acc.push({
              _id,
              startTime,
              endTime,
              displayTime: `${slot.startTime} - ${slot.endTime}`,
              dayOfWeek,  
            });
          });

          return acc;
        }, []);

        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching availability:', error);
        toast.error('Error fetching availability');
      }
    };

    fetchAvailability();
  }, [specialistId]);

  const handleSlotSelect = (selectedSlot) => {
    console.log('Slot selected:', selectedSlot);
    setFormVisible(true);
    setSelectedSlot(selectedSlot);
  };

  // Función para manejar la selección de una fecha
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    //setSelectedSlot(null); // Reiniciar el horario seleccionado al cambiar la fecha
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted with data:', formData);
    // Puedes agregar la lógica para enviar los datos al servidor aquí
  };

  return (
    <FormContainer>
        <section className="p-40">
          <div className='p-5 border rounded-lg border-dashed border-gray-400'>
          <div className=" flex items-center justify-center py-4 md:py-8 flex-wrap gap-4">
          <DatePicker
              dateFormat="MMMM d, yyyy"
              selected={selectedDate}
              onChange={(date) => handleDateSelect(date)}
              inline
            />
            {/* Muestra los horarios disponibles */}
            <div className='ml-5 p-5 rounded-lg  border-gray-400'>
            {availableSlots.length === 0 ? (
                <p className="rounded-lg border px-5 py-2.5 text-center text-sm font-medium text-black hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                > Not abailability
                </p>
              ) : (
                availableSlots.map((slot) => (
                  <div key={`${slot.startTime}-${slot.endTime}`} className='mt-3'>
                    <button 
                      onClick={() => handleSlotSelect(slot)} 
                      className="rounded-lg border px-5 py-2.5 text-center text-sm font-medium text-black hover:bg-cyan-200 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                    > 
                      {slot.displayTime}
                    </button>
                  </div>
                ))
            )}
            </div>
            {/* Muestra el formulario solo si un horario está seleccionado */}
            {formVisible && (
              <div className='rounded-sm border-sky-400'>
                <AppointmentForm 
                  selectedSlot={selectedSlot} 
                  selectedDate={selectedDate} 
                  onSubmit={handleFormSubmit} 
                />
              </div>
            )}
        </div>
        </div>
      </section>
    </FormContainer>
  );
};


export default AbailabilityScreen;
