import react,{useEffect} from 'react';
import { Link } from 'react-router-dom';
import Loginpage from './Loginpage';
<link href="https://fonts.googleapis.com/css?family=Roboto:100,100italic,300,300italic,regular,italic,500,500italic,700,700italic,900,900italic" rel="stylesheet" />
import '../styles/Cursor.css'
import { gsap } from 'gsap'

export default function Heropage() {

  useEffect(() => {
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");

    const mouseMoveHandler = (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      cursorOutline.style.left = `${posX}px`;
      cursorOutline.style.top = `${posY}px`;
    };

    window.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      window.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, []);

  useEffect(() => {
    //add gsap animation to class profnet , shouild come from top 
    gsap.fromTo('.innovaihub', 
        { opacity: 0, y: -100 },
        { opacity: 1, y: 0, duration: 2 ,delay:1}
    );
    

    //add gsap animation to class Tagline , shouild come from below
    gsap.fromTo('.Tagline', 
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 2,delay:1 }
    );

    //add gsap animation to class Button , shouild appear on the screen after 2 seconds
    gsap.fromTo('.next_btn', 
        { opacity: 0 },
        { opacity: 1, delay: 2, duration: 2 }
    );
    gsap.fromTo('.low_tag', 
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 2 ,delay:3}
    );

    


  }, [])

    return (
      <>
        <div className="cursor-dot"></div>
        <div className='cursor-outline'></div>
      <section className="flex flex-col justify-center items-center max-h-screen w-full cursor-none">
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <div className="flex flex-col justify-center w-full max-md:max-w-full">
          <div className="flex overflow-hidden relative flex-col justify-center items-center px-16 py-20 w-full  max-h-screen max-md:px-5 max-md:max-w-full">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/6f15cb0f464c50a7b546fef753b4cbf621c3992faff5e3584bafbd25acca729f?apiKey=3dae5537341847ff8437e82410f94190&"
              alt="Background image"
              className="object-cover absolute inset-0 size-full max-h-screen blur-[2px]"
            />
            <div className="flex relative justify-center items-center flex-col mt-28 mb-32 w-full max-w-[1052px] max-md:my-10 max-md:max-w-full">
              <header className="flex flex-col justify-center text-white max-md:max-w-full">
                <h1 className=" innovaihub self-center text-center font-[Montserrat] text-5xl font-bold max-md:text-4xl">
                  InnovAI Hub
                </h1>
                <div className="Tagline flex flex-col mt-10 font-semibold max-md:max-w-full">
                  <h2 className="heading1 font-[Montserrat] text-center text-6xl max-md:max-w-full max-md:text-4xl">
                    Empower Your Work with AI Tools
                  </h2>
                  <p className="self-center font-[Montserrat] text-center mt-8 text-4xl max-md:max-w-full max-md:hidden">
                    Experience the Future of Automation
                  </p>
                </div>
              </header>
              <div className="flex flex-col justify-center self-center mt-12 max-w-full text-sm font-medium tracking-normal leading-5 text-center w-[388px] max-md:mt-10">
                <div className="flex flex-col justify-center self-center max-w-full text-violet-950 w-[182px]">
                  
                  <Link to="./Login">
                    <button className="next_btn flex flex-row flex-shrink-0 gap-2 justify-center px-7 py-2 bg-white rounded-[36px] max-md:px-5 hover:bg-violet-400">
                      <span className="my-auto">Get Started</span>
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/f3081fade5504338acca6eab72f93915c403cc3bb47777a341923336f1689a7c?apiKey=3dae5537341847ff8437e82410f94190&"
                        alt="Arrow icon"
                        className="shrink-0 w-6 aspect-square"
                      />
                    </button>
                  </Link>
                </div>
                <p className="low_tag mt-11 italic font-[roboto] text-white max-md:mt-10">
                  Unlock your potential. Powerful features await behind the
                  login
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </>
    );
}

