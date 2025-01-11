import Footer1 from '../../../assets/images/Client/flight_info/footer-1.png';
import Footer2 from '../../../assets/images/Client/flight_info/footer-2.png';
import Footer3 from '../../../assets/images/Client/flight_info/footer-3.png';
import Footer4 from '../../../assets/images/Client/flight_info/footer-4.png';

const GetInformationFooter = () => {
    return (
        <>
            <div className="flex bg-black text-white">
                <div className="w-1/4">
                    <img src={Footer1} alt="footer" className="h-full" />
                </div>
                <div className="w-1/4 flex justify-center items-center border-r-2 border-gray-300">
                    <div>
                        <h4 className="text-xl text-rose-300 mb-4 font-semibold">Shareholders of the company</h4>
                        <p>Dao Minh Chien</p>
                        <p>Nguyen Van Chien</p>
                        <p>Ho Khanh Duy</p>
                        <p>Nguyen Cong Giap</p>
                        <p>Van Ho Phuong Ha</p>
                    </div>
                </div>
                <div className="w-1/4 flex justify-end items-center space-x-12">
                    <div className="flex flex-col">
                        <h2>GOLD SPONSOR</h2>
                        <img src={Footer2} alt="footer" className="w-1/2" />
                    </div>
                </div>
                <div className="flex justify-center items-center -space-x-12 w-1/4">
                    <img src={Footer3} alt="footer"
                        className="w-16 mt-16 z-10" />
                    <img src={Footer4} alt="footer"
                        className="w-36 mt-6 z-20" />
                </div>
            </div>
        </>
    )
}

export default GetInformationFooter;