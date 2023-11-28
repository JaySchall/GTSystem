import React, { useState } from 'react';

import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Typography,
  Container,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material';

const ManageBracketForm = () => {
  const [formData, setFormData] = useState({
    bracketName: '',
    bracketStyle: 'singleElimination',
    numberOfStations: '',
    playersPerStation: '',
    numberOfRounds: '',
    playerList: '',
    thirdPlaceMatch: false,
    seeded: false,
    published: false,
    bracketStart: false,
    bracketComplete: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); 
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  return (
    <Container alignItems="flex-start" maxWidth="sm" sx={{ paddingBottom: '40px'}} >
      <form onSubmit={handleSubmit} sx={{ textAlign: 'center' }}>
        <TextField
          label="Bracket Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="bracketName"
          value={formData.bracketName}
          onChange={handleInputChange}
        />

        <FormControl variant="outlined" align="left" fullWidth margin="normal">
          <InputLabel id="bracketStyleLabel">Bracket Style</InputLabel>
          <Select
            labelId="bracketStyleLabel"
            id="bracketStyle"
            name="bracketStyle"
            value={formData.bracketStyle}
            onChange={handleInputChange}
            label="Bracket Style"
          >
            <MenuItem value="singleElimination">Single Elimination</MenuItem>
            <MenuItem value="doubleElimination">Double Elimination</MenuItem>
          </Select>
        </FormControl>

      <div>
        <TextField
          label="Number of Stations"
          variant="outlined"
          //fullWidth
          style = {{width: 200}}
          margin="normal"
          type="number"
          name="numberOfStations"
          value={formData.numberOfStations}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <TextField
          label="Players per Station"
          variant="outlined"
          //fullWidth
          style = {{width: 200}}
          margin="normal"
          type="number"
          name="playersPerStation"
          value={formData.playersPerStation}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <TextField
          label="Number of Rounds"
          variant="outlined"
          //fullWidth
          style = {{width: 200}}
          margin="normal"
          type="number"
          name="numberOfRounds"
          value={formData.numberOfRounds}
          onChange={handleInputChange}
        />
      </div>
        <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.thirdPlaceMatch}
              onChange={handleCheckboxChange}
              name="thirdPlaceMatch"
            />
          }
          label="Third Place Match"
        />
      </div>
      <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.seeded}
              onChange={handleCheckboxChange}
              name="seeded"
            />
          }
          label="Seeded"
        />
        </div>
        <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.published}
              onChange={handleCheckboxChange}
              name="published"
            />
          }
          label="Published"
        />
        </div>
        <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.bracketStart}
              onChange={handleCheckboxChange}
              name="bracketStart"
            />
          }
          label="Bracket Start"
        />
        </div>
        <div>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.bracketComplete}
              onChange={handleCheckboxChange}
              name="bracketComplete"
            />
          }
          label="Bracket Complete"
        />
        </div>

        <TextField
          label="Player List"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          name="playerList"
          value={formData.playerList}
          onChange={handleInputChange}
        />

    <form onSubmit={handleSubmit}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={8}>
            <TextField
              label="Register a New Player"
              variant="outlined"
              fullWidth
              margin="normal"
              name="newPlayer"
              value={formData.newPlayer}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" color="primary" sx={{ backgroundColor: "#3E384F" }}  type="submit">
              Register
            </Button>
          </Grid>
        </Grid>
      </form>

      <Grid container alignItems="center" spacing={1}>
          <Grid item xs={2}>
        <Button variant="contained" sx={{ backgroundColor: "#3E384F" }}  type="submit">
          Save 
        </Button>
        </Grid>
        <Grid item xs={2}>
        <Button variant="contained" sx={{ backgroundColor: "#3E384F" }} type="submit">
          Cancel
        </Button>
        </Grid>
      </Grid>
      </form>
    </Container>
  );
};

export default ManageBracketForm;
