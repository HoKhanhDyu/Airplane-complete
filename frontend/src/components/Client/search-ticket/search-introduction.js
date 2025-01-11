import appleImage from '../../../assets/images/Client/book_ticket/apple.png';
import ggplayImage from '../../../assets/images/Client/book_ticket/google-play.png';
import { Link } from 'react-router-dom';

const SearchIntroduction = () => {
    return (
        <>
            <div className="flex flex-col ml-8 w-3/5">
            {/* <!--Slogan - Download--> */}
            <div
                className="flex flex-col space-y-16 px-6 pb-12 pt-2 bg-white border border-black rounded-tl-lg rounded-bl-lg">
                <div className="flex items-center space-x-4 mt-4">
                    <i className="fa-solid fa-plane text-lg"></i>
                    <h2 className="text-lg border-b-2 border-gray-400 pb-2">Hệ Thống Quản Lý Bán Vé Máy Bay</h2>
                </div>
                {/* <!--Slogan--> */}
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-4xl italic font-thin">Your Smile Is The Destination Of Every Flight</h1>
                    <p className="text-base italic font-thin">Your well-being is our top priority</p>
                    <p className="text-base italic font-thin">We want to ensure that you have a safe and pleasant journey
                    </p>
                </div>
                {/* <!--Button--> */}
                <div className="flex space-x-16 justify-center items-center w-2/3 mx-auto">
                    <a className="bg-black text-white flex justify-center items-center text-lg space-x-8 px-4 py-1 border border-transparent rounded-md w-full cursor-pointer"><img src={appleImage} alt="apple" className="w-8" />
                        <p className="text-wrap">Download on AppStore</p>
                    </a>
                    <a className="bg-black text-white flex justify-center items-center text-lg space-x-8 px-4 py-1 border border-transparent rounded-md w-full cursor-pointer"><img src={ggplayImage} alt="ggplay"
                            className="w-8" />
                        <p className="text-wrap">Download on GooglePlay</p>
                    </a>
                </div>
            </div>

            {/* <!--Information--> */}
            <div className="flex justify-between mt-2 mx-4">
                <div className="flex justify-center items-center space-x-2 text-white">
                    <h1 className="text-4xl font-semibold">100K</h1>
                    <p>Comments</p>
                </div>
                <div className="flex justify-center items-center space-x-2 text-white">
                    <h1 className="text-4xl font-semibold">150K</h1>
                    <p>Downloads</p>
                </div>
                <div className="flex justify-center items-center space-x-2 text-white">
                    <h1 className="text-4xl font-semibold">4.9</h1>
                    <p>Reviews on GooglePlay</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default SearchIntroduction;