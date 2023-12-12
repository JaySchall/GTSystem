import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MatchManagerUtil, SetMatchScore } from "../utils/BracketManagerCalcs";
import CustomAccordion from "../components/bracket/CustomAccordion";
import MatchInput from "../components/bracket/MatchInput";
import "../css/BracketPage.css";

export default function BracketPage() {
    const { id, bid } = useParams();
    const [bracketDetails, setBracketDetails] = useState({});
    const [participantDetails, setParticipantDetails] = useState([]);
    const [bracketMatches, setBracketMatches] = useState([]);
    const [roundMatches, setRoundMatches] = useState([]);
    const [finalsMatches, setFinalsMatches] = useState([]);
    const [hasStarted, setHasStarted] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);

    // API CALL SECTION
    const fetchBracketDetails = async () => {
        try {
            const response = await fetch(`/api/bracket/${bid}`);
            if (!response.ok) {
                throw new Error("Failed to fetch bracket details");
            }

            const data = await response.json();
            setBracketDetails(data);
            setHasStarted(data.started);
            setHasFinished(data.completed);
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
            await setParticipantDetails(data);
        } catch (error) {
            console.error("Error fetching participant details:", error.message);
        }
    };

    // HANDLE CALL SECTION

    useEffect(() => {
        fetchBracketDetails();
        fetchMatchDetails();
        fetchParticipantInfo();
    }, [bid]);

    useEffect(() => {
        if (bracketMatches.length && Object.keys(bracketDetails).length) {
            const temp_matches = MatchManagerUtil(bracketMatches, 
                bracketDetails.third_place_match);
            setRoundMatches(temp_matches[0]);
            setFinalsMatches(temp_matches[1]);
        }
    }, [bracketDetails, bracketMatches])

    const handleMatchDetails = async () => {
        await fetchMatchDetails();
    };

    const handleSave = async(match, new_score) => {
        await SetMatchScore(match, new_score, bid, bracketDetails.third_place_match);
        fetchMatchDetails();
    }

    return (
        <div>
            <a href={"/events/" + id + "/bracket/" + bid} className="button">
                {"< Back"}
            </a>
            <h1>Report Results Page</h1>
            { hasStarted && !hasFinished ? (
                <>
                    {roundMatches.map((matches, index) => (
                        <CustomAccordion 
                            key={index} 
                            title={`${matches.name}${matches.is_bye ? ": BYE" : 
                                   ""}${!matches.is_bye && matches.is_done ? 
                                   ": COMPLETE" : ""} ${!matches.is_started ? 
                                   ": NOT READY" : ""}`} 
                            content={
                                <MatchInput matchDetails={matches} playerDetails={participantDetails} onSave={handleSave} />
                            } 
                            disabled={matches.is_bye || !matches.is_started}
                        />
                    ))}
                    {finalsMatches.map((matches, index) => (
                        <CustomAccordion 
                            key={index} 
                            title={`${matches.name}${matches.is_bye ? ": BYE" : 
                               ""}${!matches.is_bye && matches.is_done ? 
                               ": COMPLETE" : ""} ${!matches.is_started ? 
                               ": NOT READY" : ""}`} 
                            content={
                                <MatchInput matchDetails={matches} playerDetails={participantDetails} onSave={handleSave} />
                            } 
                            disabled={matches.is_bye || !matches.is_started}
                        />
                    ))}
                </>
            ) : !hasStarted ? (
                <>
                    <a className="button" href={"/events/" + id + "/bracket/" + bid}>{"< Back"}</a><br />
                    <span>This bracket has not started</span>
                </>
            ) : (
                <>
                    <a className="button" href={"/events/" + id + "/bracket/" + bid}>{"< Back"}</a><br />
                    <span>This bracket has concluded</span>
                </>
            )
            }
        </div>
    );

}