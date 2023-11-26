import React, { useState } from 'react';

export default function Form(){
    const [formData, setFormData] = useState({
        name: '',
        dateStoredInSeconds: '',
        location: '',
        description: '',
      });
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await fetch('/api/create-event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          if (!response.ok) {
            throw new Error('Failed to create event');
          }
    
          const responseData = await response.json();
          console.log(responseData);
          // Handle success or redirect to another page
        } catch (error) {
          console.error('Error creating event:', error.message);
          // Handle error, show a message, etc.
        }
      };
    
      return (
        <div>
          <h1>Create Event</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            </label>
            <br />
            <label>
              Date (in seconds):
              <input
                type="number"
                name="dateStoredInSeconds"
                value={formData.dateStoredInSeconds}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Location:
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} />
            </label>
            <br />
            <label>
              Description:
              <textarea name="description" value={formData.description} onChange={handleInputChange} />
            </label>
            <br />
            <button type="submit">Create Event</button>
          </form>
        </div>
      );
}