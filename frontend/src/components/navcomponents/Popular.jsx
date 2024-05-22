import  { useState, useEffect,useRef } from 'react'
import Rating from '../Rating'
import '../../styles/Card.css'

import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';




export default function Popular() {
  
  
  const [data, setData] = useState();
  const [likedProducts, setLikedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectCategory, setSelectCategory] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  useEffect(() => {
   
    async function fetchData() {
      
      const response = await fetch('https://vidhyasagargslv.pythonanywhere.com/api/mainai/');
      const data = await response.json();
      setData(data);
    }
    fetchData();

    
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault(); // Prevent the default action to avoid any conflict with browser shortcuts
        searchInputRef.current.focus(); // Focus the search input field
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await fetch(`http://localhost:5000/api/v1/user/likedProducts/${userId}`);
          if (response.ok) {
            const likedProducts = await response.json();
            setLikedProducts(likedProducts);
          } else {
            console.error('Failed to fetch liked products');
          }
        } catch (error) {
          console.error('Error fetching liked products:', error);
        }
      }
    };
  
    fetchLikedProducts();
  }, []);

  



  if (!data) {
    return <div className='flex flex-col justify-center items-center mt-52'>
    <div className='loading loading-bars loading-xl w-16 h-16 flex justify-center items-center bg-black'/> <br />
    <div className='text-zinc-900 font-medium text-center font-serif '>"Artificial intelligence is the future, not just a trend"</div>
    </div>
    
    ;
  }
  

  function truncateTitle(title) {
    const words = title.split(' ');
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '...';
    }
    return title;
  }


  function getBgColor(version) {
    const versionLowerCase = (version || '').toLowerCase();
    return versionLowerCase === 'free'
      ? 'bg-green-400'
      : versionLowerCase === 'paid'
      ? 'bg-blue-400'
      : versionLowerCase === 'freemium'
      ? 'bg-orange-400'
      : 'bg-gray-400';
  }
  

  
  const handleSave = (data) => {
    localStorage.setItem('likedProducts', JSON.stringify(data));
    setLikedProducts(data);
  };


  
  const handleLike = async (productId, setLikedProducts, likedProducts, handleSave) => {
    try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            toast.error('User not logged in');
            return;
        }
    
        const response = await fetch(`http://localhost:5000/api/v1/user/like/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId }),
        });
    
        if (response.ok) {
            setLikedProducts(prevLikedProducts => {
                let updatedLikedProducts;
                let message;
                if (prevLikedProducts.includes(productId)) {
                    // Product is already liked, so it's being unliked
                    updatedLikedProducts = prevLikedProducts.filter(id => id !== productId);
                    message = 'Product unliked';
                } else {
                    // Product is being liked
                    updatedLikedProducts = [...prevLikedProducts, productId];
                    message = 'Product liked';
                }
                localStorage.setItem('likedProducts', JSON.stringify(updatedLikedProducts));
                handleSave(updatedLikedProducts);
                toast.success(message);
                return updatedLikedProducts;
            });
        } else {
            toast.error('Failed to like product');
        }
    } catch (error) {
        console.error('Error liking product:', error);
        toast.error('An error occurred');
    }
};


  
  return (
    <div className="card-container">
      
      <div className="cardholder  flex flex-wrap gap-x-[42px] gap-y-[31px] mt-5  bg-purple  justify-center items-center">
        {data
          .filter(
            (item) =>
              item.Title.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (selectCategory === "" || item.category === selectCategory) &&
              (selectedVersion === "" ||
                item.version.toLowerCase() === selectedVersion) &&
                item.additional === 'recommended'
          )
          .map((item, index) => (
            <div
              key={item.url}
              className="Cardbox flex  flex-col items-center px-2.5 pt-2.5 pb-3  border-opacity-20 max-w-[306px] min-h-[370px] "
            >
              <Link to={`/product/${data[index].id}`}>
                <img
                  loading="lazy"
                  className="self-stretch aspect-[1.79] truncate object-cover w-full rounded-3xl"
                  style={{
                    minWidth: "288px",
                    maxWidth: "288px",
                    minHeight: "160px",
                    maxHeight: "160px",
                  }}
                  src={`/images/${item.Title}.jpg`}
                />

                <div className="flex flex-col mt-5 w-full max-w-[260px]">
                  <div className="flex flex-col text-white">
                    <div className="tilte justify-center self-center px-0.5 py-1.5 text-center text-base font-bold tracking-wider uppercase ">
                      {truncateTitle(item.Title)}
                    </div>
                    <div className="justify-center px-2.5 py-px text-xs tracking-wider text-center capitalize">
                      {item.Tagline}
                    </div>
                  </div>
                  <div className="flex gap-5 justify-between self-center mt-2.5">
                    <div
                      className={`version justify-center items-center px-3 pt-1.5 text-xs tracking-wider text-black whitespace-nowrap rounded-full ${getBgColor(
                        item.version
                      )}`}
                    >
                      {item.version.toUpperCase()}
                    </div>
                    <div className="flex gap-px justify-center p-0.5">
                      <Rating rating={item.rating} />
                    </div>
                  </div>
                </div>
              </Link>
              <div className="flex gap-5 justify-center mt-5 text-base font-semibold tracking-wider text-white">
              <button
              className={`like-button ${likedProducts.includes(item.id) ? "liked" : ""}`}
              onClick={() => handleLike(item.id, setLikedProducts, likedProducts, handleSave)}
            >
              <svg className="favorite shrink-0 self-start aspect-[1.12] w-[38px]">
                <path
                  d="M38 10.9818C38 23.3805 20.3928 33.4164 19.6429 33.8309C19.4453 33.9419 19.2244 34 19 34C18.7756 34 18.5547 33.9419 18.3571 33.8309C17.6072 33.4164 0 23.3805 0 10.9818C0.00314304 8.07022 1.11228 5.27887 3.08408 3.22011C5.05588 1.16134 7.72931 0.00328166 10.5179 0C14.021 0 17.0881 1.57287 19 4.23152C20.9119 1.57287 23.979 0 27.4821 0C30.2707 0.00328166 32.9441 1.16134 34.9159 3.22011C36.8877 5.27887 37.9969 8.07022 38 10.9818Z"
                  fill={likedProducts.includes(item.id) ? "red" : "white"}
                />
              </svg>
            </button>
                <a
                  target="_blank"
                  href={item.link}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex gap-2.5 justify-center py-2 pr-4 pl-7 bg-sky-500 rounded-2xl">
                    <div>Visit Website</div>
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/79cc2f61a89ab6f8bf5c9a3a22ea2807b6e917be002c128a3bcded5bb4ba9b58?apiKey=3dae5537341847ff8437e82410f94190&"
                      className="shrink-0 aspect-square w-[21px] text-black"
                    />
                  </div>
                </a>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
