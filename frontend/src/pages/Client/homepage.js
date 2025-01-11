import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import PlaneHomepage from "../../assets/images/homepage/Customer/customer-homepage-plane.png";
import FeatureReservation from "../../assets/images/homepage/Customer/feature-reservation.png";
import FeatureDriver from "../../assets/images/homepage/Customer/feature-driver.png";
import FeatureAccompaniment from "../../assets/images/homepage/Customer/feature-accompaniment.png";
import FeaturePrivateReservation from "../../assets/images/homepage/Customer/feature-private-reservation.png";
import BottomLine from "../../assets/images/homepage/Customer/bottom-line.svg";
import FullService from '../../components/Client/homepage/full-service';
import HomeFooter from '../../components/Client/homepage/footer';

const CustomerHomepage = () => {
    const location = useLocation();
    const username = "customer";
    return (
        // <div>
        //     <h1>Customer Homepage</h1>
        //     <Link to={'/login'}>Login</Link>
        //     <Link to={'/signup'}>Signup</Link>
        //     <Link to={'/search-ticket'}>Booking</Link>
        //     <Link to={'/customer-information'}>Customer Information</Link>
        // </div>
        <>
            {/* Header */}
            {/* <div> */}
            <div className='bg-[#2D82B5] py-2 flex items-center justify-between'>
                <p className='text-xl text-black text-medium text-center italic w-11/12'>{username}</p>
                <div className='flex text-lg justify-center space-x-4 w-1/12'>
                    <i class="fa-regular fa-envelope"></i>
                    <i class="fa-solid fa-phone"></i>
                </div>
            </div>
            {/* Hero Section */}
            <div style={{ backgroundImage: `url(${PlaneHomepage})` }} className='bg-cover bg-no-repeat h-screen overflow-y-hidden'>
                <div className='flex justify-center py-4 border-b-2 border-[#77AECF]'>
                    <div className='flex justify-between items-center w-4/5'>
                        <Link to={'customer/homepage'}><button className='text-[#77AECF] text-xl font-semibold hover:scale-105 hover:text-rose-600 duration-300'>HOME</button></Link>
                        <Link to={'/search-ticket'}><button className='text-[#77AECF] text-xl font-semibold hover:scale-105 hover:text-rose-600 duration-300'>RESERVER</button></Link>
                        <Link to={'/customer-information'}><button className='text-[#77AECF] text-xl font-semibold hover:scale-105 hover:text-rose-600 duration-300'>HISTORY</button></Link>
                        <Link to={'/customer-information'}><button className='text-[#77AECF] text-xl font-semibold hover:scale-105 hover:text-rose-600 duration-300'>MY ACCOUNT</button></Link>
                        <Link><button className='text-[#77AECF] text-xl font-semibold hover:scale-105 hover:text-rose-600 duration-300'>CONTACT</button></Link>
                    </div>
                </div>
                <div className='flex flex-col w-1/3 ml-16 justify-center space-y-10 h-2/3'>
                    <p className='text-3xl font-medium'>YOUR SMILE IS THE DESTINATION OF THE FLIGHT</p>
                    <Link to={'/search-ticket'}><button className='px-8 py-4 ml-8 text-2xl text-white bg-[#2D82B5] opacity-70 rounded-lg hover:opacity-100 hover:scale-105 transition duration-300'>RESERVER</button></Link>
                </div>
            </div>
            <div className='flex flex-col space-y-24'>
                {/* Our Services */}
                <div className='flex flex-col items-center justify-center space-y-8'>
                    <div className='flex flex-col items-center justify-center space-y-2 w-1/3'>
                        <p className='text-5xl font-thin'>OUR SERVICES</p>
                        <img src={BottomLine} />
                        <p className='text-lg font-thin italic w-2/3 text-center'>Offer you services to make your
                            travel more enjoyable</p>
                    </div>
                    {/* Feature */}
                    <div className='flex w-10/12 space-x-8'>
                        <div className='flex flex-col items-center space-y-2 text-lg font-medium'>
                            <img src={FeatureReservation} alt="feature" className='w-30 rounded-xl hover:scale-105 duration-300' />
                            <p>Reservation</p>
                        </div>
                        <div className='flex flex-col items-center space-y-2 text-lg font-medium'>
                            <img src={FeatureDriver} alt="feature" className='w-30 rounded-xl hover:scale-105 duration-300' />
                            <p>Driver</p>
                        </div>
                        <div className='flex flex-col items-center space-y-2 text-lg font-medium'>
                            <img src={FeatureAccompaniment} alt="feature" className='w-30 rounded-xl hover:scale-105 duration-300' />
                            <p>VIP Accompaniment</p>
                        </div>
                        <div className='flex flex-col items-center space-y-2 text-lg font-medium'>
                            <img src={FeaturePrivateReservation} alt="feature" className='w-30 rounded-xl hover:scale-105 duration-300' />
                            <p>Private jet reservation</p>
                        </div>
                    </div>
                </div>
                {/* Introduction  */}
                <div className='flex flex-col items-center justify-center space-y-8'>
                    <div className='flex flex-col items-center justify-center space-y-2 w-1/3'>
                        <p className='text-5xl font-thin'>WHO ARE WE?</p>
                        <img src={BottomLine} />
                    </div>
                    <div className='bg-[#77AECF] w-10/12 py-4 px-8 rounded-lg space-y-8'>
                        <p className='text-lg'>Working in the airline industry for almost 15 years, it was natural for me to create a travel assistance and support service.</p>
                        <p className='text-lg pb-12'>As the manager of our airport support and services company, my ambition is to provide our customers with an exceptional and stress-free travel experience. Through my experience, I have seen the importance of personalized support for travelers. This is why I created a company that offers quality services to meet the needs of our customers.</p>
                    </div>
                </div>
                {/* Full Services */}
                <FullService />

                {/* Extra  */}
                <div className='flex flex-col items-center justify-center space-y-10'>
                    <div className='flex flex-col items-center justify-center space-y-2 w-1/3'>
                        <p className='text-5xl font-thin'>OUR LITTLE EXTRAS</p>
                        <img src={BottomLine} />
                    </div>
                    <div className='flex w-1/2 space-x-8 justify-between'>
                        <div className='flex flex-col items-center space-y-8'>
                            <i class="fa-solid fa-repeat text-7xl"></i>
                            <p className='text-xl font-thin'>Flexible</p>
                        </div>
                        <div className='flex flex-col items-center space-y-8'>
                            <i className="fa-solid fa-couch text-7xl"></i>
                            <p className='text-xl font-thin'>Comfort</p>
                        </div>
                        <div className='flex flex-col items-center space-y-8'>
                            <i className="fa-regular fa-clock text-7xl"></i>
                            <p className='text-xl font-thin'>Save time</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <HomeFooter />
            {/* </div> */}
        </>
    )
}

export default CustomerHomepage;