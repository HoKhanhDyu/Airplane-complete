import PlaneDuration from "../../../assets/images/Client/select_flight/plane-duration.png";
import DashLine from "../../../assets/images/Client/select_flight/dash.svg";
import { Link } from "react-router-dom";
import { showPrice } from "../select-flight/show-price";

const SelectTypeTicket = ({ flightInformation }) => {
    const { from, fromDetail, to, toDetail, date, departure, arrive, duration, price, company } = flightInformation;
    const totalPassengers = flightInformation.adult + flightInformation.children + flightInformation.infant;

    return (
        <>
            {/* <!--Main Content--> */}
            <div className="flex flex-col justify-center items-center space-y-2 mt-2 mx-auto">
                <h1 className="text-4xl font-bold text-white">Continue</h1>
                {/* <!--Ticket--> */}
                <p className="text-lg text-white">YOUR FLIGHT</p>
                <div className="relative flex flex-col p-6 border border-transparent rounded-2xl w-1/4 bg-[#F8F8F8] bg-opacity-70">
                    {/* <!--Time & Place--> */}
                    <div className="flex justify-between items-center">
                        {/* <!--Origin--> */}
                        <div className="flex flex-col">
                            <p className="text-lg font-bold">{departure}</p>
                            <p className="text-lg font-bold text-gray-400">{from}</p>
                        </div>
                        {/* <!--Duration--> */}
                        <div className="flex flex-col justify-center items-center">
                            <img src={PlaneDuration} alt="duration" className="w-6" />
                            <p className="text-lg">{duration}</p>
                        </div>
                        {/* <!--Destination--> */}
                        <div className="flex flex-col">
                            <p className="text-lg font-bold">{arrive}</p>
                            <p className="text-lg font-bold text-gray-400">{to}</p>
                        </div>
                    </div>
                    {/* <!--Dash--> */}
                    <img src={DashLine} alt="dash" className="w-full mt-6" />
                    {/* <!--Brand & Price--> */}
                    <div className="flex justify-between mt-3">
                        <p className="text-lg font-bold">{company}</p>
                        <p className="text-lg font-bold">{showPrice(price)} VNĐ</p>
                    </div>
                    {/* <!--Circle--> */}
                    {/* <div
                        className="absolute w-8 h-10 border border-transparent bg-red-500 rounded-full -left-4 top-1/2 transform -translate-y-1/2">
                    </div>
                    <div
                        className="absolute w-8 h-10 border border-transparent bg-red-500 rounded-full -right-4 top-1/2 transform -translate-y-1/2">
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default SelectTypeTicket;