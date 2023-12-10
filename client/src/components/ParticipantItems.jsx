import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp, faUserCheck, faUserSlash } from "@fortawesome/free-solid-svg-icons";

export function RegisteredPlayer({username, user_id, onParticipant}) {

    const handleParticipant = () => {
        onParticipant(user_id)
    };

    return (
        <div id="registrant">
            <div id="user">
                <span id="username">{username}</span>
                <span id="uid">{"(" + user_id + ")"}</span>
            </div>
            <div id="user-options">
                <button id="add-participant" className="button" onClick={() =>handleParticipant(user_id)}>
                    <FontAwesomeIcon icon={ faUserCheck } className="fa" />
                </button>
            </div>
        </div>
    )
}

export function ParticipantPlayer({username, user_id, index, onRegistrant, onUpSeed, onDownSeed}) {

    const handleRegistrant = () => {
        onRegistrant(user_id)
    };

    const handleUpSeed = () => {
        onUpSeed(user_id)
    };

    const handleDownSeed = () => {
        onDownSeed(user_id)
    };

    return (
        <div id="registrant">
            <div id="user">
                <span id="username">{index + ". " + username}</span>
                <span id="uid">{"(" + user_id + ")"}</span>
            </div>
            <div id="user-options">
                <button className="button" onClick={() => handleUpSeed(user_id)}>
                    <FontAwesomeIcon icon={ faChevronUp } className="fa" />
                </button>
                <button className="button" onClick={() => handleDownSeed(user_id)}>
                    <FontAwesomeIcon icon={ faChevronDown } className="fa" />
                </button>
                <button className="button" onClick={() => handleRegistrant(user_id)}>
                    <FontAwesomeIcon icon={ faUserSlash } className="fa" />
                </button>
            </div>
        </div>
    )
}
