import React, { useState, useEffect } from 'react';

export default function Tags() {
    const [tags, setTags] = useState([]);
  
    useEffect(() => {
      // Fetch all tags
      const fetchTags = async () => {
        try {
          const response = await fetch('/api/tags');
          if (!response.ok) {
            throw new Error('Failed to fetch tags');
          }
  
          const data = await response.json();
          setTags(data);
        } catch (error) {
          console.error('Error fetching tags:', error.message);
        }
      };
  
      fetchTags();
    }, []);
  
    return (
        <div className="upcoming-events-highlights">
        <h1>Tags Page</h1>
        <ul>
        {tags.map((tag) => (
            <li key={tag.id}>
                <a href={`/tags/${encodeURIComponent(tag.name.replace(/\s+/g, '-'))}`}>{tag.name}</a>
            </li>
            ))}
        </ul>
      </div>
    );
  }
  