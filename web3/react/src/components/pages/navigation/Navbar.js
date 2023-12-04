import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/images/logo.png' // Import your logo here
import support from '../../../assets/images/support.png' // Import your logo here

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className='flex items-center justify-between flex-wrap bg-white p-4 '>
      <div className='flex items-center flex-shrink-0 text-black mr-6'>
        <img
          src={logo}
          alt='Company Logo'
          className='h-8 w-auto' // Adjust size as needed
        />
        <span className='font-semibold text-xl tracking-tight ml-2'>Appointiac</span>
      </div>
      <div className='block lg:hidden'>
        <button
          onClick={toggleMenu}
          className='flex items-center px-3 py-2 border rounded text-primary-200 border-primary-400 hover:text-black hover:border-blue'
        >
          <svg className='fill-current h-3 w-3' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
            <title>Menu</title>
            <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
          </svg>
        </button>
      </div>
      <div className={`${isOpen ? `block` : `hidden`} w-full block flex-grow lg:flex lg:items-center lg:w-auto lg:justify-center`}>
        <div className='text-lg lg:flex-grow lg:flex lg:justify-center'>
          <Link to='/' className='block mt-4 lg:inline-block lg:mt-0 text-black hover:text-blue-800 font-semibold mr-20'>
            Home
          </Link>
          <Link to='/login' className='block mt-4 lg:inline-block lg:mt-0 text-black hover:text-blue-800 font-semibold mr-20'>
            Login
          </Link>
          <Link to='/register' className='block mt-4 lg:inline-block lg:mt-0 text-black hover:text-blue-800 font-semibold mr-20'>
            Register
          </Link>
        </div>
      </div>
      <div className='hidden lg:block ml-auto'>
        {' '}
        {/* This will hide the button on smaller screens and show only on larger screens */}
        <Link to='/support' className='inline-flex items-center justify-center p-2 rounded-full  hover:bg-blue-600 text-white'>
          <img src={support} alt='Support' className='h-8 w-8' /> {/* Adjust size as needed */}
        </Link>
      </div>
    </nav>
  )
}

export default Navbar