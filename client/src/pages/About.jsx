import React from 'react';

const AboutUs = () => {
  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        
        {/* Header Section */}
        <header className='text-center mb-12'>
          <h1 className='text-3xl font-bold text-gray-800 mb-4'>About Us</h1>
          <p className='text-gray-600 text-lg'>
            At DreamDwell, we're passionate about helping you find your perfect home. Our mission is to simplify the process of home renting and buying with modern technology and exceptional service.
          </p>
        </header>
        
        {/* Mission Section */}
        <section className='mb-10 bg-white p-8 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Our Mission</h2>
          <p className='text-gray-700'>
            DreamDwell aims to revolutionize the real estate market by providing an intuitive platform that connects people with their dream homes. We believe that finding a home should be a seamless and enjoyable experience, and we’re committed to making that a reality for our users.
          </p>
        </section>
        
        {/* History Section */}
        <section className='bg-white p-8 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>Our History</h2>
          <p className='text-gray-700'>
            DreamDwell was founded in 2020 with the goal of changing the way people search for homes. Over the years, we have expanded our team, refined our platform, and grown our user base, always staying true to our mission of making home finding effortless and enjoyable.
          </p>
        </section>
        
      </div>
    </div>
  );
}

export default AboutUs;
