import React, { useState, useEffect,useRef } from 'react'
import Rating from './Rating'
import '../styles/Card.css'
import Loginpage from './Loginpage';

import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';




export default function Card() {
  
  
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
    <div className='text-zinc-900 font-medium text-center font-serif'>"AI will not replace humans, but it will make them better at what they do"</div>
    </div>
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
          let updatedLikedProducts = likedProducts;
          let message;
          if (updatedLikedProducts.includes(productId)) {
              // Product is already liked, so it's being unliked
              updatedLikedProducts = updatedLikedProducts.filter(id => id !== productId);
              message = 'removed from favorites';
          } else {
              // Product is being liked
              updatedLikedProducts = [...updatedLikedProducts, productId];
              message = 'added to favorites';
          }
          if(message){
            toast.success(message,
            {autoClose:1000
            }
            )
          }
          localStorage.setItem('likedProducts', JSON.stringify(updatedLikedProducts));
          setLikedProducts(updatedLikedProducts);
    } else {
            toast.error('Failed to like product');
        }
    } catch (error) {
        console.error('Error liking product:', error);
        toast.error('An error occurred');
    }
};


  
  return (
    <div className="card-container -mt-6">
      <div className="filtersection ml-[15dvw] flex flex-wrap justify-center items-center gap-5  ">
        <div>
         
          <label className="input input-bordered flex items-center gap-2 text-white">
            <input
              type="text"
              className="search-input text-gray-400"
              placeholder="Search"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              ref={searchInputRef}
            />
            <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
        </div>

        <div className="dropdown ">
          <div
            tabIndex={0}
            role="button"
            className="btn  text-gray-400 btn-wide active:bg-neutral-content enabled:bg-neutral-content"
          >
            Category
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu  shadow bg-base-100 rounded-box w-180 overflow-x-auto"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            <li>
              <a onClick={() => setSelectCategory("")}>All</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("3D")}>3D</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Seo")}>seo</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("generative AI")}>generative AI</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Presentation")}>
                presentation
              </a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Marketing")}>Marketing</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Logo")}>Logo</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Image Ai")}>Image ai</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Human Resource")}>
                Human Resources
              </a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Health care")}>HealthCare</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Gift Ideas")}>Gift Ideas</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("General Writing")}>
                General Writing
              </a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Gaming")}>Gaming</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Games")}>Games</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Fun Tools")}>FunTools</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Finance")}>Finance</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Fashion")}>Fashion</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Experiments")}>
                Experiments
              </a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Enterprise")}>Enterprise</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Email Assistant")}>
                Email Assistant
              </a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Education Assistant")}>
                Education Assistant
              </a>{" "}
            </li>
            
            <li>
              <a onClick={() => setSelectCategory("E-Commerce")}>Ecommerce</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Developer")}>Developer</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Design Assistant")}>
                Design Assistant
              </a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Customer Support")}>
                customer support
              </a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Copy writing")}>Copy writing</a>{" "}
            </li>
            
            <li>
              <a onClick={() => setSelectCategory("Communication")}>
                Communication
              </a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Code Assistant")}>
                Code Assistant
              </a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("chatbot")}>chatbot</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Business")}>Bussiness</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Avatar")}>Avatar</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Automation")}>Automation</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Audio Editing")}>
                Audio Editing
              </a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Audio")}>audio</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Art")}>Art</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectCategory("Ai Website Builder")}>Ai Website Builder</a>{" "}
            </li>
          </ul>
        </div>

        <div className="version dropdown ">
          <div tabIndex={0} role="button" className="btn m-1">
            Version
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a onClick={() => setSelectedVersion("")}>All</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectedVersion("free")}>Free</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectedVersion("paid")}>Paid</a>{" "}
            </li>
            <li>
              <a onClick={() => setSelectedVersion("freemium")}>Freemium</a>{" "}
            </li>
          </ul>
        </div>
      </div>
      <div className="cardholder  flex flex-wrap gap-x-[42px] gap-y-[31px]  bg-purple  justify-center items-center rounded-2xl">
        {data
          .filter(
            (item) =>
              item.Title.toLowerCase().includes(searchTerm.toLowerCase()) &&
              (selectCategory === "" || item.category === selectCategory) &&
              (selectedVersion === "" ||
                item.version.toLowerCase() === selectedVersion)
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
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src="/innovaihub logo.jpeg"
                  }}
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
