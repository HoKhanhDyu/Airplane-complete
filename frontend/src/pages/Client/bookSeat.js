import BookSeatHeader from "../../components/Client/book-seat/book-seat-header";
import SeatTable from "../../components/Client/book-seat/seat-table";
import FlightComponent from "../../assets/images/Client/book_seat/bg-plane.png";
import buyTicketService from "../../services/buyTicketService";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const BookSeat = () => {
    const location = useLocation();
    const flightInfo = location.state;
//     const seatsData = [
//         {
//             economySeats: [
//                 { seatRow: "1", seatNumber: "A", available: true },
//                 { seatRow: "1", seatNumber: "B", available: true },
//                 { seatRow: "1", seatNumber: "C", available: true },
//                 { seatRow: "1", seatNumber: "D", available: false },
//                 { seatRow: "1", seatNumber: "E", available: true },
//                 { seatRow: "1", seatNumber: "F", available: false },
//                 { seatRow: "2", seatNumber: "A", available: true },
//                 { seatRow: "2", seatNumber: "B", available: true },
//                 { seatRow: "2", seatNumber: "C", available: true },
//                 { seatRow: "2", seatNumber: "D", available: true },
//                 { seatRow: "2", seatNumber: "E", available: true },
//                 { seatRow: "2", seatNumber: "F", available: false },
//                 { seatRow: "3", seatNumber: "A", available: true },
//                 { seatRow: "3", seatNumber: "B", available: true },
//                 { seatRow: "3", seatNumber: "C", available: true },
//                 { seatRow: "3", seatNumber: "D", available: true },
//                 { seatRow: "3", seatNumber: "E", available: true },
//                 { seatRow: "3", seatNumber: "F", available: true },
//                 { seatRow: "4", seatNumber: "A", available: true },
//                 { seatRow: "4", seatNumber: "B", available: false },
//                 { seatRow: "4", seatNumber: "C", available: false },
//                 { seatRow: "4", seatNumber: "D", available: false },
//                 { seatRow: "4", seatNumber: "E", available: true },
//                 { seatRow: "4", seatNumber: "F", available: true },
//                 // { seatNumber: "5A", status: "available" },
//                 // { seatNumber: "5B", status: "available" },
//                 // { seatNumber: "5C", status: "available" },
//             ],
//             businessSeats: [
//                 { seatRow: "1", seatNumber: "A", available: true },
//                 { seatRow: "1", seatNumber: "B", available: true },
//                 { seatRow: "1", seatNumber: "C", available: false },
//                 { seatRow: "1", seatNumber: "D", available: true },
//                 { seatRow: "2", seatNumber: "A", available: false },
//                 { seatRow: "2", seatNumber: "B", available: false },
//                 { seatRow: "2", seatNumber: "C", available: true },
//                 { seatRow: "2", seatNumber: "D", available: false },
//                 { seatRow: "3", seatNumber: "A", available: true },
//                 { seatRow: "3", seatNumber: "B", available: true },
//                 { seatRow: "3", seatNumber: "C", available: false },
//                 { seatRow: "3", seatNumber: "D", available: true },
//             ] 
//         }
//     ];
    // const location = useLocation();
    // const flightInfo = location.state;

    // const seatsData = buyTicketService.getSeatOfFlight(18);
    const [seatsData, setSeatsData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await buyTicketService.getSeatOfFlight(flightInfo.flightID);

            setSeatsData(data);
        }
        fetchData();
    }, []);

    if (seatsData.length === 0) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div className="h-screen overflow-hidden" style={{background: "linear-gradient(to bottom, #2D82B5, #BCE6FF)"}}>
                <div className="flex justify-between">
                    <div className="container w-2/3 justify-center items-center">
                        <BookSeatHeader />
                        
                        <SeatTable seatsData={seatsData || []}/>
                    </div>
                    <div className="flex justify-end h-screen w-1/3">
                        <img src={FlightComponent} alt="bg" className="w-full" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default BookSeat;