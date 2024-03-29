import { ImageChooser } from "../utils/EventMethods";
import { PretifyDate } from "../utils/EventMethods";

export default function EventPreview(eventInfo) {
  return (
    <li key={eventInfo.name}>
      <a href={"/events/" + eventInfo.id}>
        <div className="highlight-left">
          {eventInfo.name}
          <br />
          <span className="highlight-type no-wrap">
            {PretifyDate(eventInfo.startTime, eventInfo.endTime)}
          </span>
          <br />
          <span className="highlight-type no-wrap">{eventInfo.location}</span>
        </div>
        <div className="highlight-right">
          <img src={ImageChooser(eventInfo.game)} alt={eventInfo.game} />
          <p>{eventInfo.game}</p>
        </div>
      </a>
    </li>
  );
}
