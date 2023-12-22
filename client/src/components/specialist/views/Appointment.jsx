import "tailwindcss/tailwind.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SelectStatus from "./SelectStatus"; 

export default function Appointment() { 
  const { userInfo } = useSelector((state) => state.auth);

  const [ nameFilter, setNameFilter ] = useState("");
  const [ dateFilter, setDateFilter ] = useState(); // Añadimos un estado para el filtro por fecha

  // Añadimos un estado para guardar las citas
  const [data, setData] = useState([]);
  

  async function getAppointment() {
    try {
      // Asegúrate de tener userInfo definido antes de usarlo
      const userInfo1 = userInfo._doc._id;

      // Usa la URL con comillas invertidas para incluir variables en la cadena
      const response = await axios.get(
        `/api/appointments/specialist/${userInfo1}`,
        {
          Cookie: `jwt=${userInfo.token}`,
        }
      );
      return response.data;
      // Retorna los datos de la respuesta
      // return response.data.map((item) => ({ ...item, editMode: false }));
    } catch (error) {
      // Maneja errores de Axios y otros errores generales
      if (axios.isAxiosError(error)) {
        // Error de Axios (puedes acceder a error.response para obtener más detalles)
        if (error.response) {
          throw error.response.data;
        } else {
          throw new Error(
            "Error inesperado con la solicitud de disponibilidad"
          );
        }
      } else if (error instanceof Error) {
        // Otro tipo de error
        throw new Error(`${error.message}`);
      } else {
        // Otro tipo de error inesperado
        throw new Error("Error inesperado:", error);
      }
    }
  }
  console.log("Data", data);

  useEffect(() => {
    const appointment = async () => {
      try {
        const answer = await getAppointment();
        setData(answer);
      } catch (error) {
        console.error(Error);
      }
    };
    appointment();
  }, []);

  const filterData = data.filter((dat) => {
    // Verifica si nameFilter está presente
    const filterPresent = nameFilter && nameFilter.trim() !== '';
    const filterTime = dateFilter && dateFilter.trim() !== '';
  
    // Si no hay filtro de nombre y no hay filtro de tiempo, devuelve true
    if (!filterPresent && !filterTime) {
      return true;
    }
  
    // Verifica el filtro de nombre
    const nameMatch =
      dat.customerId?.firstName &&
      dat.customerId?.lastName &&
      `${dat.customerId.firstName} ${dat.customerId.lastName}`
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
  
    // Verifica el filtro de tiempo
    const timeMatch =
      dat.startTime &&
      dat.startTime.slice(0, 10).includes(dateFilter);
  
    // Devuelve true si al menos una de las condiciones es verdadera
    return nameMatch || timeMatch;
  });



  return (
    <div>
      <div className="flex flex-col text-center py-16 mt-16 px-64">
        <div className="flex justify-evenly">
          <div className="flex items-center justify-between pb-6">
            <div className="relative mt-1">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-8 flex items-center ps-3 py-7 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className=" block pt-7 h-1 ps-10 py-4 text-center w-30 text-sm text-gray-900 border border-gray-300 rounded-lg  bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Filter by name"
                value={nameFilter}
                onChange={(e) => {
                  setNameFilter(e.target.value);
                  console.log("Estado del filtro:", e.target.value);
                }}          
              />
            </div>
          </div>
          <div className="flex items-center justify-between pb-6">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-8 flex items-center ps-3 py-7 pointer-events-none">
                <svg
                  className="w-4 h- text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="table-search"
                className=" block pt-7 h-1 ps-10 py-4 text-center text-sm text-gray-900 border border-gray-300 rounded-lg  bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Filter by Date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        <table className="w-full ml-20">
          <thead className="text-xs text-gray-700 uppercase bg-green-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-20 py-4">Name</th>
              <th scope="col" className="px-20 py-4">Date</th>
              <th scope="col" className="px-4 py-4">Hour</th>
              <th scope="col" className="px-4 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {(filterData || []).map((dat) => (
              <tr
                key={dat._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                  {dat.customerId ? dat.customerId.firstName : "no name"} | {dat.customerId ? dat.customerId.lastName : "no last name"}

                </td>
                <td className="px-4 py-4">{dat.startTime.slice(0,10)}</td>
                <td className="px-4 py-4">{dat.startTime.slice(-5)} - {dat.endTime.slice(-5)}</td>
                <td className="px-4 py-4">{dat.status}</td>
                <div className="px-4 py-4 mb-2"><SelectStatus id={dat._id} getAppointment={getAppointment} setData={setData} /></div>
              </tr>
             
            ))}
          </tbody>          
        </table>
      </div>
    </div>
  );
}
