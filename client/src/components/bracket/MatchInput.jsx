import React, { useState, useEffect } from "react";

export default function MatchInput({ matchDetails, playerDetails, onSave }) {
    const initialResults = Array(matchDetails.players.length).fill(0);
    const [matchResults, setMatchResults] = useState(initialResults);

    useEffect(() => {
        if (matchDetails.scores.length > 0) {
            setMatchResults(matchDetails.scores);
        } else {
            setMatchResults(initialResults);
        }
    }, [matchDetails.scores]);

    const handleChange = (e) => {
        const temp_arr = [...matchResults];
        const index = e.target.dataset.index;
        temp_arr[index] = e.target.value;
        setMatchResults(temp_arr);
    };

    const handleSave = (e) => {
        e.preventDefault();
        onSave(matchDetails, matchResults);
    };

    return (
        <div>
            <form onSubmit={handleSave}>
                {matchDetails.is_bye ? (
                    <>
                        <span>BYE</span>
                    </>
                ) : (
                    <>
                        {matchDetails.players.map((pid, index) => (
                            <div key={index}>
                                <label htmlFor={pid}>{playerDetails.find(player => player.player_id === pid)?.name}</label>
                                <input
                                    id={pid}
                                    type="number"
                                    value={matchResults[index]}
                                    onChange={handleChange}
                                    disabled={matchDetails.is_done}
                                    data-index={index}
                                />
                            </div>
                        ))}
                        {!matchDetails.is_done ? (
                            <input className="button" type="submit" value="Complete" disabled={matchDetails.is_done} />
                            ) : (null)
                        }
                    </>
                )}
            </form>
        </div>
    );
}
