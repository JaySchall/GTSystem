import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';
import { faBan } from '@fortawesome/free-solid-svg-icons';

export default function RegistrantItem({username, user_id, checked_in, onCheckIn, onDrop}) {

    const handleCheckin = () => {
        onCheckIn(user_id, checked_in)
    };

    const handleDrop = () => {
        onDrop(user_id)
    };

    return (
        <div id="registrant">
            <div id="user">
                <span id="username">{username}</span>
                <span id="uid">{"(" + user_id + ")"}</span>
            </div>
            <div id="user-options">
                <button id="checkin" className="button" onClick={handleCheckin}>
                    { checked_in ? (
                        <FontAwesomeIcon icon={ faUserSlash } className="fa unregister" />
                    ) : (
                        <FontAwesomeIcon icon={ faCalendarCheck } className="fa check-in" />
                    )
                    }
                </button>
                <button id="drop" className="button" onClick={handleDrop}>
                    <FontAwesomeIcon icon={ faBan } className="fa" />
                </button>
            </div>
        </div>
    )
}