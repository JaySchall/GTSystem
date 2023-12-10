import { useState,useEffect  } from 'react';
import EventPreview from '../components/EventPreview';
import HighlightPreview from '../components/HighlightPreview';
import GTSlider from '../components/GTSlider';
import MyDatePicker from '../components/DatePicker';

import "../css/SlickSlide.css";

export default function Home(){
  const [events, setEvents] = useState([]);
  const currentDate = new Date().toISOString();
  const filteredEvents = events.filter(event => event.startTime >= currentDate);
  filteredEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const previewEvents = filteredEvents.slice(0, 5);
  const highlights = [
    { title: 'AADL Board of Trustee applicants sought', type: 'click for more details', link: 'https://aadl.org/node/624209' },
    { title: 'Telescopes, thermal cameras, sewing machines, electric guitars,  radon detectors, WE HAVE IT ALL!', type: 'Check out the tools collection ', 
    link: 'https://aadl.org/search/catalog/*?mat_code=r&sort=popular_year' },
    // Add more events as needed
  ];



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
      <div className="l-overflow-clear ">
        <div className='helpme'>
        <div id="featured-content">
          <h1 className="light-heading">FEATURES</h1>
          <GTSlider/>
          </div>
          <div>
          <div>
    </div>
          <h1>News & Event Highlights</h1>
          <ul>
            {highlights.map((highlight, index) => (
              // Use EventPreview component for each event
              <HighlightPreview key={index} {...highlight} />
            ))}
          </ul>
          </div>
          
        </div>
      </div>
      <div className="l-overflow-clear about-services-events">
        <div className="upcoming-events-highlights">
          <h2 className="ruled-heading t-center"><span>Events</span></h2>
          <ul>
            {previewEvents.map((event) => (
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
