import HomepageBackground from "../assets/images/homepage/Main/homepage-background.png";
import WelcomeImg from "../assets/images/homepage/Main/welcome-img.png";
import Destination from "../assets/images/homepage/Main/destination-example.png";
import ServiceFlight from "../assets/images/homepage/Main/service-flight.png"
import ServiceDinner from "../assets/images/homepage/Main/service-dinner.png"
import ServiceCoffee from "../assets/images/homepage/Main/service-coffee.png"
import ServiceLunch from "../assets/images/homepage/Main/service-lunch.png"
import Logo1 from "../assets/images/homepage/Main/logo1.png"
import Logo2 from "../assets/images/homepage/Main/logo2.png"
import Logo3 from "../assets/images/homepage/Main/logo3.png"
import Logo4 from "../assets/images/homepage/Main/logo4.png"
import Logo5 from "../assets/images/homepage/Main/logo5.png"
import { Link } from "react-router-dom";

const HomePageWithoutLogin = () => {
    return (
        <>
            <div className="">
                <div className="bg-cover bg-no-repeat h-screen overflow-y-hidden" style={{ backgroundImage: `url(${HomepageBackground})`, backgroundPosition: 'center' }}>
                    {/* Header */}
                    {/* <div className="flex justify-between items-center pt-4 px-12">
                        <div className="flex items-center space-x-6 text-white">
                            <i className="fa-solid fa-plane text-2xl"></i>
                            <h2 className="text-2xl border-b-2 border-gray-400 pb-2">AirPlane - Flight Management System</h2>
                        </div>
                        <div className="flex items-center space-x-6 text-white">
                            <Link to={'/login'}><button className="border border-white rounded-lg px-4 text-lg hover:bg-white hover:text-rose-400 hover:scale-105 duration-300">Log In</button></Link>
                            <Link to={'/signup'}><button className="border border-white rounded-lg px-4 text-lg hover:bg-white hover:text-rose-400 hover:scale-105 duration-300">Sign Up</button></Link>
                        </div>
                    </div> */}
                    {/* Nav Bar */}
                    {/* <div className="flex bg-white justify-between items-center px-12 py-6 w-4/5 mx-auto mt-12 rounded-lg">
                        <div className="flex space-x-2 items-center text-xl font-medium group group-hover:text-[#32B2FF] cursor-pointer">
                            <i className="fa-solid fa-house text-black group group-hover:text-[#32B2FF] group-hover:scale-105 duration-300"></i>
                            <p className="text-black group group-hover:text-[#32B2FF] group-hover:scale-105 duration-300">Home</p>
                        </div>
                        <div className="flex space-x-2 items-center text-xl font-medium group group-hover:text-[#32B2FF] cursor-pointer">
                            <i className="fa-solid fa-layer-group text-black group group-hover:text-[#32B2FF] group-hover:scale-105 duration-300"></i>
                            <p className="text-black group group-hover:text-[#32B2FF] group-hover:scale-105 duration-300">Services</p>
                        </div>
                        <div className="flex space-x-2 items-center text-xl font-medium group group-hover:text-[#32B2FF] cursor-pointer">
                            <i className="fa-solid fa-ticket-simple text-black group group-hover:text-[#32B2FF] group-hover:scale-105 duration-300"></i>
                            <p className="text-black group group-hover:text-[#32B2FF] group-hover:scale-105 duration-300">Booking</p>
                        </div>
                        <div className="flex space-x-2 items-center text-xl font-medium group group-hover:text-[#32B2FF] cursor-pointer">
                            <i className="fa-solid fa-users text-black group group-hover:text-[#32B2FF] group-hover:scale-105 duration-300"></i>
                            <p className="text-black group group-hover:text-[#32B2FF] group-hover:scale-105 duration-300">About</p>
                        </div>
                        <div className="flex space-x-2 items-center text-xl font-medium group group-hover:text-[#32B2FF] cursor-pointer">
                            <i className="fa-solid fa-pen-to-square text-black group group-hover:text-[#32B2FF] group-hover:scale-105 duration-300"></i>
                            <p className="text-black group group-hover:text-[#32B2FF] group-hover:scale-105 duration-300">Contact</p>
                        </div>
                    </div> */}
                    <div className="flex flex-col justify-center items-center space-y-6 w-1/3 mt-20 mx-20">
                        <p className="text-6xl text-[#BCE6FF] font-bold italic">Life is short and the world is wide</p>
                        <p className="text-lg text-white ">To get the best of your adventure you just need to leave and go where you like. We are waiting for you!</p>
                        <Link to={'/search-ticket'}><button className="text-2xl text-white border-4 border-[#32B2FF] px-4 py-2 bg-[#2D82B5] rounded-3xl hover:scale-105 hover:brightness-105 duration-500 mt-4">Get Started</button></Link>
                    </div>
                </div>
                <div className="bg-[#2D82B5] px-8 py-6">
                    <div className="flex justify-between items-center space-x-10">
                        <div className="flex flex-col w-3/5">
                            <div className="relative mb-4">
                                <p className="text-[8rem] text-white font-bold opacity-20">WELCOME</p>
                                <p className="absolute top-1/2 left-4 transform -translate-y-1/2 text-4xl text-white font-bold">WELCOME</p>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <div className="flex items-center">
                                    <p className="w-1/3 text-5xl text-[#0947FF] font-bold text-center">120+</p>
                                    <p className="w-2/3 text-4xl text-white font-bold">DOMESTIC AND INTERNATIONAL FLIGHTS</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="w-1/3 text-5xl text-[#0947FF] font-bold text-center">400+</p>
                                    <p className="w-5/12 text-4xl text-white font-bold">DOMEFLIGHTS PER DAY</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="w-1/3 text-5xl text-[#0947FF] font-bold text-center">6000+</p>
                                    <p className="w-5/12 text-4xl text-white font-bold">FRIENDLY AND HELPFUL STAFF</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="w-1/3 text-5xl text-[#0947FF] font-bold text-center">100+</p>
                                    <p className="w-1/2 text-4xl text-white font-bold">NEW MODERN AIRCRAFT PROTECT THE ENVIRONMENT</p>
                                </div>
                            </div>
                            <button className="text-2xl text-white border-4 border-[#32B2FF] px-4 py-2 bg-[#2D82B5] rounded-3xl hover:scale-105 hover:brightness-105 duration-500 w-1/6 mt-8 mx-auto">About Us</button>
                        </div>
                        <img src={WelcomeImg} className="w-2/5" alt="img" />
                    </div>

                    {/* Top Destinations */}
                    <div className="flex flex-col mt-48 w-3/4 mx-auto mb-12">
                        <h1 className="text-4xl font-semibold text-white text-center mb-12">Top Destinations</h1>
                        <div className="flex justify-center space-x-10">
                            <div className="w-1/4 flex flex-col">
                                <img src={Destination} alt="img" />
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <p>Sydney, <span className="text-xl font-semibold text-[#1852ff]">Australia</span></p>
                                        <p>Rs.74,000 onwards.</p>
                                    </div>
                                    <i className="fa-solid fa-plane-departure p-2 text-[#1852ff] border border-[#1852ff] rounded-full"></i>
                                </div>
                            </div>
                            <div className="w-1/4 flex flex-col">
                                <img src={Destination} alt="img" />
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <p>Sydney, <span className="text-xl font-semibold text-[#1852ff]">Australia</span></p>
                                        <p>Rs.74,000 onwards.</p>
                                    </div>
                                    <i className="fa-solid fa-plane-departure p-2 text-[#1852ff] border border-[#1852ff] rounded-full"></i>
                                </div>
                            </div>
                            <div className="w-1/4 flex flex-col">
                                <img src={Destination} alt="img" />
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <p>Sydney, <span className="text-xl font-semibold text-[#1852ff]">Australia</span></p>
                                        <p>Rs.74,000 onwards.</p>
                                    </div>
                                    <i className="fa-solid fa-plane-departure p-2 text-[#1852ff] border border-[#1852ff] rounded-full"></i>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center space-x-10 mt-6">
                            <div className="w-1/4 flex flex-col">
                                <img src={Destination} alt="img" />
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <p>Sydney, <span className="text-xl font-semibold text-[#1852ff]">Australia</span></p>
                                        <p>Rs.74,000 onwards.</p>
                                    </div>
                                    <i className="fa-solid fa-plane-departure p-2 text-[#1852ff] border border-[#1852ff] rounded-full"></i>
                                </div>
                            </div>
                            <div className="w-1/4 flex flex-col">
                                <img src={Destination} alt="img" />
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <p>Sydney, <span className="text-xl font-semibold text-[#1852ff]">Australia</span></p>
                                        <p>Rs.74,000 onwards.</p>
                                    </div>
                                    <i className="fa-solid fa-plane-departure p-2 text-[#1852ff] border border-[#1852ff] rounded-full"></i>
                                </div>
                            </div>
                            <div className="w-1/4 flex flex-col">
                                <img src={Destination} alt="img" />
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <p>Sydney, <span className="text-xl font-semibold text-[#1852ff]">Australia</span></p>
                                        <p>Rs.74,000 onwards.</p>
                                    </div>
                                    <i className="fa-solid fa-plane-departure p-2 text-[#1852ff] border border-[#1852ff] rounded-full"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services */}
                <div className="bg-[#BCE6FF] py-12">
                    <h1 className="text-5xl text-white font-bold text-center mb-8">Services</h1>
                    <div className="flex -space-x-16 justify-center items-center w-4/5 mx-auto">
                        <div className="relative w-1/4 group group-hover:scale-105 duration-300 cursor-pointer">
                            <img src={ServiceFlight} className="w-full h-auto group group-hover:scale-105 duration-300" alt="img" />
                            <p className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-white text-2xl font-bold group group-hover:scale-105 duration-300 group-hover:text-3xl group-hover:text-blue-400">
                                Flight
                            </p>
                        </div>
                        <div className="flex flex-col w-3/4 space-y-8 items-center justify-center">
                            <div className="flex justify-center space-x-8">
                                <div className="relative w-1/3 group group-hover:scale-105 duration-300 cursor-pointer">
                                    <img src={ServiceDinner} className="w-full h-auto group group-hover:scale-105 duration-300" alt="img" />
                                    <p className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-white text-2xl font-bold group group-hover:scale-105 duration-300 group-hover:text-3xl group-hover:text-blue-400">
                                        Dining
                                    </p>
                                </div>
                                <div className="relative w-1/3 group group-hover:scale-105 duration-300 cursor-pointer">
                                    <img src={ServiceCoffee} className="w-full h-auto group group-hover:scale-105 duration-300" alt="img" />
                                    <p className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-white text-2xl font-bold group group-hover:scale-105 duration-300 group-hover:text-3xl group-hover:text-blue-400">
                                        Coffee
                                    </p>
                                </div>
                            </div>
                            {/* ------------------------------- */}
                            <div className="flex justify-center space-x-8">
                                <div className="relative w-1/3 group group-hover:scale-105 duration-300 cursor-pointer">
                                    <img src={ServiceCoffee} className="w-full h-auto group group-hover:scale-105 duration-300" alt="img" />
                                    <p className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-white text-2xl font-bold group group-hover:scale-105 duration-300 group-hover:text-3xl group-hover:text-blue-400">
                                        Coffee
                                    </p>
                                </div>
                                <div className="relative w-1/3 group group-hover:scale-105 duration-300 cursor-pointer">
                                    <img src={ServiceLunch} className="w-full h-auto group group-hover:scale-105 duration-300" alt="img" />
                                    <p className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center text-white text-2xl font-bold group group-hover:scale-105 duration-300 group-hover:text-3xl group-hover:text-blue-400">
                                        Lunch
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collaborating Company */}
                <div style={{ backgroundColor: 'rgba(44, 147, 211, 0.8)' }} className="py-28 flex flex-col justify-center items-center space-y-8">
                    <h1 className="text-3xl text-white font-bold tracking-widest">COLLABORATING COMPANIES</h1>
                    <div className="bg-[#BCE6FF] flex justify-around items-center w-2/3 px-4 py-6 rounded-3xl">
                        <img src={Logo1} alt="img" className="w-1/6" />
                        <img src={Logo2} alt="img" className="w-1/6" />
                        <img src={Logo3} alt="img" className="w-1/6" />
                        <img src={Logo4} alt="img" className="w-1/6" />
                        <img src={Logo5} alt="img" className="w-1/6" />
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-black flex py-14">
                    <div className="flex flex-col justify-center items-center space-y-8 w-1/2">
                        <div className="flex flex-col justify-center items-center space-y-4">
                            <p className="text-4xl text-white">Newsletter & Special Promo</p>
                            <div>
                                <input type="text" placeholder="Enter your email" className="border border-gray-400 px-2 py-2 rounded-l-lg focus:outline-none" />
                                <button className="text-white bg-[#65AEF2] px-2 py-2 border border-[#65AEF2] rounded-r-lg hover:bg-[#2D82B5] hover:border-[#2D82B5]">Subscribe</button>
                            </div>
                        </div>
                        <div className="border-t border-gray-400">
                            <p className="text-sm text-white">© 2024 Flight Booking. All right reserved.</p>
                        </div>
                    </div>
                    <div className="w-1/2 space-y-12 justify-center items-center">
                        <div className="flex justify-center items-center space-x-6 text-white">
                            <i className="fa-solid fa-plane text-2xl"></i>
                            <h2 className="text-2xl border-b-2 border-gray-400 pb-2">AirPlane - Flight Management System</h2>
                        </div>
                        <div className="flex text-white justify-center space-x-4">
                            <div className="w-1/3 space-y-2">
                                <p className="hover:scale-105 duration-300 hover:text-rose-400 cursor-pointer">About us</p>
                                <p className="hover:scale-105 duration-300 hover:text-rose-400 cursor-pointer">Contact</p>
                                <p className="hover:scale-105 duration-300 hover:text-rose-400 cursor-pointer">Location</p>
                            </div>
                            <div className="w-1/3 space-y-2">
                                <p className="hover:scale-105 duration-300 hover:text-rose-400 cursor-pointer">FAQ</p>
                                <p className="hover:scale-105 duration-300 hover:text-rose-400 cursor-pointer">Term of Use</p>
                                <p className="hover:scale-105 duration-300 hover:text-rose-400 cursor-pointer">Privacy Police</p>
                            </div>
                            <div className="w-1/3 space-y-2">
                                <p className="hover:scale-105 duration-300 hover:text-rose-400 cursor-pointer">Services & Facilities</p>
                                <p className="hover:scale-105 duration-300 hover:text-rose-400 cursor-pointer">Careers</p>
                                <p className="hover:scale-105 duration-300 hover:text-rose-400 cursor-pointer">How to book</p>
                            </div>
                        </div>
                        <div className="flex text-white justify-center space-x-8">
                            <i className="fa-brands fa-facebook  text-2xl opacity-40 hover:opacity-100 hover:scale-105 duration-300 cursor-pointer"></i>
                            <i className="fa-brands fa-x-twitter text-2xl opacity-40 hover:opacity-100 hover:scale-105 duration-300 cursor-pointer"></i>
                            <i className="fa-brands fa-instagram text-2xl opacity-40 hover:opacity-100 hover:scale-105 duration-300 cursor-pointer"></i>
                            <i className="fa-brands fa-linkedin  text-2xl opacity-40 hover:opacity-100 hover:scale-105 duration-300 cursor-pointer"></i>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePageWithoutLogin;