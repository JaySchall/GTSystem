import React, { useState } from 'react';

const ManageBracketForm = () => {
  const [formData, setFormData] = useState({
    bracketName: '',
    bracketStyle: '',
    numberOfStations: '',
    playersPerStation: '',
    numberOfRounds: '',
    thirdPlaceMatch: false,
    seeded: false,
    published: false,
    bracketStart: false,
    bracketComplete: false,
    newPlayer: '',
    playerList: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Logging form data
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <strong>Bracket Name:</strong>
          <input
            type="text"
            name="bracketName"
            value={formData.bracketName}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div>
        <label>
          <strong>Bracket Style:</strong>
          <select
            name="bracketStyle"
            value={formData.bracketStyle}
            onChange={handleInputChange}
          >
            <option value="">Select Style</option>
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
            name="numberOfStations"
            value={formData.numberOfStations}
            onChange={handleInputChange}
          />
       </label>
      </div>

      <div>
        <label>
          <strong>Players Per Station:</strong>
          <input
            type="number"
            name="playersPerStation"
            value={formData.playersPerStation}
            onChange={handleInputChange}
          />
       </label>
      </div>

      <div>
        <label>
          <strong>Numbers of Rounds:</strong>
          <input
            type="number"
            name="numberOfRounds"
            value={formData.numberOfRounds}
            onChange={handleInputChange}
          />
       </label>
      </div>
        <label>
          <input
            type="checkbox"
            name="thirdPlaceMatch"
            checked={formData.thirdPlaceMatch}
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
            name="bracketStart"
            checked={formData.bracketStart}
            onChange={handleInputChange}
          />
          <strong>Bracket Start</strong>
        </label>

        <label>
          <input
            type="checkbox"
            name="bracketComplete"
            checked={formData.bracketComplete}
            onChange={handleInputChange}
          />
          <strong>Bracket Complete</strong>
        </label>

        <div>
          <label>
          <br/>
            <strong>Register a New Player:</strong>
            <input
              type="text"
              name="newPlayer"
              value={formData.newPlayer}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Register</button>
          <br/>
        </div>

        <div>
          <label>
          <br/>
            <strong>List of Players:</strong>
            <textarea
              name="playerList"
              rows={15} cols={40}
              value={formData.playerList}
              onChange={handleInputChange}
            />
          </label>
        </div>

        <div>
          <button type="submit">Save</button>
          <button type="submit">Cancel</button>
        </div>
      </form>
      <br/>
    </div>

  );
};

export default ManageBracketForm;