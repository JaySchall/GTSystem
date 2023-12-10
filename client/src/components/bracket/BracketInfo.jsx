import { BracketStyle } from "../../utils/EventMethods";

export default function BracketInfo(BracketInfo, Participants = []){
    return(
      <div id="bracket-info"> 
        <h1>{BracketInfo.name}</h1>
        <h2 className="no-margin">Style</h2>
        <p>{BracketStyle(BracketInfo.style)}</p>
        <h2 className="no-margin">Participants</h2>
        <div className="participants-container">
          {Participants.length > 0 ? (
            <ol>
              {Participants.map((player) => (
                <li key={player.player_id}>{player.name}</li>
              ))}
            </ol>
          ) : (
            <p>No entrants yet</p>
          )}
        </div>
      </div>
    );
}