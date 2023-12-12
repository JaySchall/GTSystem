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
    bracket: [5, 4, 8, 3, 7],
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
    0: <a key={0} href={"/events/" + id + "/edit"}>Edit</a>,
    1: <a key={1} href={"/events/" + id + "/registration"}>Registration</a>,
    2: <a key={2} href={"/events/" + id + "/new-bracket"}>Create Bracket</a>,
    3: (
      <a key={3} id="delete" href="#" onClick={handleDeleteClick}>
        Delete
      </a>
    ),
    4: (
      <a key={4} href={"/events/" + id + "/bracket/" + bid + "/registration"}>
        Registration
      </a>
    ),
    5: <a key={5} href={"/events/" + id + "/bracket/" + bid + "/edit"}>Edit</a>,
    6: (
      <ConfirmModal
        key={6}
        isOpen={isModalOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmEventDelete}
        item="event"
      />
    ),
    7: (
      <ConfirmModal
        key={7}
        isOpen={isModalOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmBracketDelete}
        item="bracket"
      />
    ),
    8: <a key={8} href={"/events/" + id + "/bracket/" + bid + "/manage"}>Manage</a>,
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
