import Salon from "../../../assets/images/homepage/Customer/salon.png";
import PrivateDriver from "../../../assets/images/homepage/Customer/private-driver.png";
import Accompaniment from "../../../assets/images/homepage/Customer/vip-accompaniment.png";
import BottomLine from "../../../assets/images/homepage/Customer/bottom-line.svg";


const FullService = () => {
    return (
        <>
            <div className='flex flex-col items-center justify-center space-y-4'>
                <div className='flex flex-col items-center justify-center space-y-2 w-1/3'>
                    <p className='text-5xl font-thin'>FULL SERVICES</p>
                    <img src={BottomLine} />
                </div>
                <div className='flex flex-col w-9/12 items-center justify-center space-y-8'>
                    <div className='flex justify-center space-x-8 w-full'>
                        <div style={{ backgroundImage: `url(${Salon})` }} className='bg-cover bg-no-repeat w-1/3 h-72 flex justify-center items-center rounded-lg hover:scale-105 duration-300'>
                            <p className='text-white bg-[#2D82B5] px-4 py-2 rounded-lg'>SALON VIP</p>
                        </div>
                        <div style={{ backgroundImage: `url(${PrivateDriver})` }} className='bg-cover bg-no-repeat w-1/3 h-72 flex justify-center items-center rounded-lg hover:scale-105 duration-300'>
                            <p className='text-white bg-[#2D82B5] px-4 py-2 rounded-lg'>PRIVATE DRIVER</p>
                        </div>
                    </div>
                    <div style={{ backgroundImage: `url(${Accompaniment})` }} className='bg-cover bg-no-repeat w-2/3 h-72 flex justify-center items-center rounded-lg hover:scale-105 duration-300'>
                        <p className='w-1/4 text-center text-white bg-[#2D82B5] py-2 rounded-lg'>VIP ACCOMPANIMENT (FAST TRACK)</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FullService;