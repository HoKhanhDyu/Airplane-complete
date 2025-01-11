import BookSeatHeader from "../../components/Client/book-seat/book-seat-header";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./showTicket.scss";
import { useSearchParams } from "react-router-dom";
import paymentService from "../../services/paymentService";
import invoiceService from "../../services/invoiceService";
import { useEffect, useState } from "react";

const ShowTicket = () => {

    const location = useLocation();
    const [searchParams] = useSearchParams();
    const invoiceID = searchParams.get("vnp_TxnRef"); // Lấy giá trị của vnp_TxnRef
    const totalAmount = searchParams.get("vnp_Amount"); // Lấy giá trị của vnp_Amount
    
    const [ticketsShow, setTicketsShow] = useState([]);


    useEffect(() => {
        // Chỉ gọi API nếu invoiceID hoặc totalAmount có giá trị
        if (invoiceID || totalAmount) {
            console.log(invoiceID, totalAmount);
            const handleGetTickets = async () => {
                try {
                    const response = await invoiceService.showTicket(invoiceID);
                    console.log('tickets', response);
                    setTicketsShow(response);
                } catch (error) {
                    console.log(error);
                }
            };
            handleGetTickets();
        }
    }, [invoiceID, totalAmount]); // Phụ thuộc vào invoiceID và totalAmount

    if (invoiceID) {
        // return (
        //     <div></div>
        // )
        return (
            <div className="h-screen overflow-hidden" style={{ background: "linear-gradient(to bottom, #2D82B5, #BCE6FF)" }}>
            <BookSeatHeader />
            {/* <!--Show Ticket--> */}
            <div className="flex flex-col justify-center items-center mt-4">
                <h1 className="text-5xl text-white font-bold">Boarding Pass</h1>
                {/* <!--Ticket--> */}
                <div className="bg-[#F8F8F8] p-8 mt-4 opacity-80 w-2/3 border-2 border-black rounded-lg">
                    {/* <!--Place--> */}
                    <div className="pb-2 px-4 border-b-2 border-black flex">
                        <div className="w-1/2 border-r-2 border-black items-start">
                            <p className="text-2xl text-black font-medium">FLIGHT ROUTE</p>
                        </div>
                        <div className="w-1/2 items-end text-right">
                            <p className="text-2xl text-black font-medium"> {`${ticketsShow?.depart_airport?.city}, ${ticketsShow?.depart_airport?.country} - ${ticketsShow?.arrival_airport?.city}, ${ticketsShow?.arrival_airport?.country}`}</p>
                        </div>
                    </div>
                    {/* <!--Information--> */}
                    <div className="flex justify-between items-center pt-8">
                        <div>
                            <p className="text-2xl">Booking Code</p>
                            <p className="text-3xl text-blue-400 font-semibold ml-4">{ticketsShow?.invoice?.booking_code}</p>
                        </div>
                        <div className="flex justify-center items-center space-x-2 text-xl">
                            {ticketsShow?.tickets?.map((ticket, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <i className="fa-solid fa-couch"></i>
                                    <p>{ticket.seat_id}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            {/* <p className="text-2xl">{ticketsShow.depart_time.replace('T', ' ')}</p> */}
                            <p className="text-base">{`${ticketsShow?.depart_time?.replace('T', ' ')} - (${ticketsShow?.flight_time})`}</p>
                        </div>
                    </div>

                    {/* <!--Name & Time--> */}
                    <div className="flex justify-between items-center mt-6">
                        <div>
                            <h2 className="text-xl">PASSENGER NAME</h2>
                            <div className="ml-8">
                                {ticketsShow?.tickets?.map((passenger, index) => (
                                    <div key={index} className="flex space-x-4">
                                        <p className="text-xl">{index + 1}.</p>
                                        <p className="text-xl">{passenger.male === 'male' ? "Mr" : "Mrs"}. {passenger.first_name} {passenger.last_name}</p>
                                    </div>
                                ))}
                                <div className="flex items-center space-x-6">
                                    <div className="p-2 bg-white border-1 border-transparent rounded-2xl">
                                        <p>{`${ticketsShow?.depart_airport?.code}-${ticketsShow?.arrival_airport?.code}`}</p>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        {/* {feature.baggage === 0 ? <p></p> :
                                            <div className="flex justify-start items-center space-x-4">
                                                <i className="fa-solid fa-suitcase"></i>
                                                <p>{feature.baggage} carry-on baggage</p>
                                            </div>
                                        } */}
                                        {/* {!feature.food ? <p></p> :
                                            <div className="flex justify-start items-center space-x-4">
                                                <i className="fa-solid fa-utensils"></i>
                                                <p>Fast food, drinks included</p>
                                            </div>
                                        }
                                        {!feature.refundable ? <p></p> :
                                            <div className="flex justify-start items-center space-x-4">
                                                <i className="fa-solid fa-arrow-rotate-right"></i>
                                                <p>Refundable</p>
                                            </div>
                                        } */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="flex">
                            <div className="space-y-16">
                                <p className="text-3xl">{departure}</p>
                                <p className="text-3xl">{arrive}</p>
                            </div>
                            <div className="border-l-2 border-black mr-8 ml-2"></div>
                            <div className="space-y-16">
                                <p className="text-3xl">{departureAirport}</p>
                                <p className="text-3xl">{arrivalAirport}</p>
                            </div>
                        </div> */}
                    </div>
                </div>
                                        
                <div className="-ml-48 mt-4">
                    <ul className="list-disc font-medium">
                        <li>Please give your booking code and ID card to the staff to get a paper ticket.</li>
                        <li>You must be at the airport at least 60 minutes in advance to check in.</li>
                        <li>The plane will close 15m before departure time.</li>
                    </ul>
                </div>
            </div>
            <div className="flex justify-end items-end m-10">
                <Link to="/customer/homepage"><button className="text-3xl font-medium hover:text-red-500">HOME</button></Link>
            </div>
        </div>
        )
    } 
    const flightInformation = location.state;
    
    const invoiceInfo = flightInformation.invoice || {};
    console.log(flightInformation);
    const { bookingCode, fromDetail, toDetail, customerSeats, date, departure, arrive, duration, passengers, feature, departureAirport, arrivalAirport } = flightInformation;

    // Thanh toán => Gọi API => Lưu vào database
    const handlePaying = async (e, invoice_id,total_price ) => {
        e.preventDefault();
        try {
            const res = await paymentService.createPayment({
                invoice_id: invoice_id,
                total_price: total_price,
            });
            console.log(res);
        } catch (error) {
            console.log(error);
        }

    }
    return (
        <div className="h-screen overflow-hidden" style={{ background: "linear-gradient(to bottom, #2D82B5, #BCE6FF)" }}>
            <BookSeatHeader />
            {/* <!--Show Ticket--> */}
            <div className="flex flex-col justify-center items-center mt-4">
                <h1 className="text-5xl text-white font-bold">Boarding Pass</h1>
                {/* <!--Ticket--> */}
                <div className="bg-[#F8F8F8] p-8 mt-4 opacity-80 w-2/3 border-2 border-black rounded-lg">
                    {/* <!--Place--> */}
                    <div className="pb-2 px-4 border-b-2 border-black flex">
                        <div className="w-1/2 border-r-2 border-black items-start">
                            <p className="text-2xl text-black font-medium">FLIGHT ROUTE</p>
                        </div>
                        <div className="w-1/2 items-end text-right">
                            <p className="text-2xl text-black font-medium"> {fromDetail.toUpperCase()} - {toDetail.toUpperCase()}</p>
                        </div>
                    </div>
                    {/* <!--Information--> */}
                    <div className="flex justify-between items-center pt-8">
                        <div>
                            <p className="text-2xl">Booking Code</p>
                            <p className="text-3xl text-blue-400 font-semibold ml-4">{bookingCode}</p>
                        </div>
                        <div className="flex justify-center items-center space-x-2 text-xl">
                            {customerSeats.map((seat, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <i className="fa-solid fa-couch"></i>
                                    <p>{seat.seatID}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col justify-center items-center">
                            <p className="text-2xl">{date}</p>
                            <p className="text-base">{departure} - {arrive} ({duration})</p>
                        </div>
                    </div>

                    {/* <!--Name & Time--> */}
                    <div className="flex justify-between items-center mt-6">
                        <div>
                            <h2 className="text-xl">PASSENGER NAME</h2>
                            <div className="ml-8">
                                {passengers.map((passenger, index) => (
                                    <div key={index} className="flex space-x-4">
                                        <p className="text-xl">{index + 1}.</p>
                                        <p className="text-xl">{passenger.gender === 'male' ? "Mr" : "Mrs"}. {passenger.firstName} {passenger.lastName}</p>
                                    </div>
                                ))}
                                <div className="flex items-center space-x-6">
                                    <div className="p-2 bg-white border-1 border-transparent rounded-2xl">
                                        <p>DN-HCM</p>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                        {/* {feature.baggage === 0 ? <p></p> :
                                            <div className="flex justify-start items-center space-x-4">
                                                <i className="fa-solid fa-suitcase"></i>
                                                <p>{feature.baggage} carry-on baggage</p>
                                            </div>
                                        }
                                        {!feature.food ? <p></p> :
                                            <div className="flex justify-start items-center space-x-4">
                                                <i className="fa-solid fa-utensils"></i>
                                                <p>Fast food, drinks included</p>
                                            </div>
                                        }
                                        {!feature.refundable ? <p></p> :
                                            <div className="flex justify-start items-center space-x-4">
                                                <i className="fa-solid fa-arrow-rotate-right"></i>
                                                <p>Refundable</p>
                                            </div>
                                        } */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="space-y-16">
                                <p className="text-3xl">{departure}</p>
                                <p className="text-3xl">{arrive}</p>
                            </div>
                            <div className="border-l-2 border-black mr-8 ml-2"></div>
                            <div className="space-y-16">
                                <p className="text-3xl">{departureAirport}</p>
                                <p className="text-3xl">{arrivalAirport}</p>
                            </div>
                        </div>
                    </div>
                </div>
                                        <button onClick={(e) => {
                                            handlePaying(e, invoiceInfo.id, invoiceInfo.total_price);
                                        }} className="pay-button">Confirmation and Payment</button>
                <div className="-ml-48 mt-4">
                    <ul className="list-disc font-medium">
                        <li>Please give your booking code and ID card to the staff to get a paper ticket.</li>
                        <li>You must be at the airport at least 60 minutes in advance to check in.</li>
                        <li>The plane will close 15m before departure time.</li>
                    </ul>
                </div>
            </div>
            <div className="flex justify-end items-end m-10">
                <Link to="/customer/homepage"><button className="text-3xl font-medium hover:text-red-500">HOME</button></Link>
            </div>
        </div>
    );
}

export default ShowTicket;