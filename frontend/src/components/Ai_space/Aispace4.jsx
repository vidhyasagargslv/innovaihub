import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import './Aispace.css';

function Aispace4({ roomName, onAddProductToRoom, onClose, setToolsUpdated, onProductAdded }) {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const ModelRef = useRef();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchLikedProductIds = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/user/likedProducts/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch liked product IDs');
        }
        const likedProductIds = await response.json();
        const likedProductsData = await Promise.all(
          likedProductIds.map(async (productId) => {
            const productResponse = await fetch(`https://vidhyasagargslv.pythonanywhere.com/api/mainai/${productId}`);
            if (!productResponse.ok) {
              throw new Error(`Failed to fetch details for product ID: ${productId}`);
            }
            return productResponse.json();
          })
        );
        setLikedProducts(likedProductsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching liked products:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchLikedProductIds();
  }, [userId]);

  const handleProductSelect = (productId) => {
    setSelectedProductId(productId);
  };

  const handleAddProduct = () => {
    if (selectedProductId) {
      onAddProductToRoom(selectedProductId);
      setToolsUpdated((prevState) => !prevState); // Call the setToolsUpdated function passed as a prop
      onProductAdded();
    }
  };

  const closemodel = (e) => {
    if (ModelRef.current === e.target) {
      onClose();
    }
  };

  return (
    <div ref={ModelRef} onClick={closemodel} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center ">
      <div className="w-80 h-[30rem] bg-white rounded-2xl">
        <div className="aitools">
          <div className='flex flex-row'>
            <div className="top-heading text-black text-base font-extrabold text-center mt-4 mx-5">
              Select the AI tool to your space
            </div>
            <div className="close_btn place-self-end cursor-pointer" onClick={onClose}>
              <X strokeWidth={3} />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-4 mt-4">
            <div className="flex flex-col justify-center items-center gap-2 border-solid border-0 max-h-80 pt-[50px] pb-[10px] overflow-x-auto">
              {loading && <div>Loading...</div>}
              {error && <div className="text-red-500">{error}</div>}
              {!loading && !error &&
                likedProducts.map((product) => (
                  <button
                    key={product.id}
                    className={`tools btn btn-outline btn-sm w-48 px-6 ${selectedProductId === product.id ? 'bg-blue-500 text-white' : ''}`}
                    onClick={() => handleProductSelect(product.id)}
                  >
                    {product.Title}
                  </button>
                ))}
            </div>
            <button className="add_btn btn btn-primary btn-sm px-6 text-black mt-4" onClick={handleAddProduct}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Aispace4;