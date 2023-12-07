import ManageBracketForm from "../components/forms/ManageBracket.js";
import { useNavigate } from 'react-router-dom';
import "../css/ManageBracket.css";



export default function ManageBracket(){
    const navigate = useNavigate();
    const handleManageSubmit = async (formData, event_id, bracket_id) => {
        try {
            const response = await fetch('/api/edit-bracket', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });
      
            if (!response.ok) {
              throw new Error('Failed to create bracket');
            }
      
            await response.json();
            navigate(`/Events/${event_id}/bracket/${bracket_id}`);
         } catch (error) {
            console.error('Error creating bracket:', error.message);
        }
    }

    return (
        <div className="manage-bracket-form">
            <h1>Manage Bracket</h1><br />
            <ManageBracketForm form_type="edit" onSubmit={handleManageSubmit}/>
        </div>
    );
}