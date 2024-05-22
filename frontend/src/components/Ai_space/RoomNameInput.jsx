import React, { useState, useEffect } from 'react';
import { SquarePen, Trash2, XCircle,CircleCheckBig } from 'lucide-react';

const RoomNameInput = ({ roomName, onEdit, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newRoomName, setNewRoomName] = useState(roomName);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onSave(newRoomName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewRoomName(roomName);
    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      handleCancel();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isEditing) {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isEditing]);

  return (
    <div className="flex items-center">
      <div className="text-lg capitalize font-semibold text-zinc-900">
        {isEditing ? (
          <div className="flex items-center">
            <input
              type="text"
              value={newRoomName}
              onChange={(event) => setNewRoomName(event.target.value)}
              onKeyDown={handleKeyDown}
              className="text-gray-800 font-medium bg-white w-28"
            />
            <button onClick={handleSave} className="ml-2">
            <CircleCheckBig size={16}/>
            </button>
            <button onClick={handleCancel} className=" ml-2">
              <XCircle size={16} />
            </button>
          </div>
        ) : (
          <span>{roomName}</span>
        )}
      </div>
      {!isEditing && (
        <div className="flex ml-5">
          <button onClick={handleEdit}>
            <SquarePen size={16} color="#000000" strokeWidth={2.5} />
          </button>
          <button onClick={() => onDelete(roomName)} className="ml-2">
            <Trash2 size={16} color="#d10000" strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomNameInput;