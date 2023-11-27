import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import EventPreview from '../components/EventPreview';

export default function TagEvents() {
    const { name } = useParams();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        // Fetch events by tag
        const fetchEventsByTag = async () => {
            try {
                const response = await fetch(`/api/events-by-tag/${name}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch events by tag');
                }

                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events by tag:', error.message);
            }
        };

        fetchEventsByTag();
    }, [name]);

    return (
        <div>
            <h1>Events with Tag: {name}</h1>
            <ul>
                {events.map((event) => (
                    <ul>
                    {events.map((event) => (
                      EventPreview(event)
                    ))}
                  </ul>
                ))}
            </ul>
        </div>
    );
}