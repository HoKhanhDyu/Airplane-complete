import FlightTicket from "./flight-ticket";
import { useState, useEffect } from "react";

const TicketList = ({ tickets, searchData }) => { 
    // Giới hạn tối đa 4 vé trong cùng 1 page
    const maxTicketsPerPage = 4;
    const [currentPage, setCurrentPage] = useState(1);
    const [isPrevActive, setIsPrevActive] = useState(false);
    const [isNextActive, setIsNextActive] = useState(true);

    const indexOfLastTicket = Math.min(currentPage * maxTicketsPerPage, tickets.length);
    const indexOfFirstTicket = (currentPage - 1) * maxTicketsPerPage;/*indexOfLastTicket - maxTicketsPerPage;*/

    const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);

    const updateButtonState = () => {
        setIsPrevActive(currentPage > 1);
        setIsNextActive(currentPage < Math.ceil(tickets.length / maxTicketsPerPage));
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(tickets.length / maxTicketsPerPage)) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    useEffect(() => {
        updateButtonState();
    }, [currentPage]);

    return (
        <>
            <div className="flex justify-center items-center space-y-10 space-x-10">
                <button className="text-2xl" onClick={handlePrevPage} style={{cursor: isPrevActive ? "pointer" : "default", opacity: isPrevActive ? 1 : 0.5}}><i className="fa-solid fa-angle-left"></i></button>
                <div className="grid grid-cols-2 gap-6 w-2/3">
                    {currentTickets.map((ticket, index) => (
                        <div key={index} className="flex justify-center items-center">
                            <FlightTicket ticket={ticket} flightInfor={searchData} />
                        </div>
                    ))}
                </div>
                <button className="text-2xl" onClick={handleNextPage} style={{cursor: isNextActive ? "pointer" : "default", opacity: isNextActive ? 1 : 0.5}}><i className="fa-solid fa-angle-right"></i></button>
            </div>
        </>
    )
}

export default TicketList;