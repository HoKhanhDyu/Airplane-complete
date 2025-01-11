import { Link } from "react-router-dom"

const SelectTypeHeader = ({ flightInformation }) => {
    const { from, fromDetail, to, toDetail, date } = flightInformation;
    const totalPassengers = flightInformation.adult + flightInformation.children + flightInformation.infant;
    return (
        <>
            <div className="flex justify-between items-center px-4 pt-2">
                <Link to={'/'}><div><i className="fa-solid fa-house"></i></div></Link>
                <div className="flex justify-center mx-auto items-center space-x-8">
                    <i className="fa-solid fa-plane text-sm"></i>
                    <h2 className="text-sm border-b-2 border-gray-400 pb-1">Hệ Thống Quản Lý Bán Vé Máy Bay</h2>
                </div>
                <div>
                    <Link to={'/login'}><div>Login</div></Link>
                </div>
            </div>
            <div className="flex justify-between items-center bg-white bg-opacity-90 mt-4">
                <div className="flex ml-6">
                    {/* <!--Place info--> */}
                    <div className="flex space-x-4 pr-2 border-r border-black">
                        {/* <!--Origin--> */}
                        <div className="flex flex-col justify-center items-center">
                            <p className="font-semibold">{from}</p>
                            <p className="text-xs">{fromDetail}</p>
                        </div>
                        {/* <!--Plane--> */}
                        <div>
                            <i className="fa-solid fa-plane"></i>
                        </div>
                        {/* <!--Destination--> */}
                        <div className="flex flex-col justify-center items-center">
                            <p className="font-semibold">{to}</p>
                            <p className="text-xs">{toDetail}</p>
                        </div>
                    </div>
                    {/* <!--Depart--> */}
                    <div className="flex flex-col pl-2 pr-2 justify-center items-center border-r border-black">
                        <p className="font-semibold">Depart</p>
                        <p className="text-xs">{date}</p>
                    </div>
                    {/* <!--Passengers--> */}
                    <div className="flex flex-col pl-2 pr-2 justify-center items-center">
                        <p className="font-semibold">Passengers</p>
                        <div className="flex items-center justify-center space-x-2">
                            <i className="fa-solid fa-user"></i>
                            <p className="text-xs">{totalPassengers}</p>
                        </div>
                    </div>
                </div>
                {/* <!--Booking Cart--> */}

                {/* Cập nhật link tới lịch sử đặt vé */}
                
                <Link to={'/'}>
                    <div className="flex flex-col p-3 justify-center items-center h-full" style={{ background: "linear-gradient(to bottom, #EC7070, #ECC6C6)" }}>
                        <i className="fa-solid fa-cart-shopping"></i>
                        <p className="text-sm font-semibold">YOUR BOOKING</p>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default SelectTypeHeader;