import { useEffect, useState } from 'react';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleLeft, faAngleRight, faTimes} from '@fortawesome/free-solid-svg-icons';

import '../css/DatePicker.css';

library.add(faAngleLeft, faAngleRight);

const BASE_URL = 'http://localhost:3000'; // Update with your server URL

export default function MyDatePicker() {
    const [selectedDate, setSelectedDate] = useState('');
    const [events, setEvents] = useState([]);
    const [showTooltip, setShowTooltip] = useState(false);
  
    function convertDate(inputDate) {
      const dateObject = new Date(inputDate);
    
      if (isNaN(dateObject.getTime())) {
          return "Invalid date";
      }
    
      const options = { month: 'long', day: 'numeric' };
      const formattedDate = dateObject.toLocaleDateString('en-US', options);
    
      return formattedDate;
    }
    
    function getAbbreviation(inputString) {
      // Split the input string into words
      const words = inputString.split(' ');
  
      // Check if there are at least two words
      if (words.length >= 2) {
          // Combine the first two words
          const firstTwoWords = `${words[0]} ${words[1]}`;
  
          // Check the patterns
          switch (firstTwoWords) {
              case "Downtown Library:":
                  return "DT";
              case "Pittsfield Branch:":
                  return "PF";
              case "Westgate Branch:":
                  return "WG";
              case "Malletts Creek":
                  return "MC";
              case "Traverwood Branch:":
                  return "TW";
              case "265 Parkland":
                  return "PL";
              default:
                  return "Unknown";
          }
      } else {
          return "Unknown";
      }
    }

    function formatTime(isoDateString) {
      const date = new Date(isoDateString);
  
      if (isNaN(date.getTime())) {
          return "Invalid date";
      }
  
      const hours = date.getHours();
      const minutes = date.getMinutes();
  
      if (minutes === 0) {
          const amPm = hours >= 12 ? 'pm' : 'am';
          const formattedTime = `${hours % 12 || 12}${amPm}`;
          return formattedTime;
      } else {
          const amPm = hours >= 12 ? 'pm' : 'am';
          const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes}${amPm}`;
          return formattedTime;
      }
    }

    useEffect(() => {
      // Initialize Datepicker
      $("#events-calendar").datepicker({
        prevText: "<",
        nextText: ">",
        minDate: 0,
        onSelect: function (dateText, inst) {
          setSelectedDate(convertDate(dateText));
  
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
        
        {showTooltip && (
          <div id='event-listing' style={{display:"block"}}>
          <FontAwesomeIcon icon={ faTimes } onClick={() => setShowTooltip(false)} className="fa" id="events-listing-close" />
            {events.length > 0 ? (
              <>
                <p>{"— " + selectedDate + " —"}</p>
                {events.map((event) => (
                
                <a href={"/events/" + event.id} key={event.id}>
                  { formatTime(event.startTime) + " @ " + getAbbreviation(event.location) 
                  + " "}
                  <span className="underline">{event.name}</span>
                </a>
                ))}
              </>
            ):(
              <a href="">No events found</a>
            )}
          </div>
        )}
        <div id="events-calendar"></div>
      </div>
    );
  }
