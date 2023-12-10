import EventRegistrationForm from "../components/forms/Participants";
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import RegistrantItem from '../components/Registrant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

import "../css/Registration.css"

export default function EventRegistration(){
    const [registeredPlayers, setRegisteredPlayers] = useState([]);
    const { id } = useParams();

    const fetchEventDetails = async () => {
        try {
          const response = await fetch(`/api/registrants/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch event details');
          }
    
          const data = await response.json();
          setRegisteredPlayers(data);
          console.log(registeredPlayers);
        } catch (error) {
          console.error('Error fetching event details:', error.message);
        }
      };

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const handleDrop = async (user_id) => {
        try {
            const response = await fetch('/api/update-event-registration', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: user_id,
                action: "drop",
                value: id
              }),
            });
      
            if (!response.ok) {
              throw new Error('Failed to drop player');
            }
      
            await response.json();
            const updatedPlayers = registeredPlayers.filter(item=>item.id !== user_id)
            setRegisteredPlayers(updatedPlayers);
        } catch (error) {
            console.error('Error dropping player:', error.message);
        }
    }

    const handleCheckin = async (user_id, current_ci) => {
        try {
            const response = await fetch('/api/update-event-registration', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: user_id,
                action: "checkin",
                value: !current_ci,
                event_id: id,
              }),
            });
      
            if (!response.ok) {
              throw new Error('Failed to drop player');
            }
      
            const returned = await response.json();
            const updatedPlayers = registeredPlayers.map(item => 
                item.id === user_id ? { ...item, checked_in: Boolean(returned.value) } : item
            )
            setRegisteredPlayers(updatedPlayers);
        } catch (error) {
            console.error('Error dropping player:', error.message);
        }
    }

    function addPlayer(player) {
        setRegisteredPlayers([...registeredPlayers, player]);
    }

    return(
        <div>   
            <div id="options">
                <a className="button" href={"/events/" + id}>{"< Back"}</a>
                <a className="button" id="refresh" href="#" onClick={fetchEventDetails}>
                    <FontAwesomeIcon icon={ faRefresh } className="fa refresh" />
                    Refresh
                </a>
            </div>
            <div id="registration">
                <div id="register">
                    <EventRegistrationForm addNewPlayer={addPlayer}/>
                </div>
                <div id="check-in">
                    {registeredPlayers.length > 0 ? (
                        registeredPlayers.map((player) => (
                            <RegistrantItem username={player.name} 
                                            user_id={player.id}
                                            checked_in={player.checked_in}
                                            onDrop={handleDrop}  
                                            onCheckIn={handleCheckin} 
                            />
                        ))
                        ) : (
                        <p>No entrants yet</p>
                    )}
                </div>
            </div>
        </div>
    )
}