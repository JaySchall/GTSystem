import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { ParticipantPlayer, RegisteredPlayer } from '../components/ParticipantItems.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

import "../css/BracketRegistration.css"

export default function BracketRegistration(){
    const [playerData, setPlayerData] = useState({});
    const [registered, setRegistered] = useState([]);
    const [participants, setParticipants] = useState([]);
    const { id, bid } = useParams();

    const fetchRegistrationDetails = async () => {
        try {
          const response = await fetch(`/api/get-participants/${id}/${bid}`);
          if (!response.ok) {
            throw new Error('Failed to fetch registration details');
          }
          const data = await response.json();
          setPlayerData(data);
          if (data.participants){
            const participantsList = data.participants
            .map(participant => [participant.player_id, participant.name])
            .sort((a, b) => {
                const seedA = data.participants.find(p => p.player_id === a[0]).seed;
                const seedB = data.participants.find(p => p.player_id === b[0]).seed;
                return seedA - seedB;
            });
            setParticipants(participantsList);
          } else {
            setParticipants([]);
          }
          if (data.registered) {
            const unregisteredCheckedIn = data.registered
            .filter(obj => !data.participants.find(p => p.player_id === obj.player_id) && obj.checked_in === 1)
            .map(obj => [obj.player_id, obj.name]);
          setRegistered(unregisteredCheckedIn);
          } else {
            setRegistered([]);
          }
        } catch (error) {
          console.error('Error fetching registration details:', error.message);
        }
      };

    useEffect(() => {
        const fetchData = async () => {
          await fetchRegistrationDetails();
        };
    
        fetchData();
    }, [id, bid]);
    
    const handleSave = async() => {
      let players_list = [];
      for(let i = 0; i < participants.length; i++) {
        players_list.push({id: participants[i][0], seed:i});
      }
      try {
        const response = await fetch('/api/set-participants', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_id: id, 
            bracket_id: bid,
            players: players_list,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update participants');
        }
    } catch (error) {
        console.error('Error setting participants:', error.message);
    }
    }

    const handleRefresh = () => {
        fetchRegistrationDetails();
    };

    const handleChangeToParticipant = async (pid) => {
      const index = registered.findIndex(player => player[0] === pid);
      const player_data = registered[index];
      const newRArray = [...registered.slice(0, index), ...registered.slice(index + 1)];
      setRegistered(newRArray);
      const newPArray = [...participants, player_data];
      setParticipants(newPArray);
    }

    const handleChangeToRegistrant = async (pid) => {
      const index = participants.findIndex(player => player[0] === pid);
      const player_data = participants[index];
      const newPArray = [...participants.slice(0, index), ...participants.slice(index + 1)];
      setParticipants(newPArray);
      const newRArray = [...registered, player_data];
      setRegistered(newRArray);
    }
    const handleUpSeed = async (pid) => {
      const index = participants.findIndex(player => player[0] === pid);
      if (index > 0) {
        const newParticipants = [...participants];
        [newParticipants[index], newParticipants[index - 1]] = [newParticipants[index - 1], newParticipants[index]];
        setParticipants(newParticipants);
      }
    }

    const handleDownSeed = async (pid) => {
      const index = participants.findIndex(player => player[0] === pid);
      if (index !== -1 && index < participants.length - 1) {
        const newParticipants = [...participants];
        [newParticipants[index], newParticipants[index + 1]] = [newParticipants[index + 1], newParticipants[index]];
        setParticipants(newParticipants);
      }
    }

    const handleEnterAll = async () => {
      const newPArray = [...participants, ...registered];
      setParticipants(newPArray);
      setRegistered([]);
    }

    const handleRemoveAll = async () => {
      const newRArray = [...registered, ...participants];
      setRegistered(newRArray);
      setParticipants([]);
    }

return (
    <div>
      <div id="options">
        <a className="button" href={"/events/" + id + "/bracket/" + bid}>{"< Back"}</a>
        <div>
          <button className="button" id="refresh" onClick={handleRefresh}>
            <FontAwesomeIcon icon={faRefresh} className="fa refresh" />
            Refresh
          </button>
          <button className="button" onClick={handleSave}> 
            <FontAwesomeIcon icon={faFloppyDisk} className="fa refresh" />
            Save
          </button>
        </div>
      </div>
      <div id="registered-players">
        <div id="registered-users">
          {registered.length > 0 ? (
            registered.map((player) => (
              <RegisteredPlayer
                key={player[0]}
                username={player[1]}
                user_id={player[0]}
                onParticipant={handleChangeToParticipant}
              />
            ))
          ) : (
            <span>No players checked-in yet</span>
          )}
        </div>
        <div id="participant-players">
          {participants.length > 0 ? (
            participants.map((player, idx) => (
              <ParticipantPlayer
                key={player[0]}
                username={player[1]}
                user_id={player[0]}
                index={idx+=1}
                onRegistrant={handleChangeToRegistrant}
                onUpSeed={handleUpSeed}
                onDownSeed={handleDownSeed}
              />
            ))
          ) : (
            <span>No participants yet</span>
          )}
        </div>
      </div>
      <div id="big-user-actions">
        <button className="button" onClick={handleEnterAll}>
          Enter All
        </button>
        <button className="button" onClick={handleRemoveAll}>
          Remove All
        </button>
      </div>
    </div>
  );  
}