import { useEffect, useState } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import '../css/DatePicker.css';

library.add(faAngleLeft, faAngleRight);

const BASE_URL = 'http://localhost:3000'; // Update with your server URL

export default function MyDatePicker() {
    const [selectedDate, setSelectedDate] = useState('');
    const [events, setEvents] = useState([]);
    const [showTooltip, setShowTooltip] = useState(false);
  
    useEffect(() => {
      // Initialize Datepicker
      $("#events-calendar").datepicker({
        prevText: "<",
        nextText: ">",
        minDate: 0,
        onSelect: function (dateText, inst) {
          setSelectedDate(dateText);
  
          // Make API call to fetch events for the selected date
          fetch(`api/calendar/${dateText}`)
            .then((response) => response.json())
            .then((data) => {
              setEvents(data);
              setShowTooltip(true); // Show the tooltip with events
            })
            .catch((error) => {
              console.error('Error fetching events:', error);
            });
        },
      });
    }, []);
  
    return (
      <div style={{ position: 'relative' }}>
        <div id="events-calendar"></div>
        {showTooltip && (
          <div id='event-listing'>
            <h3>Events on {selectedDate}</h3>
            {events.map((event) => (
            
            <a href={"/events/" + event.id} key={event.id}>{event.name}</a>
            ))}
            <button onClick={() => setShowTooltip(false)}>Close</button>
          </div>
        )}
      </div>
    );
  }
