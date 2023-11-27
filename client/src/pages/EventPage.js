import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import '../css/EventsPage.css'

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

function ImageChooser(eventType) {
  
}

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
    
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <article>
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
                <p>{/* Stylized when (<day> <month> <date>, <year>: <start time> to <stop time>) */}</p>
                { h2Helper("Where") }
                <p>{ eventDetails.location }</p>
                { h2Helper("Description") }
                <p/><p>{ eventDetails.description }</p><p/>
            </EventTabs>
            <EventTabs value={value} index={1}>

            </EventTabs>
          </div>
          <div id="record-image-metadata">
            <div>
              <img src={ ImageChooser({/* Event game */}) } alt="Graphic for events post"/>
              <p>{/* Event Game */} Tournament</p>
            </div>
            <p>
              <b>Tags</b>
              {/*For each tag create <br/><a href="/feed/tag">{tagname}</a> */}
            </p>
          </div>
        </div>
      </article>
    );
}
