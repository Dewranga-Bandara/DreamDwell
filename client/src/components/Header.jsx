import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        
        <Link to='/' className='flex items-center'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Dream</span>
            <span className='text-slate-700'>Dwell</span>
          </h1>
        </Link>
        
        <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
          />
          <FaSearch className='text-slate-600 ml-2' />
        </form>
        
        <nav>
          <ul className='flex gap-4'>
            <li className='hidden sm:inline'>
              <Link to='/' className='text-slate-700 hover:underline'>
                Home
              </Link>
            </li>
            <li className='hidden sm:inline'>
              <Link to='/about' className='text-slate-700 hover:underline'>
                About
              </Link>
            </li>
            <li>
              <Link to='/sign-in' className='text-slate-700 hover:underline'>
                Sign In
              </Link>
            </li>
          </ul>
        </nav>
        
      </div>
    </header>
  );
}
