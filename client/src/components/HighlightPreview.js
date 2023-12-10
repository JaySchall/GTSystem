import React from 'react';
const EventPreview = ({ title, type, link }) =>
    {
    return (
        <li className='highlights'>
          <a href={link}>
            <h2>{title}</h2>
            <p>{type}</p>
          </a>
        </li>
      );
    };
    export default EventPreview;