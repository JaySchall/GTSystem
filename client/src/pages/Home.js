import { useState,useEffect  } from 'react';
import EventPreview from '../components/EventPreview';
import GTSlider from '../components/GTSlider';
import MyDatePicker from '../components/DatePicker';

import "../css/SlickSlide.css";

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
        <div id="featured-content">
          <h1 className="light-heading">FEATURES</h1>
          <GTSlider/>
        </div>
      </div>
      <div className="l-overflow-clear about-services-events">
        <div className="upcoming-events-highlights">
          <h2 className="ruled-heading t-center"><span>Events</span></h2>
          <ul>
            {events.map((event) => (
              EventPreview(event)
            ))}
          </ul>
        </div>
        <div id="calendar">
          <h2 className="ruled-heading t-center">Calendar</h2>
          <MyDatePicker />
        </div>
      </div>
    </main>
  );
}
