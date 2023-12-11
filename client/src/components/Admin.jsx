import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ConfirmModal from "./Modal.jsx";
import { useAuth } from "./AuthContext.jsx";

import "../css/Admin.css";

export default function AdminButtons(props) {
  const { user } = useAuth();
  const { id, bid = null } = useParams();
  const { option } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const options = {
    event: [0, 1, 2, 3, 6],
    bracket: [5, 4, 3, 7],
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmEventDelete = async () => {
    try {
      const response = await fetch("/api/delete-event/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      await response.json();
      navigate(`/`);
    } catch (error) {
      console.error("Error deleting event event:", error.message);
    }
    setIsModalOpen(false);
  };

  const handleConfirmBracketDelete = async () => {
    try {
      const response = await fetch("/api/delete-bracket/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bid: bid }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete bracket");
      }

      await response.json();
      navigate(`/`);
    } catch (error) {
      console.error("Error deleting bracket event:", error.message);
    }
    setIsModalOpen(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  const buttons = {
    0: <a href={"/events/" + id + "/edit"}>Edit</a>,
    1: <a href={"/events/" + id + "/registration"}>Registration</a>,
    2: <a href={"/events/" + id + "/new-bracket"}>Create Bracket</a>,
    3: (
      <a id="delete" href="#" onClick={handleDeleteClick}>
        Delete
      </a>
    ),
    4: (
      <a href={"/events/" + id + "/bracket/" + bid + "/registration"}>
        Registration
      </a>
    ),
    5: <a href={"/events/" + id + "/bracket/" + bid + "/edit"}>Edit</a>,
    6: (
      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmEventDelete}
        item="event"
      />
    ),
    7: (
      <ConfirmModal
        isOpen={isModalOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmBracketDelete}
        item="bracket"
      />
    ),
  };

  return (
    <>
      {user && user.isAdmin ? (
        <div id="admin-event-controls">
          {options[option].map((buttonId) => buttons[buttonId])}
        </div>
      ) : null}
    </>
  );
}
