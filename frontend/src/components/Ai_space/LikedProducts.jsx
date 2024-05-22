import { useState, useEffect } from 'react';

export default function LikedProducts({ userId, roomId }) {
  const [likedProducts, setLikedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedProductIds = async () => {
      try {
        // Fetch liked product IDs from the database using userId
        const response = await fetch(`http://localhost:5000/api/v1/user/likedProducts/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch liked product IDs');
        }
        const likedProductIds = await response.json();
        
        // Fetch details of liked products from external API using the fetched IDs
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

  const handleAddToRoom = async (productId) => {
    try {
      // Add the selected product to the specified room in the database
      await fetch(`http://localhost:5000/api/v1/rooms/${roomId}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      console.log('Product added to room successfully');
    } catch (error) {
      console.error('Error adding product to room:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="liked-products">
      <h3>Liked Products</h3>
      <ul>
        {likedProducts.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <span>{product.Title}</span>
            <button onClick={() => handleAddToRoom(product.id)}>Add to Room</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
