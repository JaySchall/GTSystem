import { useNavigate } from "react-router-dom";
import CreateEventForm from "../components/forms/ManageEvent"

export function CreateEvent(){
    const navigate = useNavigate();
    const handleCreateSubmit = async (eventForm) => {
        try {
            const response = await fetch("/api/create-event", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventForm),
            });
    
            if (!response.ok) {
            throw new Error("Failed to create event");
            }
    
            const responseData = await response.json();
            navigate(`/Events/${responseData.id}`);
        } catch (error) {
            console.error("Error creating event:", error.message);
            // Handle error, show a message, etc.
        }
    }

    return (
        <div className="create-event-form">
            <h1>Create Event</h1><br />
            <CreateEventForm form_type="create" onSubmit={handleCreateSubmit} />
        </div>
    );
}

export function EditEvent(){  
    const navigate = useNavigate();  
    const handleEditSubmit = async (eventForm) => {
        try {
            const response = await fetch("/api/edit-event", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(eventForm),
            });
    
            if (!response.ok) {
            throw new Error("Failed to update event");
            }
    
            const responseData = await response.json();
            navigate(`/Events/${responseData.id}`);
        } catch (error) {
            console.error("Error creating event:", error.message);
            // Handle error, show a message, etc.
        }
    }
    return (
        <div className="create-event-form">
            <h1>Edit Event</h1><br />
            <CreateEventForm form_type="edit" onSubmit={handleEditSubmit}/>
        </div>
    );
}