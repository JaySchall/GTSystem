import { useParams } from 'react-router-dom';

import '../css/Admin.css'

export default function AdminButtons(props){
    const { id, bid=null } = useParams();
    const { option } = props;

    const options = {
        "event": [0,1,2,3],
        "bracket": [5,4,3],
    };
    
    const handleDelete = (event) => {
        return;
      }

    const buttons = {
        0: <a href={"/events/" + id + "/edit"}>Edit</a>,
        1: <a href={"/events/" + id + "/registration"}>Registration</a>,
        2: <a href={"/events/" + id + "/new-bracket"}>Create Bracket</a>,
        3: <a id="delete" href={handleDelete}>Delete</a>,
        4: <a href={"/events/" + id + "/bracket/" + bid + "/registration"}>Registration</a>,
        5: <a href={"/events/" + id + "/bracket/" + bid + "/edit"}>Edit</a>
    };

    return (
        <div id="admin-event-controls">
            {options[option].map((buttonId) => (
                buttons[buttonId]
            ))}
        </div>
    )
};