import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function SeectDay({day, setDay}) { 

  const handleChange = (event) => {
    setDay(event.target.value);    
  };

  return (
    <Box >
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Day</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={day}        
          label="Day"
          onChange={handleChange}
        >
          <MenuItem value={1}>Mon</MenuItem>
          <MenuItem value={2}>Tue</MenuItem>
          <MenuItem value={3}>wed</MenuItem>
          <MenuItem value={4}>Thu</MenuItem>
          <MenuItem value={5}>Fri</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
