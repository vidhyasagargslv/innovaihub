import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Card from "../components/Card";

import Favourites from "./navcomponents/Favourites";
import Popular from "./navcomponents/Popular";

import { toast } from "react-toastify";
import "../styles/Navbar.css";
import Aispace3 from "./Ai_space/Aispace3";
import Aispace2 from "./Ai_space/Aispace2";
import Aispace1 from "./Ai_space/Aispace1";

function MenuItem({
  iconSrc,
  altText,
  children,
  onSelect,
  isExternal = false,
  link,
  label,
  onClick,
}) {
  return (
    <div>
      {isExternal ? (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <button className="flex gap-3 w-48 justify-between px-3.5 py-2 mt-2 text-sm font-medium whitespace-nowrap text-zinc-900 bg-transparent border-none cursor-pointer hover:bg-gray-200 rounded-lg">
            <img
              loading="lazy"
              src={iconSrc}
              alt={altText}
              className=" w-6 aspect-square"
            />
            <div className="flex-auto self-center justify-start text-left ml-3 capitalize font-bold">
              {label}
            </div>
          </button>
        </a>
      ) : (
        <button
          className="flex gap-3 w-48 justify-between px-3.5 py-2 mt-2 text-sm font-medium whitespace-nowrap text-zinc-900 bg-transparent border-none cursor-pointer hover:bg-gray-200 rounded-lg"
          onClick={onSelect}
        >
          <img
            loading="lazy"
            src={iconSrc}
            alt={altText}
            className=" w-6 aspect-square"
          />
          <div className="flex-auto self-center justify-start text-left ml-3 capitalize font-bold">
            {label || children}
          </div>
        </button>
      )}
    </div>
  );
}

function Navbar() {
  const [selectedComponent, setSelectedComponent] = useState(<Card />);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [rooms, setRooms] = useState([]);

  const handleAddRoom = () => { 
    setSelectedComponent(<Aispace2 onAddRoom={handleRoomAdded} />);
        console.log('button click')
};
  const handleRoomAdded = () => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:5000/api/v1/user/rooms/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.rooms && Object.keys(data.rooms).length > 0) {
          setSelectedComponent(<Aispace3 />);
        } else {
          console.log("No rooms found");
        }
      })
      .catch((error) => {
        console.log("Fetch error:", error);
      });
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/v1/user/${userId}`
          );
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            console.error("Failed to fetch user");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        console.log("No userId found in local storage");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/v1/user/rooms/${userId}`
          );
          if (response.ok) {
            const data = await response.json();
            setRooms(data.rooms || []);
          } else {
            console.info("You dont have any room till now");
          }
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      }
    };

    fetchRooms();
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    console.log("Logged out, auth removed from local storage");
    toast.success("Logout successful");
    navigate("/Login");
  };

  // const renderAispace = () => {
  //   // Check if rooms data is available
  //   if (Object.keys(rooms).length > 0) {
  //     // If rooms data is available and there are rooms, render Aispace3
  //     return <Aispace3 />;
  //   } else {
  //     // If rooms data is available and there are no rooms, render Aispace1
  //     return <Aispace1 />;
  //   }
  // };

  const menuItems = [
    {
      iconSrc: "/home.svg",
      altText: "Home icon",
      component: <Card />,
      label: "Home",
    },
    {
      iconSrc: "/popular.svg",
      altText: "Popular icon",
      component: <Popular />,
      label: "Popular",
    },
    {
      iconSrc: "/navfav.svg",
      altText: "Favourites icon",
      component: <Favourites />,
      label: "Favourites",
    },
    { iconSrc: "/myspace.png", altText: "My Space icon", label: "My Space" },
    {
      iconSrc: "/discord.png",
      altText: "Join Discord icon",
      label: "Join Discord",
      isExternal: true,
      link: "https://discord.com/invite/c9K8wvNKAP",
    },
  ];

  const handleSelect = (item) => {
    if (item.label === "My Space") {
      const userId = localStorage.getItem("userId");
      fetch(`http://localhost:5000/api/v1/user/rooms/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.rooms && Object.keys(data.rooms).length > 0) {
            setSelectedComponent(<Aispace3 onAddRoom={handleAddRoom} />);
          } else {
            setSelectedComponent(<Aispace1 onAddRoom={handleAddRoom} />);
          }
        })
        .catch((error) => {
          console.log("Fetch error:", error);
        });
    } else {
      setSelectedComponent(item.component);
    }
  };

  // Check if the current location is the login page, if so, do not render the Navbar
  if (location.pathname === "/Login") {
    return null;
  }

  return (
    <div className="parent flex justify-left ml-6 flex-shrink-1">
      <div
        id="sidebar"
        className="flex flex-col flex-shrink-0 pt-7 pb-12 rounded-2xl shadow-xl backdrop-blur-[7.776000022888184px] bg-indigo-600 bg-opacity-90 leading-[150%] min-w-[225px] min-h-[80vh] "
      >
        <header className="flex flex-col justify-center items-start px-2 pt-5 pb-8">
          <div className="flex justify-center items-center pr-8 ml-3 mb-5 gap-3">
            <div>
              <img
                loading="lazy"
                src="/avatar.png"
                alt="User Avatar"
                className="self-start w-10 aspect-square"
              />
            </div>
            <div className="name text-center font-semibold text-lg text-white tracking-wider capitalize">
              {user?.username}
            </div>
          </div>
          <div className="menuContainer flex flex-col justify-between">
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                iconSrc={item.iconSrc}
                altText={item.altText}
                onSelect={() => handleSelect(item)}
                isExternal={item.isExternal}
                link={item.link}
                label={item.label}
                // onClick={()=>item.onClick}
              />
            ))}
          </div>
          <button
            className="flex gap-6 justify-between px-3.5 py-2 mt-2  text-sm font-medium whitespace-nowrap text-zinc-900 bg-transparent border-none cursor-pointer hover:bg-gray-200 rounded-lg"
            onClick={logout}
          >
            <img
              loading="lazy"
              src="/login.png"
              alt="Logout icon"
              className="w-6 aspect-square"
            />
            <div className="flex-auto self-start font-bold">Logout</div>
          </button>
        </header>
      </div>
      <div className="selectedComponent">{selectedComponent}</div>
    </div>
  );
}

export default Navbar;
