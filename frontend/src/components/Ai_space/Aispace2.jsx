import React, { useState } from 'react';
import './Aispace.css';
import { toast } from 'react-toastify';

export default function Aispace2({ onAddRoom }) {
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddRoom = async () => {
    setLoading(true);
    setError('');
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:5000/api/v1/user/rooms/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomName }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        onAddRoom(); // Call the prop function to switch to Aispace3
        toast.success('Room added')
      } else {
        setError('Failed to add room');
        toast.error('Failed to add room');
      }
    } catch (error) {
      setError('Failed to add room');
      console.error('Failed to add room:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main rounded-xl">
      <div className="Frame22 h-36 flex-col justify-start items-center gap-9 inline-flex -mt-16">
        <div className="heading text-4xl text-center font-normal font-['moonhouse'] uppercase tracking-widest max-md:text-xl">
          Enter Name for your space
        </div>
        <div className="Input flex-col justify-center items-center gap-2 flex">
          <input
            className="roomname px-7 py-3 bg-white rounded-3xl justify-center items-center text-stone-950 text-center text-xl font-medium tracking-wide capitalize max-sm:px-0 max-sm:py-2 max-sm:text-sm"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            disabled={loading}
          />
        </div>
        {error && <div className="error text-red-500">{error}</div>}
        <button
          className="AddBtn w-[4.5rem] h-[4.5rem] p-1 justify-center items-center inline-flex max-md:w-[3rem] max-md:h-[3rem]"
          onClick={handleAddRoom}
          disabled={loading}
        >
          {loading ? (
            <div className="spinner">Loading...</div>
          ) : (
            <img src="/aispace/Plus.svg" alt="click to add" />
          )}
        </button>
      </div>
    </div>
  );
}
