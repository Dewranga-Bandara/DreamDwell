import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkedAlt,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
  } from 'react-icons/fa';
  import Contact from '../components/Contact';

  const apiUrl = import.meta.env.VITE_API_URL;

  
  // https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const {currentUser} = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${apiUrl}/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);
  console.log(loading);

  return (
    <main className="relative">
      {/* Loading and Error States */}
      {loading && <p className='text-center my-7 text-2xl text-gray-700'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl text-red-600'>Something went wrong!</p>}
      
      {/* Listing Content */}
      {listing && !loading && !error && (
        <div className='max-w-7xl mx-auto px-4 py-6'>
          {/* Swiper for Image Carousel */}
          <Swiper navigation loop className="my-6">
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px] bg-cover bg-center rounded-lg'
                  style={{ backgroundImage: `url(${url})` }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share Button */}
          <div className='fixed top-20 sm:top:4 right-4 z-10 bg-white p-3 rounded-full shadow-md cursor-pointer'>
            <FaShare
              className='text-gray-700 text-2xl'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            />
          </div>
          
          {/* Copy Link Notification */}
          {copied && (
            <p className='fixed top-16 right-4 z-10 bg-gray-100 p-3 rounded-lg shadow-md text-gray-800'>
              Link copied!
            </p>
          )}

          {/* Listing Details */}
          <div className='bg-white rounded-lg shadow-lg p-6'>
          <div className='w-full flex justify-between items-center mb-0'>
            <h1 className='text-2xl font-bold text-gray-800'>{listing.name}</h1>
            <p className='bg-red-900 text-white text-center p-2 rounded-md'>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </p>
          </div>


            {/* Address and Listing Type */}
            <p className='flex items-center text-gray-600 text-base mb-4'>
                <FaMapMarkerAlt className='text-green-600 mr-2' />
                {listing.address}
              </p>
            
            {/* Price and Offer Details */}
            <div className='text-xl mb-6 flex items-center space-x-4'>
              {listing.offer ? (
                <>
                  <span className="text-blue-500 line-through text-lg">
                    ${listing.regularPrice.toLocaleString('en-US')}
                  </span>
                  <span className="text-red-600 font-bold">
                    ${(listing.regularPrice - listing.discountPrice).toLocaleString('en-US')}
                  </span>
                  {listing.type === 'rent' && <span className="text-gray-600">/ month</span>}
                  <p className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md">
                    ${listing.discountPrice.toLocaleString('en-US')} Off
                  </p>
                </>
              ) : (
                <>
                <span className="text-red-600 font-bold">
                  ${listing.regularPrice.toLocaleString('en-US')}
                </span>
                {listing.type === 'rent' && <span className="text-gray-600">/ month</span>}
                </>
              )}
              
            </div>

            {/* Description and Features */}
            <p className='text-gray-800 mb-4 font-semibold'>
               {listing.description}
            </p>

            

            <ul className='text-green-900 font-semibold flex flex-wrap gap-8 mb-4'>
              <li className='flex items-center gap-2'>
                <FaBed className='text-lg' />
                {listing.bedrooms} {listing.bedrooms > 1 ? 'beds' : 'bed'}
              </li>
              <li className='flex items-center gap-2'>
                <FaBath className='text-lg' />
                {listing.bathrooms} {listing.bathrooms > 1 ? 'baths' : 'bath'}
              </li>
              <li className='flex items-center gap-2'>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-2'>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>

            {/* Contact Button */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button 
                onClick={() => setContact(true)} 
                className='bg-gray-700 text-white rounded-lg px-6 py-3 hover:bg-gray-600 transition-colors mt-4'>
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </div>
      )}
    </main>
  );
}