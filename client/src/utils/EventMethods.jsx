import mk8d from "../img/games/mariokart8deluxe.jpg";
import ssbu from "../img/games/ssbu.jpg";
import splatoon3 from "../img/games/splatoon3.jpeg";
import gamecube from "../img/games/gamecube.png";
import unknownImage from "../img/games/meeting.png";

import "../css/EventsPreview.css"

export function ImageChooser(eventType) {
    if (eventType === "Splatoon 3") {
        return splatoon3;
    }
    else if (eventType === "Mario Kart 8 Deluxe") {
        return mk8d;
    }
    else if (eventType === "Super Smash Bros Ultimate") {
        return ssbu;
    }
    else if (eventType === "Gamecube") {
        return gamecube;
    }
    else {
        return unknownImage;
    }
}

export function PretifyDate(start, end) {
    var startDate = new Date(start);
    var endDate = new Date(end)

    const dateOptions = {
        month: "long",
        day: "numeric",
        year: "numeric",
    };
    const timeOptions = { 
        hour: "numeric", 
        minute: "numeric" 
    };


    const startDateString = startDate.toLocaleDateString(undefined, dateOptions);
    const startTimeString = startDate.toLocaleTimeString(undefined, timeOptions);
    const stopDateString = endDate.toLocaleDateString(undefined, dateOptions);
    const stopTimeString = endDate.toLocaleTimeString(undefined, timeOptions);

    if (startDate.toDateString() === endDate.toDateString()) {
        // Same day
        return `${startDateString}: ${startTimeString} to ${stopTimeString}`;
    } else {
        // Different days
        return `${startDateString}: ${startTimeString} to ${stopDateString}: ${stopTimeString}`;
    }
}
export function BracketStatus(BracketInfo) {
    if (BracketInfo.completed) {
        return "Completed";
    } else if (BracketInfo.started) {
        return "In Progress";
    } else  if (!BracketInfo.published){
        return "Unpublished";
    } else {
        return "Not Started";
    }
}

export function BracketStyle(style) {
    if (style === "singleElimination") {
        return "Single Elimination";
    } else if (style === "doubleElimination") {
        return "Double Elimination";
    } else if (style === "roundRobin") {
        return "Round Robin";
    }
}