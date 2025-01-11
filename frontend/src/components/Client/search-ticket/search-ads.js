import Ads1 from '../../../assets/images/Client/book_ticket/ads-img-1.png';
import Ads2 from '../../../assets/images/Client/book_ticket/ads-img-2.png';

const SearchAds = () => {
    return (
        <>
            <div className="flex justify-around items-center mx-auto mt-6 w-2/3">
                {/* <!--Best Deal--> */}
                <div className="flex flex-col space-y-4 w-1/2">
                    <p className="text-sm font-thin text-white">BEST DEAL</p>
                    <p className="text-lg font-bold text-[#695E54]">Get ready to save big on your next trip with our Coupons</p>
                    <p className="text-sm font-thin text-white">We're excited to offer you an exclusive coupon to help you save on your next adventure. Whether you're planning a weekend getaway, family vacation, or solo adventure.</p>
                </div>
                {/* <!--Image--> */}
                <div className="flex space-x-4 w-1/2 h-full justify-center">
                    <img src={Ads1} alt="ads-1" className="w-2/5" />
                    <img src={Ads2} alt="ads-2" className="w-2/5" />
                </div>
            </div>
        </>
    )
}

export default SearchAds;