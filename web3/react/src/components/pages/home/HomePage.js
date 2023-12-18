import React from 'react'

import Navbar from '../navigation/Navbar'

import Footer from './Footer'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import image1 from '../../../assets/images/illustration.png'
import image2 from '../../../assets/images/image2.png'
import image3 from '../../../assets/images/image3.jpg'
import feature1 from '../../../assets/images/feature1.png'
import feature2 from '../../../assets/images/feature2.png'
import feature3 from '../../../assets/images/feature3.png'
import Slider from 'react-slick'
import './HomePage.css'

const HomePage = () => {
  // Carousel state
  const images = [image1, image2, image3]
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // Switches to another image every 5 seconds
  }

  useEffect(() => {
    localStorage.setItem('secret', '')
    localStorage.setItem('seed', '')
    localStorage.setItem('address', '')
    const timer = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer) // Cleanup on unmount
  }, [])
  const navigate = useNavigate()
  const handleCreateWallet = () => {
    navigate('/register')
  }
  const handleImportWallet = () => {
    navigate('/login')
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-grow'>
        <section className='static-image-section bg-slate-50'>
          <div className='container mx-auto flex px-5 py-24 items-center'>
            <div className='flex flex-col md:flex-row-reverse md:space-x-10'>
              {/* Image on the right */}
              <div className='md:w-1/2 flex-justify-center items-center md:justify-end'>
                <img src={image1} alt='Static' className='w-full md:max-w-sm object-cover md:ml-52' />
              </div>

              {/* Text on the left */}
              <div className='md:w-1/2 text-center md:text-left md:pr-10'>
                <h1 className='title-font sm:text-5xl text-4xl mb-4 font-medium text-gray-900'>
                  The leading timeslot board for appointment.
                </h1>
                <p className='mb-8 leading-relaxed'>
                  Platform for scheduling appointments, offering a timeslot board that is both user-friendly and efficient. It stands out as
                  the go-to choice for managing and booking appointments with ease and precision.
                </p>
                <div className='flex md:justify-start '>
                  <button
                    className='inline-flex text-white btn-primary focus:outline-none rounded text-lg mx-4'
                    onClick={handleCreateWallet}
                  >
                    Create Wallet
                  </button>
                  <button
                    className='inline-flex text-white btn-primary focus:outline-none rounded text-lg mx-4'
                    onClick={handleImportWallet}
                  >
                    Import Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='text-gray-700 body-font py-24 bg-black '>
          <div className='container px-5 mx-auto flex flex-wrap'>
            {/* Features as Cards */}
            <div className='flex flex-wrap -m-4 bg-gray'>
              <div className='p-4 lg:w-1/3 md:w-1/2 bg-gray'>
                <div className='h-full bg-white p-6 rounded-lg shadow-sm'>
                  <img src={feature1} alt='Feature 1' className='w-full h-48 object-contain object-center mb-4' />
                  <h2 className='sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900'>Immutable Transaction</h2>
                  <p className='leading-relaxed text-base'>
                    Store all the transactions and timeslots in immutable ledger for a decentralized system.
                  </p>
                </div>
              </div>
              <div className='p-4 lg:w-1/3 md:w-1/2 bg-gray'>
                <div className='h-full bg-white p-6 rounded-lg shadow-sm'>
                  <img src={feature2} alt='Feature 1' className='w-full h-48 object-contain object-center mb-4' />
                  <h2 className='sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900'>Timeslot Scheduling</h2>
                  <p className='leading-relaxed text-base'>
                    Smoother approach for hiring and being hired for short term contracts to maximize gig economy efficiency.
                  </p>
                </div>
              </div>
              <div className='p-4 lg:w-1/3 md:w-1/2 bg-gray'>
                <div className='h-full bg-white p-6 rounded-lg shadow-sm'>
                  <img src={feature3} alt='Feature 1' className='w-full h-48 object-contain object-center mb-4' />
                  <h2 className='sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900'>Deserving payouts</h2>
                  <p className='leading-relaxed text-base'>
                    Good practitioners will be rewarded with more competitive payments and higher valuation of their timeslots.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Objective Section */}
        {/* <section className='text-gray-700 body-font py-24'>
          <div className='container mx-auto flex px-5 flex-col items-center justify-center'>
            <h2 className='text-3xl mb-4 font-medium text-gray-900'>Our Objective</h2>
            <p className='leading-relaxed text-base text-center'>
              We strive to simplify your scheduling process. With APPOINTIAC, you can easily book, manage, and keep track of all your
              appointments. Our user-friendly platform is designed to save you time and make your life easier.
            </p>
          </div>
        </section> */}

        {/* Call to Action */}
        <section className='text-gray-700 body-font py-24 bg-slate-50'>
          <div className='container mx-auto flex px-5 flex-col items-center justify-center'>
            <div className='bg-white rounded-lg px-8 pt-6 pb-8 mb-4 shadow-lg'>
              <blockquote className='italic text-gray-600 text-lg leading-relaxed mb-6'>
                We strive to simplify your scheduling process. With APPOINTIAC, you can easily book, manage, and keep track of all your
                appointments. Our user-friendly platform is designed to save you time and make your life easier.
              </blockquote>
              <div className='flex justify-center'>
                <button
                  className='inline-flex text-white bg-primary-500 border-0 py-2 px-6 focus:outline-none hover:bg-primary-600 rounded text-lg'
                  onClick={handleCreateWallet}
                >
                  Get Started Now!
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage