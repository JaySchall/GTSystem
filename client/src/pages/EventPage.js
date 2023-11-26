import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
export default function EventPage(){
    const { id } = useParams();
    const [eventDetails, setEventDetails] = useState({});
    useEffect(() => {
        // Fetch event details based on the id parameter
        const fetchEventDetails = async () => {
          try {
            const response = await fetch(`/api/event/${id}`);
            if (!response.ok) {
              throw new Error('Failed to fetch event details');
            }
    
            const data = await response.json();
            setEventDetails(data);
          } catch (error) {
            console.error('Error fetching event details:', error.message);
          }
        };
    
        fetchEventDetails();
      }, [id]); // Re-fetch when the id parameter changes
    
      return (
        <div>
          <h2>Event Details</h2>
          <p>ID: {id}</p>
          <p>Name: {eventDetails.name}</p>
          {/* Display other event details */}
        </div>
      );
    }
    
    //export default EventDetails;