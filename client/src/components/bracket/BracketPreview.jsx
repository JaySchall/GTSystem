import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { BracketStatus, BracketStyle } from "../../utils/EventMethods";

export default function BracketPreview(BracketInfo) {
  let status = BracketStatus(BracketInfo);
  let bracketStyle = BracketStyle(BracketInfo.style);

  return (
    <li key={BracketInfo.event_id}>
      <a
        href={"/events/" + BracketInfo.event_id + "/bracket/" + BracketInfo.id}
      >
        <div className="link-icon">
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="fa" />
        </div>
        <div className="highlight-left extra-space">
          {BracketInfo.name}
          <br />
          <span className="preview-sub">Style</span>
          <br />
          <span className="preview-text no-wrap">{bracketStyle}</span>
          <br />
          <span className="preview-sub">Participants</span>
          <br />
          <span className="preview-text no-wrap">
            {BracketInfo.participants.length}
          </span>
        </div>
        <div className="highlight-right">
          <p>Status: {status}</p>
        </div>
      </a>
    </li>
  );
}
