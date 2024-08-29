import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

const apiUrl = import.meta.env.VITE_API_URL;


export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();



  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 && 
  // request.resource.contentType.matches('image/.*')

  const [deleteItem, setDeleteItem] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  const [deleteUserDialog, setDeleteUserDialog] = useState(false);

  const [signOutDialog, setSignOutDialog] = useState(false);


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${apiUrl}/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`${apiUrl}/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
    setDeleteUserDialog(false)
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`${apiUrl}/api/auth/signout`);
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message)); 
        return;
      }
      dispatch(signOutUserSuccess(data)); 
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
    setSignOutDialog(false)
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`${apiUrl}/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`${apiUrl}/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
    setShowDialog(false)
    setDeleteItem(null);
  };

  const confirmDeleteDialog = (listingId) => {
    setShowDialog(true);
    setDeleteItem(listingId); // Store the listing ID to use for deletion
  };
  
  const confirmDeleteUserDialog = () => {
    setDeleteUserDialog(true);
  };

  const confirmSignOutDialog = () => {
    setSignOutDialog(true);
  };
  

  return (
    <div>
      <div className='mt-7 p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg'>
      <h1 className='text-3xl font-bold text-gray-800 mb-4 text-center mt-2'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
        <div className='flex flex-col items-center'>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt='profile'
            className='rounded-full h-32 w-32 object-cover cursor-pointer border-4 border-gray-200 transition-transform transform hover:scale-105'
          />
          <p className='text-sm mt-2'>
            {fileUploadError ? (
              <span className='text-red-600'>Error uploading image (must be less than 2 MB)</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-gray-600'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-600'>Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>
        </div>
        <label className="block text-gray-800 font-semibold">Username</label>
        <input
          type='text'
          placeholder='Username'
          defaultValue={currentUser.username}
          id='username'
          className='border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          onChange={handleChange}
        />
        <label className="block text-gray-800 font-semibold">Email</label>
        <input
          type='email'
          placeholder='Email'
          id='email'
          defaultValue={currentUser.email}
          className='border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          onChange={handleChange}
        />
        <label className="block text-gray-800 font-semibold">Password</label>
        <input
          type='password'
          placeholder='Password'
          id='password'
          className='border border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          onChange={handleChange}
        />
  
        <button
          disabled={loading}
          className='bg-blue-600 text-white rounded-lg p-4  hover:bg-blue-700 transition-colors disabled:opacity-70'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
  
        <Link
          className='bg-green-600 text-white p-4 rounded-lg  text-center hover:bg-green-700 transition-colors'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
  
      <div className='flex justify-between mt-6'>
        <button
          onClick={confirmDeleteUserDialog}
          className='bg-red-700 text-white rounded-lg p-4  hover:bg-red-900 transition-colors disabled:opacity-70'
        >
          Delete Account
        </button>

        <button
          onClick={confirmSignOutDialog}
          className='bg-purple-700 text-white rounded-lg p-4  hover:bg-purple-900 transition-colors disabled:opacity-70'
        >
          Sign Out
        </button>

      </div>
  
      <p className='text-red-600 mt-5'>{error ? error : ''}</p>
      <p className='text-green-600 mt-5'>{updateSuccess ? 'User updated successfully!' : ''}</p>
  
      <button
        onClick={handleShowListings}
        className='text-green-600 w-full mt-6 border border-green-600 p-3 rounded-lg  hover:bg-green-100 transition-colors'
      >
        Show Listings
      </button>
  
      <p className='text-red-600 mt-5'>{showListingsError ? 'Error showing listings' : ''}</p>
      
      
      {deleteUserDialog && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Confirm Deletion</h3>
            <p className='text-gray-600 mb-4'>
              Are you sure you want to delete this account? This action cannot be undone.
            </p>
            <div className='flex justify-between'>
              <button
                onClick={() => handleDeleteUser()}
                className='bg-red-600 text-white p-2 rounded-lg hover:bg-red-700'
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteUserDialog(false)}
                className='bg-gray-300 text-gray-800 p-2 rounded-lg hover:bg-gray-400'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {signOutDialog && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Confirm sign out</h3>
            <p className='text-gray-600 mb-4'>
              Are you sure you want to sign out? 
            </p>
            <div className='flex justify-between'>
              <button
                onClick={() => handleSignOut()}
                className='bg-red-600 text-white p-2 rounded-lg hover:bg-red-700'
              >
                Sign Out
              </button>
              <button
                onClick={() => setSignOutDialog(false)}
                className='bg-gray-300 text-gray-800 p-2 rounded-lg hover:bg-gray-400'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    {userListings && userListings.length > 0 && (
        <div className='mt-8 p-6 items-center w-full justify-between'>
          <h2 className='text-2xl font-semibold text-gray-800 text-center mb-6'>Your Listings</h2>
          <div className='flex flex-wrap gap-4 w-full'>
            {userListings.map((listing) => (
              <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={
                    listing.imageUrls[0] ||
                    'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
                  }
                  alt='listing cover'
                  className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
                />
                <div className='p-3 flex flex-col gap-2 w-full'>
                  <p className='truncate text-lg font-semibold text-slate-700'>
                    {listing.name}
                  </p>
                  <div className='flex items-center gap-1'>
                    <MdLocationOn className='h-4 w-4 text-green-700' />
                    <p className='text-sm text-gray-600 truncate w-full'>
                      {listing.address}
                    </p>
                  </div>
                  <p className='text-sm text-gray-600 line-clamp-2'>
                    {listing.description}
                  </p>
                  <p className='text-slate-500 mt-2 font-semibold '>
                    $
                    {listing.offer
                      ? (listing.regularPrice-listing.discountPrice).toLocaleString('en-US')
                      : listing.regularPrice.toLocaleString('en-US')}
                    {listing.type === 'rent' && ' / month'}
                  </p>
                  <div className='text-slate-700 flex gap-4'>
                    <div className='font-bold text-xs'>
                      {listing.bedrooms > 1
                        ? `${listing.bedrooms} beds `
                        : `${listing.bedrooms} bed `}
                    </div>
                    <div className='font-bold text-xs'>
                      {listing.bathrooms > 1
                        ? `${listing.bathrooms} baths `
                        : `${listing.bathrooms} bath `}
                    </div>
                  </div>
                </div>
              </Link>
              <div className="w-full border-t border-gray-300"></div>
              <div className='flex items-center justify-between p-3'>
              <Link to={`/update-listing/${listing._id}`}>
                    <div
                      className="flex items-center justify-center w-7 h-7 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                      aria-label="Edit Listing"
                    >
                      <MdEdit className="h-3 w-3" />
                    </div>
                  </Link>
                <div className='flex flex-col items-center'>
                  <div
                    className="flex items-center justify-center w-7 h-7 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-700 transition-colors duration-200"
                    onClick={() => confirmDeleteDialog(listing._id)}
                    aria-label="Delete Listing"
                  >
                    <FaTrash className="h-3 w-3" />
                  </div>
                  
                </div>
              </div>
            </div>

            ))}
          </div>
          {showDialog && (
        <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Confirm Deletion</h3>
            <p className='text-gray-600 mb-4'>
              Are you sure you want to delete this listing? This action cannot be undone.
            </p>
            <div className='flex justify-between'>
              <button
                onClick={() => handleListingDelete(deleteItem)}
                className='bg-red-600 text-white p-2 rounded-lg hover:bg-red-700'
              >
                Delete
              </button>
              <button
                onClick={() => setShowDialog(false)}
                className='bg-gray-300 text-gray-800 p-2 rounded-lg hover:bg-gray-400'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      )}
  </div>
    
  );
  
}