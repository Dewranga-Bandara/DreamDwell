import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0 md:space-x-8">
          {/* Contact Section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Contact Us</h3>
            <p className="text-gray-400">123 DreamDwell St.</p>
            <p className="text-gray-400">City, State, 12345</p>
            <p className="text-gray-400">Email: contact@dreamdwell.com</p>
            <p className="text-gray-400">Phone: (123) 456-7890</p>
          </div>

          {/* Quick Links Section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">Home</a></li>
              <li><a href="/offers" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">Offers</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">About Us</a></li>
              <li><a href="/profile" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">Profile</a></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4 text-yellow-400">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                <FaFacebookF size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                <FaTwitter size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                <FaInstagram size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                <FaLinkedinIn size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 border-t border-gray-700 pt-6">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} DreamDwell. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
