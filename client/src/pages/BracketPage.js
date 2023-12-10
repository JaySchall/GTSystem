import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BracketInfo from "../components/bracket/BracketInfo.js";

import "../css/BracketPage.css"
import AdminButtons from '../components/Admin.js';

export default function BracketPage(){
    const { id, bid } = useParams();
    const [bracketDetails, setBracketDetails] = useState({});
    const [participantDetails, setParticipantDetails] = useState([]);
    const [bracketMatches, setBracketMatches] = useState([]);

    useEffect(() => {
        const fetchBracketDetails = async () => {
          try {
            const response = await fetch(`/api/bracket/${bid}`);
            if (!response.ok) {
              throw new Error('Failed to fetch bracket details');
            }
    
            const data = await response.json();
            setBracketDetails(data);
          } catch (error) {
            console.error('Error fetching bracket details:', error.message);
          }
        };
    
        fetchBracketDetails();
    }, [id]);

    useEffect(() => {
      const fetchBracketMatches = async () => {
        try {
          const response = await fetch(`/api/matches/${bid}`);
          if (!response.ok) {
            throw new Error('Failed to fetch match details');
          }
  
          const data = await response.json();
          setBracketMatches(data);
        } catch (error) {
          console.error('Error fetching match details:', error.message);
        }
      };
  
      fetchBracketMatches();
  }, [id]);

    useEffect(() => {
      const fetchBracketDetails = async () => {
        try {
          const response = await fetch(`/api/participants/${id}/${bid}`);
          if (!response.ok) {
            throw new Error('Failed to fetch participant details');
          }
  
          const data = await response.json();
          setParticipantDetails(data);
        } catch (error) {
          console.error('Error fetching participant details:', error.message);
        }
      };
  
      fetchBracketDetails();
    }, [bid]);

    const generateBracket = async () => {
      try {
          const response = await fetch('/api/generate-bracket', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bracket_id: bid,
            }),
          });
    
          if (!response.ok) {
            throw new Error('Failed to generate bracket');
          }
    
          const returned = await response.json();
          console.log(returned);
      } catch (error) {
          console.error('Error generating bracket:', error.message);
      }
    }

    const handleGenerateBracket= async () => {
      await generateBracket();
    }
    
    return (
        <article>
            <AdminButtons option="bracket" />
            <a href={"/events/" + id} className="button">{"< Back"}</a>
            <button className="button" onClick={handleGenerateBracket}>Generate Bracket</button>
            <div id="bracket" style={{ minHeight: 520 + 'px' }}>
                {BracketInfo(bracketDetails, participantDetails)}
                <div id="bracket-view">
                    
                </div>
            </div>
        </article>
    )
}