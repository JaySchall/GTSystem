import React, { useState,useEffect  } from 'react';
import EventPreview from '../components/EventPreview';

export default function Home(){
    const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/get-events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error.message);
      }
    };

    fetchEvents();
  }, []); // Empty dependency array ensures the effect runs only once, similar to componentDidMount

  return (
    <div className="upcoming-events-highlights">
      <h2 className="ruled-heading t-center"><span>Events</span></h2>
      <ul>
        {events.map((event) => (
          EventPreview(event)
        ))}
      </ul>
    </div>
  );
}
