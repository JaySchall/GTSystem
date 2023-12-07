import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BracketInfo from "../components/bracket/BracketInfo.js";

import "../css/BracketPage.css"
import AdminButtons from '../components/Admin.js';

export default function BracketPage(){
    const { id, bid } = useParams();
    const [bracketDetails, setBracketDetails] = useState({});

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

    return (
        <article>
            <AdminButtons option="bracket" />
            <div id="bracket" style={{ minHeight: 520 + 'px' }}>
                {BracketInfo(bracketDetails)}
                <div id="bracket-view">
                    
                </div>
            </div>
        </article>
    )
}