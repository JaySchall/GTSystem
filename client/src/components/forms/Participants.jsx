import React, { useState, useEffect, useRef, useCallback  } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

import "../../css/ManageBracket.css";


const EventRegistrationForm = (props) => {
    const { addNewPlayer } = props;
    const { id } = useParams();
    const [partialUsername, setPartialUsername] = useState("");
    const [massPlayers, setMassPlayers] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);  
    const [showSuggestions, setShowSuggestions] = useState(false); 
    const latestValueRef = useRef("");
    const inputRef = useRef(null); 
  

    const handleParticipantsChange = useCallback(
        _.debounce(async () => {
          const value = latestValueRef.current;
    
          if (value.trim() !== "") {
            const response = await fetch(`/api/usernames?partialUsername=${value}`);
            const suggestions = await response.json();
    
            if (Array.isArray(suggestions)) {
              setSuggestions(suggestions);
              setShowSuggestions(true);
            }
          }
        }, 500),
        []
      );

    const handleUserChange = (event) => {
        const value = event.target.value
        setPartialUsername(value);
        latestValueRef.current = value;
        if (selectedUser !== null) {setSelectedUser(null); }
        handleParticipantsChange.cancel();
        handleParticipantsChange(value);
    }

    const handleUserSelection = (user, event) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedUser(user);
        setPartialUsername(user.name);
        setSuggestions([]);
        setShowSuggestions(false);
    }

    const playerApiQuery = async (player) => {
        try {
            const response = await fetch("/api/register-player", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user: player,
                event_id: id
              }),
            });
      
            if (!response.ok) {
              throw new Error("Failed to register player");
            }
      
            const returned = await response.json();
            addNewPlayer(returned)
         } catch (error) {
            console.error("Error registering player:", error.message);
        }
    }

    const addPlayer = async (e) => {
        e.preventDefault();
        let newUser;
        if (selectedUser !== null) {
            newUser = selectedUser;
        } else {
            newUser = { name: partialUsername, };
        }
        playerApiQuery(newUser);
        setSelectedUser(null);
        setPartialUsername("");
    }

    const importPlayers = (e) => {
        e.preventDefault();

        const lines = massPlayers.split("\n");

        const objectList = lines.map((line) => {
          const items = line.split(",");
          if (items.length === 1) {
            return { name: items[0].trim() };
          }
          if (items.length >= 2) {
            return { name: items[0].trim(), id: items[1].trim() };
          }      
          return null;
        });
        objectList.forEach((player) => {
            if (player !== null) {playerApiQuery(player);}
        });
        setMassPlayers("");
    }

    const clearTextarea = () => {
        setMassPlayers("");
    }

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
          setShowSuggestions(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
    
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <form onSubmit={addPlayer}>
                <div className="suggestions-container">
                    <strong>Register a New Player:</strong>
                    <div className="input-container">
                        <input
                        type="text"
                        name="newPlayer"
                        value={partialUsername}
                        onChange={(event) => {
                            handleUserChange(event);
                        }}
                        onFocus={() => setShowSuggestions(true)} // Show suggestions when the input is focused
                        ref={inputRef} // Added ref to the input element
                        autoComplete="off"
                        />
                        {partialUsername && showSuggestions && (
                        <ul className="suggestions-list">
                            {suggestions.map((user) => (
                            <li
                                key={user.id}
                                className="suggestion-item"
                                onClick={(event) => handleUserSelection(user, event)}
                            >
                                {user.id + ": " + user.name}
                            </li>
                            ))}
                        </ul>
                        )}
                        {selectedUser && (
                            <div className="icon-container">
                                <FontAwesomeIcon icon={ faCircleCheck } className="fa" />
                            </div>
                        )}
                    </div>
                    <input className="button" type="submit" value="Add"></input>
                </div>
            </form>
            <form onSubmit={importPlayers}>
                <div>
                    <br />
                    <strong>Import Players (name, id):</strong>
                    <textarea
                        name="playerList"
                        rows={30} cols={40}
                        value={massPlayers}
                        onChange={(event) => {
                            setMassPlayers(event.target.value);
                        }}
                    />
                    <input className="button" type="submit" value="Import"></input>
                    <button className="button" type="button" onClick={clearTextarea}>
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
};
export default EventRegistrationForm;
