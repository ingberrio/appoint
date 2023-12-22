import { useState, useEffect } from "react";
import TimePicker from "react-time-picker";
import "tailwindcss/tailwind.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import axios from "axios";
import { useSelector } from "react-redux";
import SelectDay from "./SelectDay";

function Availability() {
  const { userInfo } = useSelector((state) => state.auth);
  
  // Estos son los estados para guardar las fechas y horas de inicio y fin
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [disponibilityData, setDisponibilityData] = useState([]);
  const [create, setCreate] = useState();
  const [day, setDay] = useState("");

  function dayMap(day) {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (Number.isInteger(Number(day))) {
      return weekDays[day];
    }
    return weekDays.indexOf(day);
  }

  //axios post Hability
  const postDisponibility = async (order) => {
    if (order === true) {
      const postDisponibilityData = {
        specialistId: userInfo._doc._id,
        dayOfWeek: day,
        specificHours: [{ startTime: startTime, endTime: endTime }],
      };
      const response = await axios
        .post(`/api/availability/`, postDisponibilityData, {
          Cookie: `jwt=${userInfo.token}`,
        })
        .catch(() => {
          throw new Error("Error specialists");
        });
      return response.status;
    }
  };
  //axios put Hability
  const putDisponibility = async (row) => {
    const putDisponibilityData = {
      specialistId: row.specialistId,
      dayOfWeek: row.dayOfWeek,
      specificHours: [{ startTime: startTime, endTime: endTime }],
    };
    console.log(row);
    const response = await axios
      .put(`/api/availability/${row._id}`, putDisponibilityData, {
        Cookie: `jwt=${userInfo.token}`,
      })
      .catch(() => {
        throw new Error("Error specialists");
      });
    return response.status;
  };

  //axios get Hability
  async function getAvailability() {
    try {
      // Asegúrate de tener userInfo definido antes de usarlo
      const userInfo1 = userInfo._doc._id;

      // Usa la URL con comillas invertidas para incluir variables en la cadena
      const response = await axios.get(
        `/api/availability/specialist/${userInfo1}`,
        {
          Cookie: `jwt=${userInfo.token}`,
        }
      );
      // Retorna los datos de la respuesta
      return response.data.map((item) => ({ ...item, editMode: false }));
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

  //axios delete Hability
  const deleteDisponibility = async (id) => {
    const response = await axios
      .delete(`/api/availability/${id}`, {
        Cookie: `jwt=${userInfo.token}`,
      })
      .catch(() => {
        throw new Error("Error specialists");
      });
    console.log(response);
  };

  // Esta es la función que se ejecuta cuando se hace clic en el botón de editar de una fila
  const handleEdit = (row) => {
    // Aquí cambiamos el valor de editMode a true para la fila seleccionada
    setDisponibilityData((prevData) =>
      prevData.map((r) =>
        r._id === row ? { ...r, editMode: true } : { ...r, editMode: false }
      )
    );

    // Aquí asignamos los valores actuales de la fila a los estados horaInicio y horaFin
    setStartTime(row.startTime);
    setEndTime(row.endTime);
  };

  //Aqui crea una nueva linea al dar click al boton Create Line

  const handleCreateLine = async () => {
    setCreate(true);      
  };

  const handlePostDisponibility = async (order) => {
    await postDisponibility(order);
    setCreate(false);
    const data = await getAvailability();
    setDisponibilityData(data);
  }; 

  const handleUpDate = async (row) => {
    await putDisponibility(row);
    const data = await getAvailability();
    setDisponibilityData(data);
  }

  // Esta es la función que se ejecuta cuando se hace clic en el botón de eliminar de una fila
  const handleDelete = async (id) => {
    // En este caso, solo vamos a eliminar la fila de la tabla
    await deleteDisponibility(id);
    const data = await getAvailability();
    setDisponibilityData(data);
  };

  const handleCancelEdit = (row) => {
    setDisponibilityData((prevData) =>
      prevData.map((r) =>
        r._id === row ? { ...r, editMode: false } : r
      )
    );
  };

  useEffect(() => {
    const obtenerDisponibilidad = async () => {
      try {
        const data = await getAvailability();
        setDisponibilityData(data);
      } catch (error) {
        console.error(Error);
      }
    };
    obtenerDisponibilidad();
  }, []);

  return (
    <div className="flex flex-wrap justify-right text-center pt-16 mt-16 pl-20">
      <div className="flex space-x-2">
        <button
          className="bg-blue-600 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-sm p-3 mx-60 h-10 rounded"
          onClick={handleCreateLine}
        >
          Create Line
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div className="w-9/12 ml-20 py-2 px-40">
          <table className="table-fixed w-full text-center">
            <thead>
              <tr className="bg-green-200">
                <th className="p-1 border text-center w-1">Day</th>
                <th className="p-2 border text-center w-1">Start Hour</th>
                <th className="p-2 border text-center w-1">End Hour</th>
                <th className="p-2 border text-center w-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {disponibilityData.map((row) => (
                <tr key={row._id} className="even:bg-gray-100">
                  <td className="p-3 border">{dayMap(row.dayOfWeek)}</td>

                  <td className="p-1 border">
                    {row.editMode ? (
                      <TimePicker value={startTime} onChange={setStartTime} />
                    ) : (
                      row.specificHours[0].startTime
                    )}
                  </td>
                  {/* Aquí mostramos el componente DateTimePicker o el valor de la hora de fin según el valor de editMode */}
                  <td className="p-1 border">
                    {row.editMode ? (
                      <TimePicker value={endTime} onChange={setEndTime} />
                    ) : (
                      row.specificHours[0].endTime
                    )}
                  </td>
                  <td className="p-1 border">
                    {/* Aquí mostramos los botones de editar, guardar, cancelar y eliminar según el valor de editMode */}
                    {row.editMode ? (
                      <div className="flex space-x-2">
                        <button
                          className="bg-blue-600 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-sm px-5 h-11 rounded"
                          onClick={() => handleUpDate(row)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-blue-600 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-sm px-5 h-11 rounded"
                          onClick={() => handleCancelEdit(row._id)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          className="bg-blue-700 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-sm px-5 h-11 rounded"
                          onClick={() => handleEdit(row._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-blue-700 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-sm px-4 h-11 rounded"
                          onClick={() => {
                            handleDelete(row._id);
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {create && (
                <tr className="even:bg-gray-100">
                  <td className="p-1 border">
                    <SelectDay setDay={setDay} day={day} />
                  </td>

                  <td className="p-1 border">
                    <TimePicker value={startTime} onChange={setStartTime} />
                  </td>
                  {/* Aquí mostramos el componente DateTimePicker o el valor de la hora de fin según el valor de editMode */}
                  <td className="p-1 border">
                    <TimePicker value={endTime} onChange={setEndTime} />
                  </td>
                  <td className="p-1 border">
                    {/* Aquí mostramos los botones de editar, guardar, cancelar y eliminar según el valor de editMode */}

                    <div className="flex space-x-2">
                      <button
                        className="bg-blue-600 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-sm px-5 h-11 rounded"
                        onClick={() => handlePostDisponibility(true)}
                      >
                        Save
                      </button>
                      <button
                        className="bg-blue-600 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-sm px-5 h-11 rounded"
                         onClick={() => setCreate(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Availability;
