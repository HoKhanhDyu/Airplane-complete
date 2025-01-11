import FlightInformation from "../../components/Client/select-flight/flight-information";
import TicketList from "../../components/Client/select-flight/flight-tickets-list";
import FlightImage from "../../assets/images/Client/select_flight/plane.png";
import { useLocation } from "react-router-dom";
import flightService from "../../services/flightService";
import { useEffect, useState } from "react";

const SelectFlight = () => {
    // Lấy thông tin tìm kiếm
    const location = useLocation();
    const searchData = location.state;
    // console.log(searchData);

    // Data tạm cho vé máy bay
    // const ticketData = [
    //     {
    //         departure: "10:00 AM",
    //         departureAirport: "Da Nang Airport",
    //         from: "DND",
    //         fromDetail: "Da Nang",
    //         arrive: "12:00 PM",
    //         arrivalAirport: "Tan Son Nhat Airport",
    //         to: "HCM",
    //         toDetail: "Ho Chi Minh City",
    //         company: "Vietnam Airlines",
    //         companyAbreviation: "VN",
    //         price: 1200000,
    //         duration: "2h"
    //     },
    //     {
    //         departure: "2:00 PM",
    //         departureAirport: "Da Nang Airport",
    //         from: "DND",
    //         fromDetail: "Da Nang",
    //         arrive: "4:00 PM",
    //         arrivalAirport: "Tan Son Nhat Airport",
    //         to: "HCM",
    //         toDetail: "Ho Chi Minh City",
    //         company: "Vietnam Airlines",
    //         companyAbreviation: "VN",
    //         price: 1350000,
    //         duration: "2h"
    //     },
    //     {
    //         departure: "10:00 AM",
    //         departureAirport: "Da Nang Airport",
    //         from: "DND",
    //         fromDetail: "Da Nang",
    //         arrive: "12:00 PM",
    //         arrivalAirport: "Tan Son Nhat Airport",
    //         to: "HCM",
    //         toDetail: "Ho Chi Minh City",
    //         company: "VietJet Air",
    //         companyAbreviation: "VJ",
    //         price: 1000000,
    //         duration: "2h"
    //     },
    //     {
    //         departure: "18:00 AM",
    //         departureAirport: "Da Nang Airport",
    //         from: "DND",
    //         fromDetail: "Da Nang",
    //         arrive: "20:00 PM",
    //         arrivalAirport: "Tan Son Nhat Airport",
    //         to: "HCM",
    //         toDetail: "Ho Chi Minh City",
    //         company: "VietJet Air",
    //         companyAbreviation: "VJ",
    //         price: 1000000,
    //         duration: "2h"
    //     },
    //     {
    //         departure: "2:00 PM",
    //         departureAirport: "Da Nang Airport",
    //         from: "DND",
    //         fromDetail: "Da Nang",
    //         arrive: "4:00 PM",
    //         arrivalAirport: "Tan Son Nhat Airport",
    //         to: "HCM",
    //         toDetail: "Ho Chi Minh City",
    //         company: "Bamboo Airways",
    //         companyAbreviation: "QH",
    //         price: 900000,
    //         duration: "2h"
    //     },
    //     {
    //         departure: "2:00 AM",
    //         departureAirport: "Da Nang Airport",
    //         from: "DND",
    //         fromDetail: "Da Nang",
    //         arrive: "3:30 AM",
    //         arrivalAirport: "Tan Son Nhat Airport",
    //         to: "HCM",
    //         toDetail: "Ho Chi Minh City",
    //         company: "VietJet Air",
    //         companyAbreviation: "VJ",
    //         price: 1500000,
    //         duration: "1h30m"
    //     },
    //     {
    //         departure: "2:00 AM",
    //         departureAirport: "Da Nang Airport",
    //         from: "DND",
    //         fromDetail: "Da Nang",
    //         arrive: "3:30 AM",
    //         arrivalAirport: "Tan Son Nhat Airport",
    //         to: "HCM",
    //         toDetail: "Ho Chi Minh City",
    //         company: "Vietravel Airlines",
    //         companyAbreviation: "VU",
    //         price: 1500000,
    //         duration: "1h30m"
    //     },
    //     {
    //         departure: "6:00 AM",
    //         departureAirport: "Da Nang Airport",
    //         from: "DND",
    //         fromDetail: "Da Nang",
    //         arrive: "8:30 AM",
    //         arrivalAirport: "Tan Son Nhat Airport",
    //         to: "HCM",
    //         toDetail: "Ho Chi Minh City",
    //         company: "Vietravel Airlines",
    //         companyAbreviation: "VU",
    //         price: 1500000,
    //         duration: "2h30m"
    //     },
    //     {
    //         departure: "6:00 AM",
    //         departureAirport: "Da Nang Airport",
    //         from: "DND",
    //         fromDetail: "Da Nang",
    //         arrive: "8:30 AM",
    //         arrivalAirport: "Tan Son Nhat Airport",
    //         to: "HCM",
    //         toDetail: "Ho Chi Minh City",
    //         company: "Pacific Airlines",
    //         companyAbreviation: "BL",
    //         price: 1500000,
    //         duration: "2h30m"
    //     },
    //     {
    //         departure: "9:00 PM",
    //         departureAirport: "Da Nang Airport",
    //         from: "DND",
    //         fromDetail: "Da Nang",
    //         arrive: "11:00 PM",
    //         arrivalAirport: "Tan Son Nhat Airport",
    //         to: "HCM",
    //         toDetail: "Ho Chi Minh City",
    //         company: "Pacific Airlines",
    //         companyAbreviation: "BL",
    //         price: 1200000,
    //         duration: "2h"
    //     },
    //     {
    //         departure: "2:00 AM",
    //         departureAirport: "Da Nang Airport",
    //         from: "DND",
    //         fromDetail: "Da Nang",
    //         arrive: "4:00 AM",
    //         arrivalAirport: "Noi Bai Airport",
    //         to: "HN",
    //         toDetail: "Ha Noi",
    //         company: "Vietravel Airlines",
    //         companyAbreviation: "VU",
    //         price: 1250000,
    //         duration: "2h"
    //     },
    //     {
    //         departure: "5:00 AM",
    //         departureAirport: "Noi Bai Airport", 
    //         from: "HN",
    //         fromDetail: "Ha Noi",
    //         arrive: "7:00 AM",
    //         arrivalAirport: "Tan Son Nhat Airport",
    //         to: "HCM",
    //         toDetail: "Ho Chi Minh City",
    //         company: "VietJet Air",
    //         companyAbreviation: "VJ",
    //         price: 1050000,
    //         duration: "2h"
    //     },
    //     {
    //         departure: "3:00 PM",
    //         departureAirport: "Noi Bai Airport",
    //         from: "HN",
    //         fromDetail: "Ha Noi",
    //         arrive: "7:00 PM",
    //         arrivalAirport: "Tan Son Nhat Airport",
    //         to: "HCM",
    //         toDetail: "Ho Chi Minh City",
    //         company: "VietJet Air",
    //         companyAbreviation: "VJ",
    //         price: 1100000,
    //         duration: "3h"
    //     },
    // ];



    // Lọc vé máy bay theo thông tin tìm kiếm
    // const ticketList = ticketData.filter(ticket => {
    //     const isFromToMatch = ticket.from === searchData.from && ticket.to === searchData.to;
    //     const isAirlineMatch = searchData.airline === "All" || ticket.companyAbreviation === searchData.airline;

    //     return isFromToMatch && isAirlineMatch;
    // });

    const [ticketList, setTicketList] = useState([]);
    const fetchFlight = async () => {
        try {

            const response = await flightService.getFlights(searchData);
            console.log('response', response);
            setTicketList(response);
        } catch (error) {
            console.error("Error while fetching flights", error);
        }
    }

    useEffect(() => {
        fetchFlight();
    }, []);

    return (
        <>
            <div style={{ background: "linear-gradient(to bottom, #2D82B5, #BCE6FF)" }} className="h-screen overflow-hidden">
                <FlightInformation flightInformation={searchData} />
                <TicketList tickets={ticketList} searchData={searchData} />
                <img src={FlightImage} alt="plane" className="absolute -top-16 -left-20 w-1/3"></img>
            </div>
        </>
    )
}

export default SelectFlight;