
import  { useState, useEffect } from 'react';
import { useParams,Link, useNavigate } from 'react-router-dom';
import '../styles/Details.css'
import Rating from './Rating';


export default function Details() {

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://vidhyasagargslv.pythonanywhere.com/api/mainai/${id}`)
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          } else {
            throw new Error(`HTTP error ${response.status}`);
          }
        }
        return response.json();
      })
      .then(data => setProduct(data))
      .catch(error => {
        console.error('Error fetching product details:', error);
        // setError(error.message);
      });
  }, [id]);
  
  if (!product) {
    return <div>Loading...</div>;
  }
  if (!id) {
    console.log('Product ID is missing');
    return;
  }

    function formatNumber(value) {
        const suffixes = ["", "K", "M", "B", "T"];
        let suffixIndex = 0;
        let scaledValue = value;
      
        while (scaledValue >= 1000 && suffixIndex < suffixes.length - 1) {
          suffixIndex++;
          scaledValue /= 1000;
        }
      
        return `${scaledValue.toFixed(1)}${suffixes[suffixIndex]}`;
      }



      function handleClose() {
        navigate(-1);
      }




  return (
    
    <div className='details parent-container h-screen flex justify-center items-center bg-black overflow-x-auto'>
        <div className="flex flex-col pt-2 pb-0 rounded-2xl border-2 border-stone-200  border-solid backdrop-blur-[28px] bg-black   bg-opacity-90   w-[1056px] h-[100vh] max-md:h-[100dvh] max-md:items-center">
      
        <div className="closebutton flex justify-center items-center mr-3 self-end w-[30px] max-md:mr-6 cursor-pointer"
        onClick={handleClose}
        >
        <img src='/closebtn.svg' alt="Logo" className="w-full aspect-square" />
        </div>
        <div className="flex flex-col px-10 mt-2 w-full max-md:px-5 bg-black max-md:max-w-full ">
        <header className="flex flex-wrap gap-5 justify-between content-start self-start font-bold">
          <h1 className="text-3xl text-violet-700 font-extrabold tracking-[2.24px] capitalize max-md:ml-[5px] max-md:text-2xl">
            {product.Title}
          </h1>
          <Link to ={product.link} target='_blank' >
          <button className="flex gap-2.5  justify-center py-2 px-5 text-sm tracking-wider cursor-pointer text-white bg-black rounded-xl border border-violet-50 border-solid max-md:pl-4 max-md:px-2 hover:bg-blue-400 hover:text-black">
            <span className="my-auto">Dive In</span>
            <img
              src='/divein.svg'
              alt="Arrow right"
              className="shrink-0 w-5 aspect-square"
            />
          </button>
          </Link>
        </header>
        
          <div className="flex-wrap justify-center content-center px-0.5 mt-6 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <article className="flex flex-col w-9/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow pr-3.5 pb-3 max-md:mt-7 max-md:max-w-full">
                  <div className="flex flex-wrap gap-5 justify-between content-start text-lg font-medium tracking-widest text-white">
                    
                    <div className="flex flex-col flex-wrap content-start pr-2.5 max-md:max-w-full max-md:mt-[-2rem]">
                      <p className="max-md:max-w-full text-balance">
                        {product.Description1}
                      </p>
                      <p className="mt-6 max-md:max-w-full text-balance">
                        {product.Description2}
                       </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 content-start self-start mt-2.5 mb-7 text-xs tracking-wider text-neutral-700 ">
                    <div className="justify-center py-0.5 pr-1 pl-2 whitespace-nowrap bg-rose-100 rounded">
                    {`#${product.keywords.split(',')[0].trim()}`} 

                    </div>
                    <div className="justify-center py-0.5 pr-1 pl-2 bg-rose-100 rounded">
                    {`#${product.keywords.split(',')[1].trim()}`} 
                    </div>
                    <div className="justify-center py-0.5 pr-1 pl-2 whitespace-nowrap bg-rose-100 rounded">
                    {`#${product.keywords.split(',')[2].trim()}`} 
 
                    </div>
                    <div className="justify-center py-0.5 pr-1 pl-2 whitespace-nowrap bg-rose-100 rounded">
                    {`#${product.keywords.split(',')[3].trim()}`} 
 
                    </div>
                    <div className="justify-center py-0.5 pr-1 pl-2 whitespace-nowrap bg-rose-100 rounded">
                    {`#${product.keywords.split(',')[4].trim()}`} 
 
                    </div>
                  </div>
                </div>
              </article>
              <aside className="flex flex-col ml-5 mt-[-60px] w-4/12 max-md:ml-0 max-md:w-full max-md:mt-0">
                <div className="flex flex-col self-stretch px-8 py-5 my-auto w-full rounded-2xl border-0 border-white border-solid bg-stone-950 max-md:px-5 max-md:mt-9">
                  <div className="flex flex-col justify-center items-center">
                    <div className="text-base tracking-wider text-neutral-100">
                      Total page views
                    </div>
                    <div className="flex flex-col justify-center items-center mt-3">
                        <div className="stat-value text-primary">
                        {formatNumber(product.Views)}
                        </div>
                      <div className="self-center text-base tracking-wider text-neutral-100">
                        In a month
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col self-center mt-6 max-w-full w-[102px] justify-center items-center">
                  <Rating rating={product.rating}/>
                  <div className="mt-2 text-xs tracking-normal text-white">
                      User rating
                  </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
          <img
            src={`/images/${product.Title}.jpg`}
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src="/innovaihub logo.jpeg"
            }}
            alt="Descriptive alt text for the image"
            className="mt-5 ml-5 max-w-full  aspect-[1.82] mb-11  w-[321px] max-md:mt-10 "
          />
        
      </div>
    </div>
    </div>
  )
}
