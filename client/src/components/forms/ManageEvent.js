import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const whereOptionsList = [
    "265 Parkland Plaza",
    "Downtown Library: 1st Floor Lobby",
    "Downtown Library: 2nd Floor Exhibit",
    "Downtown Library: 2nd Floor Open Area",
    "Downtown Library: 3rd Floor Conference Room",
    "Downtown Library: 3rd Floor Exhibit",
    "Downtown Library: 3rd Floor Open Area",
    "Downtown Library: 4th Floor Atrium",
    "Downtown Library: 4th Floor Meeting Room",
    "Downtown Library: 4th Floor Studio",
    "Downtown Library: aadlfreespace",
    "Downtown Library: by Library Lane",
    "Downtown Library: Conference Room A",
    "Downtown Library: Conference Room C",
    "Downtown Library: Lamplighter Room",
    "Downtown Library: Lower Level Display Cases",
    "Downtown Library: Multi-Purpose Room",
    "Downtown Library: Multi-Purpose Room Exhibit",
    "Downtown Library: Secret Lab",
    "Downtown Library: Training Center",
    "Downtown Library: Secret Lab Annex",
    "Downtown Library: Whiffletree Room",
    "Downtown Library: Youth Story Corner",
    "Downtown Library: Youth Wall Exhibit",
    "Malletts Creek Branch: Exhibits",
    "Malletts Creek Branch: Program Room",
    "Malletts Creek Branch: Rain Garden Room",
    "Malletts Creek Branch: River Birch Room",
    "Malletts Creek Branch: Training Center",
    "Offsite Location",
    "Pittsfield Branch: Program Room",
    "Pittsfield Branch: Training Center",
    "Traverwood Branch: Program Room",
    "Traverwood Branch: Training Center",
    "Westgate Branch: Courtyard",
    "Westgate Branch: Kids Area",
    "Westgate Branch: Lobby",
    "Westgate Branch: Meeting Room A",
    "Westgate Branch: Meeting Room B",
    "Westgate Branch: West Side Room"
];

const CreateEventForm = (props) => {
  const navigate = useNavigate();
  const { form_type, onSubmit } = props;
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [whereOptions, setWhereOptions] = useState(
    whereOptionsList.reduce((options, option) => {
        options[option] = false;
        return options;
    }, {})
  );
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [game, setGame] = useState('');
  const [tags, setTags] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    var trueLocations = Object.keys(whereOptions).filter(function(key) {
      return whereOptions[key] === true;
    });
    var locations = trueLocations.join(', ');
    var startDate = new Date(startTime);
    var endDate = new Date(endTime);

    const eventForm = {
      name: title,
      location: locations,
      startTime: startDate.toISOString(), 
      endTime: endDate.toISOString(), 
      description: description, 
      game: game,
      tags: tags.split(",").map(item => item.trim()),
      ...(id !== undefined && { id: id }),
    }
    onSubmit(eventForm)
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/event/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setDescription(data.description);
        setEndTime(data.endTime.slice(0, 16));
        setGame(data.game);
        setTitle(data.name);
        setStartTime(data.startTime.slice(0, 16));
        setTags(data.tags);
        const temp_loc = data.location.split(", ").map(element => element.trim());
        setWhereOptions(prevOptions => {
          const updatedOptions = { ...prevOptions };
          temp_loc.forEach(element => {
            updatedOptions[element] = true;
          });
          return updatedOptions;
        });
      } catch (error) {
        console.error('Error fetching event details:', error.message);
      }
    };
    if (form_type === 'edit' && id) {
      fetchData();
    }
  }, [form_type, id]);

  const handleCancel = () =>{
    navigate(`/events/${id}`);
  };

  const handleWhereOptionChange = (option) => {
    setWhereOptions({
      ...whereOptions,
      [option]: !whereOptions[option],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      {/* Description */}
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

    {/* Where */}
    <label>
        Where:
        <div>
            {whereOptionsList.map((option) => (
                <label key={option}>
                <input
                    type="checkbox"
                    checked={whereOptions[option]}
                    onChange={() => handleWhereOptionChange(option)}
                />
                {option}
                </label>
            ))}
        </div>
        {/* Repeat the above block for other options */}
      </label>
      
      {/* Start Time */}
      <label>
        Start Time:
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label>

      {/* End Time */}
      <label>
        End Time:
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </label>

      {/* Game */}
      <label>
        Game:
        <select value={game} onChange={(e) => setGame(e.target.value)}>
          <option value="" disabled>Select a game</option>
          <option value="Splatoon 3">Splatoon 3</option>
          <option value="Super Smash Bros Ultimate">Super Smash Bros Ultimate</option>
          <option value="Mario Kart 8 Deluxe">Mario Kart 8 Deluxe</option>
          <option value="Gamecube">Gamecube</option>
        </select>
      </label>

      {/* Tags */}
      <label>
        Tags (comma-separated):
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </label>

      {/* Submit Button */}
      <button className="button" type="submit">Submit</button>
      <button className="button" type="button" onClick={handleCancel}>Cancel</button>
      <br/>
    </form>
  );
};

export default CreateEventForm;