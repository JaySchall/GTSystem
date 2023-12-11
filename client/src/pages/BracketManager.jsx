import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/BracketPage.css";

export default function BracketPage() {
    const { id, bid } = useParams();
    const [bracketDetails, setBracketDetails] = useState({});
    const [participantDetails, setParticipantDetails] = useState([]);
    const [bracketMatches, setBracketMatches] = useState([]);

    // API CALL SECTION

    useEffect(() => {
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
        fetchBracketDetails();
    }, [bid]);

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

    // HANDLE CALL SECTION

    useEffect(() => {
        fetchMatchDetails();
    }, [bid]);

    useEffect(() => {
        fetchParticipantInfo();
    }, [bid]);

    const handleMatchDetails = async () => {
        await fetchMatchDetails();
    };


    return (
        <div>

        </div>
    );

}