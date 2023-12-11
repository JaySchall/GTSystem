import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BracketInfo from "../components/bracket/BracketInfo";
import { useAuth } from "../components/AuthContext";
import AdminButtons from "../components/Admin";
import {
  MatchManagerUtil,
  BracketStartMatchManage,
} from "../utils/BracketManagerCalcs";
import { getRounds, MatchVisual } from "../components/bracket/VisualBracket";

import "../css/BracketPage.css";
import "../css/VisualBracket.css";

export default function BracketPage() {
  const { user } = useAuth();
  const { id, bid } = useParams();
  const [bracketDetails, setBracketDetails] = useState({});
  const [participantDetails, setParticipantDetails] = useState([]);
  const [bracketMatches, setBracketMatches] = useState([]);
  const [bracketRounds, setBracketRounds] = useState([]);
  const [bracketFinals, setBracketFinals] = useState([]);

  const fetchBracketDetails = async () => {
    try {
      const response = await fetch(`/api/bracket/${bid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch bracket details");
      }

      const data = await response.json();
      setBracketDetails(data);
    } catch (error) {
      console.error("Error fetching bracket details:", error.message);
    }
  };

  const fetchMatchDetails = async () => {
    try {
      const response = await fetch(`/api/matches/${bid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch match details");
      }

      const data = await response.json();
      setBracketMatches(data);
    } catch (error) {
      console.error("Error fetching match details:", error.message);
    }
  };

  const fetchParticipantInfo = async () => {
    try {
      const response = await fetch(`/api/participants/${id}/${bid}`);
      if (!response.ok) {
        throw new Error("Failed to fetch participant details");
      }

      const data = await response.json();
      setParticipantDetails(data);
    } catch (error) {
      console.error("Error fetching participant details:", error.message);
    }
  };

  useEffect(() => {
    fetchBracketDetails();
    fetchParticipantInfo();
    fetchMatchDetails();
  }, [bid]);

  const generateBracket = async () => {
    try {
      const response = await fetch("/api/generate-bracket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bracket_id: bid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate bracket");
      }

      await response.json();
      handleMatchDetails();
    } catch (error) {
      console.error("Error generating bracket:", error.message);
    }
  };

  const deleteMatchDetails = async () => {
    try {
      const response = await fetch("/api/delete-matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bid: bid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete matches");
      }

      await response.json();
      handleMatchDetails();
    } catch (error) {
      console.error("Error deleting matches:", error.message);
    }
  };

  const finishBracket = async () => {
    try {
      const response = await fetch("/api/end-bracket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bid: bid,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to end bracket");
      }

      await response.json();
      handleMatchDetails();
    } catch (error) {
      console.error("Error ending bracket:", error.message);
    }
  };

  const handleGenerateBracket = async () => {
    await generateBracket();
  };

  const handleMatchDetails = async () => {
    await fetchMatchDetails();
  };

  const handleMatchDelete = async () => {
    await deleteMatchDetails();
  };

  const handleBracketStartMatchManage = async () => {
    await BracketStartMatchManage(
      bracketMatches,
      bracketDetails.third_place_match,
      bid
    );
    await fetchBracketDetails();
    await fetchMatchDetails();
  };

  const handleEndBracket = async () => {
    await finishBracket();
    await fetchBracketDetails();
    await fetchMatchDetails();
  };

  const visualizeBracket = async () => {
    if (bracketMatches.length && Object.keys(bracketDetails).length) {
      const temp_data = MatchManagerUtil(
        bracketMatches,
        bracketDetails.third_place_match
      );
      const temp_rounds = getRounds(temp_data[0], bracketDetails);
      setBracketFinals(temp_data[1]);
      setBracketRounds(temp_rounds);
    } else {
      setBracketFinals([]);
      setBracketRounds([]);
    }
  };

  useEffect(() => {
    visualizeBracket();
  }, [bracketMatches]);

  return (
    <article>
      {user && user.isAdmin ? (
        <>
          <AdminButtons option="bracket" />
        </>
      ) : null}
      <a href={"/events/" + id} className="button">
        {"< Back"}
      </a>
      {user && user.isAdmin ? (
        <>
          {!bracketDetails.started ? (
            <>
              <button className="button" onClick={handleGenerateBracket}>
                Generate Bracket
              </button>
              {bracketMatches.length > 0 ? (
                <button
                  className="button"
                  onClick={handleBracketStartMatchManage}
                >
                  Start Bracket
                </button>
              ) : null}
              <button className="button" onClick={handleMatchDelete}>
                Delete Matches
              </button>
            </>
          ) : null}
          {bracketDetails.started && !bracketDetails.completed ? (
            <button className="button" onClick={handleEndBracket}>
              End Bracket
            </button>
          ) : null}
        </>
      ) : null}
      <div id="bracket" style={{ minHeight: 520 + "px" }}>
        {BracketInfo(bracketDetails, participantDetails)}
        <div id="bracket-view">
          {bracketDetails.started ||
          (bracketFinals.length > 0 && user && user.isAdmin) ? (
            <>
              {bracketRounds.map((round, index) => (
                <div key={index} className="round-column">
                  {index < bracketRounds.length - 1 ? (
                    <div className="round-column-title">Round {index + 1}</div>
                  ) : (
                    <div className="round-column-title">Semi-finals</div>
                  )}
                  <div className="round-column-content">
                    {round.map((match, index) => (
                      <MatchVisual
                        key={index}
                        matchDetails={match}
                        playerDetails={participantDetails}
                        bracketInfo={bracketDetails}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div className="round-column">
                <div className="round-column-title">Grand Finals</div>
                <div className="round-column-content">
                  {bracketFinals
                    .slice()
                    .reverse()
                    .map((match, index) => (
                      <MatchVisual
                        key={index}
                        matchDetails={match}
                        playerDetails={participantDetails}
                        bracketInfo={bracketDetails}
                      />
                    ))}
                </div>
              </div>
            </>
          ) : (
            <div className="unavailable">Bracket has not been started yet</div>
          )}
        </div>
      </div>
    </article>
  );
}
