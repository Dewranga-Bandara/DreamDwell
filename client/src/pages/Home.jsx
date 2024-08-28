import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  SwiperCore.use([Navigation, Autoplay, Pagination]);

  // console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=6');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=6');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=6');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
<div className='relative'>
  {/* swiper */}
  <div className='relative'>
    <Swiper slidesPerView={1}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 5000 }}
        className="relative w-full h-full overflow-hidden">
      {offerListings && offerListings.length > 0 ? (
        offerListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div
              style={{
                background: `url(${listing.imageUrls[0]}) center`,
                backgroundSize: 'cover',
              }}
              className='h-[500px] relative'
            >
              {/* Optional: Add content on SwiperSlide */}
            </div>
          </SwiperSlide>
        ))
      ) : (
        <div className='h-[500px] flex items-center justify-center text-gray-500'>
          No listings available
        </div>
      )}
    </Swiper>
    {/* Glass effect */}
    <div className='absolute inset-0 bg-gray-250 bg-opacity-20 backdrop-blur-xl z-10'></div>
  </div>

  {/* top */}
  <div className='absolute inset-0 flex flex-col justify-center items-center gap-6 p-16 max-w-4xl mx-auto text-center z-20 rounded-xl'>
    <h1 className='text-slate-900 font-bold text-3xl lg:text-5xl' style={{textShadow: '2px 2px 4px rgba(255, 255, 255)'}}>
      Discover Your <span className='text-sky-50 text-3xl lg:text-5xl font-bold' style={{textShadow: '1px 1px 0 #ff0000, -1px -1px 0 #ff0000, 1px -1px 0 #ff0000, -1px 1px 0 #ff0000'}}>
        Dream
      </span> Home
      <br />
      Right Away
    </h1>
    <p className='text-black text-base font-semibold sm:text-lg relative z-20'>
  Welcome to DreamDwell, your gateway to finding the ideal place to call home. 
  From stunning offers to exclusive rentals and sales, we have it all.
</p>

    <Link
      to={'/search'}
      className='bg-blue-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-600 transition'
    >
      Start Your Journey Here...
    </Link>
  </div>
</div>




      {/* listing results for offer, sale and rent */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Spotlight on Offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/offers'}>Explore All Offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Charming Rentals</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>See More Rentals</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Exclusive Sales</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Browse All Sales</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
