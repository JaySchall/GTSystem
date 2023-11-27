import { useState,useEffect  } from 'react';
import EventPreview from '../components/EventPreview';
import GTSlider from '../components/GTSlider';

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
    <main id="main-content" className="outer-wrapper l-overflow-clear" role="main">
      <div className="l-overflow-clear">
        <GTSlider/>
      </div>
      <div className="l-overflow-clear">
        <div className="upcoming-events-highlights">
          <h2 className="ruled-heading t-center"><span>Events</span></h2>
          <ul>
            {events.map((event) => (
              EventPreview(event)
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
