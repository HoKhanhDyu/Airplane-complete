import PlaneDuration from "../../../assets/images/Client/select_flight/plane-duration.png";
import DashtLine from '../../../assets/images/Client/select_flight/dash.svg';
import { useNavigate } from "react-router-dom";
import {showPrice} from "./show-price";


const FlightTicket = ({ ticket, flightInfor }) => {
    const { flightCode, departure, from, duration, arrive, to, company, price} = ticket;
    console.log(price);
    const navigate = useNavigate();

    const handleSelectTicket = () => {
        const flightInformation = {
            flightID : ticket.id,
            from: ticket.from,
            fromDetail: ticket.fromDetail,
            to: ticket.to,
            toDetail: ticket.toDetail,
            date: ticket.departure,
            departure: ticket.departure,
            departureAirport: ticket.departureAirport,
            arrive: ticket.arrive,
            arrivalAirport: ticket.arrivalAirport,
            duration: ticket.duration,
            company: ticket.company,
            flightCode: ticket.flightCode,
            type: flightInfor.type,
            price: ticket.price,
            adult: flightInfor.adult,
            children: flightInfor.children,
            infant: flightInfor.infant,
            airline: flightInfor.airline,
        };
        navigate("/select-type", { state: flightInformation });
    }

    return (
        <>
            <a onClick={handleSelectTicket} className="relative flex flex-col px-6 py-2 pt-2 border border-transparent rounded-2xl w-4/5 bg-[#F8F8F8] bg-opacity-70 cursor-pointer hover:bg-white hover:scale-105 transition-transform duration-300">
                <p className="text-lg font-semibold text-center mb-2">{flightCode}</p>
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
                <img src={DashtLine} alt="dash" className="w-full mt-6" />
                {/* <!--Brand & Price--> */}
                <div className="flex justify-between mt-3">
                    <p className="text-lg font-bold">{company}</p>
                    <p className="text-lg font-bold">{showPrice(price)} VNĐ</p>
                </div>
                {/* <!--Circle--> */}
                {/* Kịp thì xử lý sau  */}

                {/* <div className="absolute w-8 h-10 border border-transparent bg-red-500 rounded-full -left-4 top-1/2 transform -translate-y-1/2"></div>
                <div className="absolute w-8 h-10 border border-transparent bg-red-500 rounded-full -right-4 top-1/2 transform -translate-y-1/2"></div> */}
            </a>
        </>
    )
}

export default FlightTicket;