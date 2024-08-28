import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

export default function Offers() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: true,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    if (type === 'checkbox') {
      setSidebardata({ ...sidebardata, [id]: checked });
    } else if (id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: value });
    } else if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebardata({ ...sidebardata, sort, order });
    } else if (type === 'radio') {
      setSidebardata({ ...sidebardata, type: id });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(sidebardata);
    navigate(`/search?${urlParams.toString()}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', numberOfListings);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    setListings([...listings, ...data]);
    setShowMore(data.length >= 9);
  };

  return (
    <div className='flex flex-col md:flex-row bg-gray-100 min-h-screen'>
      <aside className='flex-1 bg-white shadow-md p-8 border-r md:w-1/4 h-fit rounded-lg max-w-fit'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2'>
            <label className='text-base font-medium'>Search Term</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='Search...'
              className='border rounded-lg p-3 w-full'
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-base font-medium'>Type</label>
            <div className='flex gap-2'>
              <input
                type='radio'
                id='all'
                name='type'
                className='mr-2'
                onChange={handleChange}
                checked={sidebardata.type === 'all'}
              />
              <label htmlFor='all'>Rent & Sale</label>
            </div>
            <div className='flex gap-2'>
              <input
                type='radio'
                id='rent'
                name='type'
                className='mr-2'
                onChange={handleChange}
                checked={sidebardata.type === 'rent'}
              />
              <label htmlFor='rent'>Rent</label>
            </div>
            <div className='flex gap-2'>
              <input
                type='radio'
                id='sale'
                name='type'
                className='mr-2'
                onChange={handleChange}
                checked={sidebardata.type === 'sale'}
              />
              <label htmlFor='sale'>Sale</label>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='mr-2'
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <label htmlFor='offer'>Offer</label>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-base font-medium'>Amenities</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='mr-2'
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <label htmlFor='parking'>Parking</label>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='mr-2'
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <label htmlFor='furnished'>Furnished</label>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-base font-medium'>Sort By</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='regularPrice_desc'>Price high to low</option>
              <option value='regularPrice_asc'>Price low to high</option>
              <option value='createdAt_desc'>Latest</option>
              <option value='createdAt_asc'>Oldest</option>
            </select>
          </div>
          <button className='bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 transition'>
            Search
          </button>
        </form>
      </aside>
      <main className='flex-3 p-6'>
        <div className='flex flex-wrap gap-6'>
          {!loading && listings.length === 0 && (
            <p className='text-xl text-gray-600'>No listings found!</p>
          )}
          {loading && (
            <p className='text-xl text-gray-600 text-center w-full'>Loading...</p>
          )}
          {!loading && listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
          {showMore && (
            <div className='flex justify-center items-center mx-auto'>
              <button
              onClick={onShowMoreClick}
              className='bg-green-600 text-white p-3 rounded-lg hover:bg-green-500 transition w-fit'
            >
              Show More
            </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
