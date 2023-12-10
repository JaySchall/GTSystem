import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { ImageChooser } from '../utils/EventMethods';
import { PretifyDate } from '../utils/EventMethods';

import BracketPreview from '../components/bracket/BracketPreview'
import AdminButtons from '../components/Admin'
import '../css/EventsPage.css';
import '../css/EventsPreview.css'

function EventTabs(props) {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value!== index}
        id={`simple-tabbedpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index ? children : null}
      </div>
    );
}

EventTabs.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function PropsHelper(index) {
    return {
      id: `simple-tab-${index} event-tab-button`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

function h2Helper(title) {
    return (
      <h2 className="no-margin">{title}</h2>
    )
}

export default function EventPage(){
    const { id } = useParams();
    const [eventDetails, setEventDetails] = useState({});
    const [bracketDetails, setBracketDetails] = useState([]);
    const [value, setValue] = React.useState(0);

    useEffect(() => {
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
    }, [id]);

    useEffect(() => {
      const fetchBrackets = async () => {
        try {
          const response = await fetch(`/api/event/${id}/bracket`);
          if (!response.ok) {
            throw new Error('Failed to fetch events');
          }
  
          const data = await response.json();
          setBracketDetails(data);
        } catch (error) {
          console.error('Error fetching events:', error.message);
        }
      };
  
      fetchBrackets();
    }, [id]);
    

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };


    return (
      <article>
        <AdminButtons option="event" />
        <div id="record" style={{ minHeight: 520 + 'px' }}>
          <div id="record-info" className="node-body">
            <Tabs value={value} 
              onChange={handleChange} 
              aria-label="Gaming event tabs"
              >
              <Tab label="Event" {...PropsHelper(0)} />
              <Tab label="Brackets" {...PropsHelper(1)} />
            </Tabs>
            <EventTabs value={value} index={0}>
                <h1 className="no-margin">{ eventDetails.name }</h1>
                { h2Helper("When") }
                <p>{PretifyDate(eventDetails.startTime, eventDetails.endTime)}</p>
                { h2Helper("Where") }
                <p>{ eventDetails.location }</p>
                { h2Helper("Description") }
                <p/>
                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(eventDetails.description) }} />
                <p/>
            </EventTabs>
            <EventTabs className="bracket-list" value={value} index={1}>
                <ul>
                  {bracketDetails.map((brackets) => (
                      brackets.published ? (BracketPreview(brackets)) : (null)
                  ))}
                </ul>
            </EventTabs>
          </div>
          <div id="record-image-metadata">
            <div>
              <img src={ ImageChooser(eventDetails.game) } alt="Graphic for events post"/>
              <p>{ eventDetails.game } Tournament</p>
            </div>
            <p>
              <b>Tags</b>
              {eventDetails.tags && eventDetails.tags.split(',').map((tag, index) => (
              <React.Fragment key={index}>
                <br />
                <a href={`/tags/${encodeURIComponent(tag.replace(/\s+/g, '-'))}`}>{tag}</a>
              </React.Fragment>
              ))}
            </p>
          </div>
        </div>
      </article>
    );
}
