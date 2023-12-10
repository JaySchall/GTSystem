import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ManageBracketForm = (props) => {
  const { id, bid=null } = useParams();
  const { form_type, onSubmit } = props;
  const [formData, setFormData] = useState({
    name: "",
    style: "",
    total_stations: "0",
    players_per_station: "0",
    rounds: "0",
    players_move_on: "0",
    third_place_match: false,
    seeded: false,
    published: false,
    started: false,
    completed: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/bracket/${bid}`);
        if (!response.ok) {
          throw new Error("Failed to fetch bracket details");
        }

        const data = await response.json();
        setFormData({...data});
      } catch (error) {
        console.error("Error fetching bracket details:", error.message);
      }
    };

    if (form_type === "edit" && bid) {
      fetchData();
    }
  }, [form_type, bid]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, id, bid);
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <strong>Bracket Name:</strong>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div>
        <label>
          <strong>Bracket Style:</strong>
          <select
            name="style"
            value={formData.style}
            onChange={handleInputChange}
          >
            <option value="" disabled>Select Style</option>
            <option value="singleElimination">Single Elimination</option>
            <option value="doubleElimination">Double Elimination</option>
            <option value="roundRobin">Round Robin</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          <strong>Number of Stations:</strong>
          <input
            type="number"
            name="total_stations"
            value={formData.total_stations}
            onChange={handleInputChange}
          />
       </label>
      </div>

      <div>
        <label>
          <strong>Players Per Station:</strong>
          <input
            type="number"
            name="players_per_station"
            value={formData.players_per_station}
            onChange={handleInputChange}
          />
       </label>
      </div>

      <div>
        <label>
          <strong>Players Move On:</strong>
          <input
            type="number"
            name="players_move_on"
            value={formData.players_move_on}
            onChange={handleInputChange}
          />
       </label>
      </div>

      <div>
        <label>
          <strong>Numbers of Rounds:</strong>
          <input
            type="number"
            name="rounds"
            value={formData.rounds}
            onChange={handleInputChange}
          />
       </label>
      </div>
        <label>
          <input
            type="checkbox"
            name="third_place_match"
            checked={formData.third_place_match}
            onChange={handleInputChange}
          />
          <strong>Third Place Match</strong>
        </label>

        <label>
          <input
            type="checkbox"
            name="seeded"
            checked={formData.seeded}
            onChange={handleInputChange}
          />
          <strong>Seeded</strong>
        </label>

        <label>
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleInputChange}
          />
          <strong>Published</strong>
        </label>

        <label>
          <input
            type="checkbox"
            name="started"
            checked={formData.started}
            onChange={handleInputChange}
          />
          <strong>Start Bracket</strong>
        </label>

        <label>
          <input
            type="checkbox"
            name="completed"
            checked={formData.completed}
            onChange={handleInputChange}
          />
          <strong>Mark As Done</strong>
        </label>

        <div>
          <button className="button" type="submit">Save</button>
          <button className="button" type="submit">Cancel</button>
        </div>
      </form>
      <br/>
    </div>

  );
};

export default ManageBracketForm;
