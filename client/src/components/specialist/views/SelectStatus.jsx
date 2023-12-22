import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { useSelector } from "react-redux";


export default function SelectStatus({ id, getAppointment, setData}) {
  const [selectStatus, setSelectStatus] = useState(); // Eliminé el estado inicial status


  const { userInfo } = useSelector((state) => state.auth);

  //axios put status
  const putStatus = async (newStatus) => {
    try {
      const response = await axios.put(
        `/api/appointments/${id}`,
        { status: newStatus },
        {
          headers: {
            Cookie: `jwt=${userInfo.token}`,
          },
        }
      );
      console.log(response.status);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleChange = async (event) => {    
    if (event) {
      const newStatus = event.target.value;
      setSelectStatus("");
      await putStatus(newStatus);
      const data = await getAppointment();
      setData(data); 
    }
  };

  useEffect(() => {
    // Eliminé la actualización de selectStatus cuando cambia el prop status
  }, []); // No hay dependencias, por lo que solo se ejecutará una vez al montar el componente

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" >Status</InputLabel>
        <Select
      className="px-4"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectStatus}
          label="Status"
          onChange={(e) => handleChange(e)}
        >
          <MenuItem selected value={""}>Select</MenuItem>
          <MenuItem value={"confirmed"}>confirmed</MenuItem>
          <MenuItem value={"canceled"}>canceled</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}