
import React, { useState, useCallback, useRef } from 'react';
import _ from 'lodash';

const ManageBracketForm = () => {
    const [partialUsername, setPartialUsername] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const latestValueRef = useRef('');

    const handleParticipantsChange = useCallback(
        async (event) => {
        const value = event.target.value;
        setPartialUsername(value);
        latestValueRef.current = value; 

        setTimeout(async () => {
            if (value.trim() !== '' && value === latestValueRef.current) {
            const response = await fetch(`/api/usernames?partialUsername=${value}`);
            const suggestions = await response.json();
            if (!Array.isArray(suggestions)) {
                return;
            }
            setSuggestions(suggestions);
            }
        }, 500);
    }, []);

    const handleUserSelection = (user) => {
        setSelectedUser(user);
        setPartialUsername(user.name);
    }

    const addPlayer = (e) => {
        e.preventDefault();
        if (selectedUser === null) {
        setSelectedUser({
            name: e.newPlayer,
        })
        }
        formData.playerList.push(selectedUser);
        setSelectedUser(null);
    }

    return (
        <div>
            <div className="suggestions-container">
                <strong>Register a New Player:</strong>
                <div className="input-container">
                    <input
                        type="text"
                        name="newPlayer"
                        value={partialUsername}
                        onChange={(event) => {
                        setPartialUsername(event.target.value);
                        handleParticipantsChange(event);
                        }}
                    />
                    {partialUsername && suggestions.length > 0 && (
                        <ul className="suggestions-list">
                        {suggestions.map((user) => (
                            <li
                            key={user.id}
                            className="suggestion-item"
                            onClick={() => handleUserSelection(user)}
                            >
                            {user.id + ": " + user.name}
                            </li>
                        ))}
                        </ul>
                    )}
                </div>
                <button type="submit" onSubmit={addPlayer}>
                    Register
                </button>
            </div>

            <div>
                <label>
                    <br/>
                    <strong>List of Players:</strong>
                    <textarea
                        name="playerList"
                        rows={15} cols={40}
                        value={formData.playerList}
                        onChange={handleInputChange}
                    />
                </label>
            </div>
        </div>
    );
};
export default ManageBracketForm;
