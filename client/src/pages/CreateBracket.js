import ManageBracketForm from "../components/forms/ManageBracket.js"
import { useNavigate } from 'react-router-dom';

export default function CreateBracket(){
    const navigate = useNavigate();
    const handleCreateSubmit = async (formData, event_id, bracket_id) => {
        formData.eventid = event_id;
        try {
            const response = await fetch('/api/create-bracket', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });
      
            if (!response.ok) {
              throw new Error('Failed to create bracket');
            }
      
            const responseData = await response.json();
            navigate(`/Events/${event_id}/bracket/${responseData.id}`);
         } catch (error) {
            console.error('Error creating event:', error.message);
        }
    }

    return (
        <div className="create-bracket-form">
            <h1>Create Bracket</h1><br />
            <ManageBracketForm form_type="create" onSubmit={handleCreateSubmit} />
        </div>
    );
}