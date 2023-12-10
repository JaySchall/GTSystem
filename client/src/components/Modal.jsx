import "../css/Modal.css"

export default function ConfirmModal ({ isOpen, onCancel, onConfirm, item })  {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal">
                <p className="message">Are you sure you want to delete this {item}?</p>
                <div className="button-row">
                    <button id="no" onClick={onCancel}>No</button>
                    <button id="yes" onClick={onConfirm}>Yes</button>
                </div>
            </div>
        </div>
    )
}