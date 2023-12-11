import React, { useState, useEffect } from "react";
import EventPreview from "../components/EventPreview";

import "../css/SlickSlide.css";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentDate = new Date().toISOString();
  const filteredEvents = events.filter((event) => event.startTime >= currentDate);
  filteredEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));


  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const previewEvents = filteredEvents.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/get-events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error.message);
      }
    };

    fetchEvents();
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  return (
    <div className="l-overflow-clear about-services-events">
      <div className="upcoming-events-highlights">
        <h2>Upcoming Events</h2>
        <ul style={{ width:1200, flexDirection: "column", alignItems: "center"}}>
          {previewEvents.map((event) => (
           EventPreview(event) 
          ))}
        </ul>
        <div style={{ alignItems: "center" }}>
          <span>Pages: </span>
          {Array.from({ length: Math.ceil(filteredEvents.length / itemsPerPage) }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
              style={{ margin: "0 5px" }} >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}