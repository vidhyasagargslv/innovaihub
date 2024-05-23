import React, { useState, useEffect } from 'react';
import './Aispace.css';
import Aispace4 from './Aispace4';
import { toast } from 'react-toastify';
import RoomNameInput from './RoomNameInput';
import {Plus, Trash2} from 'lucide-react';


export default function Aispace3({ toolsUpdated: toolsUpdatedProp,onAddRoom }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [roomProducts, setRoomProducts] = useState({});
  const [toolsUpdated, setToolsUpdated] = useState(false); 
  const [editingRooms, setEditingRooms] = useState({});

  const buttonClasses = [
    'btn-neutral',
    'btn-primary',
    'btn-secondary',
    'btn-accent',
    'btn-info',
    'btn-success',
    'btn-warning',
    'btn-error',
    'btn-ghost'
  ];

  useEffect(() => {
    console.log("object");
    const userId = localStorage.getItem('userId');
    fetch(`http://localhost:5000/api/v1/user/rooms/${userId}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.rooms) {
          setRooms(data.rooms);
          console.log(data.rooms);
        } else {
          console.log('No rooms found');
        }
      })
      .catch(error => {
        console.log('Fetch error:', error);
      });
  }, [toolsUpdated]);

  useEffect(() => {
    const fetchProductNames = async () => {
      const productIds = Object.values(rooms).reduce((acc, room) => {
        if (room.products) {
          acc.push(...room.products);
        }
        return acc;
      }, []);
  
      const productDetails = await Promise.all(
        productIds.map(async (productId) => {
          try {
            const response = await fetch(`https://vidhyasagargslv.pythonanywhere.com/api/mainai/${productId}`);
            if (response.ok) {
              const product = await response.json();
              return { [productId]: { title: product.Title, link: product.link } };
            } else {
              console.error(`Failed to fetch product with ID ${productId}`);
              return null;
            }
          } catch (error) {
            console.error('Error fetching product:', error);
            return null;
          }
        })
      );
  
      setRoomProducts((prevProducts) => ({
        ...prevProducts,
        ...Object.assign({}, ...productDetails.filter((product) => product !== null)),
      }));
    };
  
    fetchProductNames();
  }, [rooms]);
  


  const handleAddProductToRoom = async (productId) => {
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`http://localhost:5000/api/v1/user/rooms/${userId}/addProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, roomName: selectedRoom }),
      });

      if (response.ok) {
        const userId = localStorage.getItem('userId');
    fetch(`http://localhost:5000/api/v1/user/rooms/${userId}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.rooms) {
          setRooms(data.rooms);
          console.log("data added" + data.rooms);
          
        } else {
          console.log('No rooms found');
        }
      })
      .catch(error => {
        console.log('Fetch error:', error);
      });
        // setToolsUpdated(!toolsUpdated); // Trigger a re-render by toggling the toolsUpdated state
        toast.success('Product added to room successfully',
        {autoClose:1000
        });
        setShowModal(false); // Close the modal after adding the product

      } else {
        toast.error('Failed to add product to room',
        {autoClose:1000
        });
      }
    } catch (error) {
      console.error('Error adding product to room:', error);
    }
  };

  const handleRenameRoom = async (roomName, newRoomName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/user/rooms/${roomName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newRoomName }),
      });
      
      if (response.ok) {
        // Room name updated successfully
        setEditingRooms(prevEditingRooms => {
          const newEditingRooms = { ...prevEditingRooms };
          delete newEditingRooms[roomName];
          newEditingRooms[newRoomName] = { newName: newRoomName, editing: false };
          return newEditingRooms;
        });
        setToolsUpdated(!toolsUpdated);
        toast.success('Room renamed successfully',
        {autoClose:1000
        });
      } else {
        // Handle server errors
        console.error('Failed to rename room');
        toast.error('Failed to rename room. Please try again.',
        {autoClose:1000
        });
      }
    } catch (error) {
      // Handle network errors
      console.error('Error renaming room:', error);
      toast.error('An error occurred while renaming the room. Please try again later.',
      {autoClose:1000
      });
    }
  };

  const handleDeleteRoom = async (roomName) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:5000/api/v1/user/rooms/${userId}/${roomName}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          setToolsUpdated(!toolsUpdated); // Trigger a re-render by toggling the toolsUpdated state
          toast.success('Room deleted successfully',
          {autoClose:1000
          });
        } else {
          toast.error('Failed to delete room',
          {autoClose:1000
          });
        }
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };



  const handleDeleteProduct = async (roomName, productId) => {
    if (window.confirm('Are you sure you want to delete this product from the room?')) {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:5000/api/v1/user/rooms/${userId}/${roomName}/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setToolsUpdated(!toolsUpdated); // Trigger a re-render by toggling the toolsUpdated state
          toast.success('Product deleted from room successfully',
          {autoClose:1000
          });
        } else {
          toast.error(data.error || 'Failed to delete product from room',
          {autoClose:1000
          });
        }
      } catch (error) {
        console.error('Error deleting product from room:', error);
      }
    }
  };

  const handleProductAddedToRoom = () => {
    setToolsUpdated(!toolsUpdated);
  };


  

  return (
    <div>
        <div className='create-btn' >
        <button className="btn btn-primary btn-outline flex justify-center items-center" onClick={onAddRoom}>
            <div>Create new room</div>
            <div>
            <Plus size={16} color="#ffffff" strokeWidth={2} />
            </div>
        </button>
      </div>

    <div id="main3" className=" overflow-scroll flex flex-col ">
      
      <br />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet"
      />
      <div className="mainid flex flex-wrap gap-7 justify-start items-center ">
      {Object.entries(rooms).map(([roomName, roomData]) => (
  <div
    key={roomName}
    className="Frame19 w-[220px] h-[350px]  py-4 pt-6 bg-white rounded-2xl flex-col justify-start items-center gap-1.5 inline-flex overflow-x-auto "
  >
    <RoomNameInput
      roomName={roomName}
      editing={editingRooms[roomName] && editingRooms[roomName].editing}
      onEdit={() =>
        setEditingRooms((prevEditingRooms) => ({
          ...prevEditingRooms,
          [roomName]: { newName: roomName, editing: true },
        }))
      }
      onSave={(newName) => handleRenameRoom(roomName, newName)}
      onDelete={handleDeleteRoom}
    />
    <div>
  <div>
  <div className="flex flex-col justify-center">
    {roomData.products &&
      roomData.products.map((productId, index) => (
        <div
          key={`${roomName}-${productId}-${index}`}
          className="flex items-center mb-3"
        >
          <button
            className={`product_name btn btn-outline btn-sm px-9 min-w-40 ${
              buttonClasses[Math.floor(Math.random() * buttonClasses.length)]
            }`}
            onClick={() =>
              roomProducts[productId]?.link &&
              window.open(roomProducts[productId].link, '_blank')
            }
          >
            {roomProducts[productId] ? roomProducts[productId].title : 'Loading'}
          </button>
          <button
            className="ml-2"
            onClick={() => handleDeleteProduct(roomName, productId)}
          >
            <Trash2 size={16} color="#d10000" strokeWidth={1.5} />
          </button>
        </div>
      ))}
  </div>
</div>
</div>
{(!roomData.products || roomData.products.length < 6) && (
  <button
    className="add_btn"
    onClick={() => {
      setSelectedRoom(roomName);
      setShowModal(true);
    }}
  >
    <img src="/aispace/plus_dark.svg" alt="click to add" className="add_btn" />
  </button>
)}
  </div>
))}
        {showModal && (
  <Aispace4
    roomName={selectedRoom}
    onAddProductToRoom={handleAddProductToRoom}
    onClose={() => setShowModal(false)}
    setToolsUpdated={setToolsUpdated} // Pass the setToolsUpdated function
    onProductAdded={handleProductAddedToRoom}
  />
)}
      </div>
    </div>
    </div>
  );
}
