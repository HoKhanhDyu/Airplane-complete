import { useEffect, useState } from 'react';
import TicketType from './ticket-type';
import { useLocation, useNavigate } from "react-router-dom";

const TypeList = ({ ticketTypeList }) => {
    const perPage = 3;
    const [currentPage, setCurrentPage] = useState(1);
    const [isPrevActive, setIsPrevActive] = useState(false);
    const [isNextActive, setIsNextActive] = useState(true);
    const [error, setError] = useState(false);
    const errorMessage = 'Please select a ticket type before continuing';
    const [selectedType, setSelectedType] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const flightInformation = location.state;

    const indexOfLast = Math.min(currentPage * perPage, ticketTypeList.length);
    const indexOfFirst = (currentPage - 1) * perPage;

    const currentType = ticketTypeList.slice(indexOfFirst, indexOfLast);

    const updateButtonState = () => {
        setIsPrevActive(currentPage > 1);
        setIsNextActive(currentPage < Math.ceil(ticketTypeList.length / perPage));
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(ticketTypeList.length / perPage)) {
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

    const handleErrorConfirm = () => {
        if (selectedType === null) {
            setError(true);
        }
        else {
            const newFlightInformation = {
                ...flightInformation,
                additional: selectedType.additionalExpense,
                feature: {
                    baggage: selectedType.feature.baggage,
                    refundable: selectedType.feature.refundable,
                    food: selectedType.feature.food
                }
            }
            console.log(newFlightInformation);
            navigate("/book-seat", { state: newFlightInformation });
            setError(false);
        }
    }

    const hiddenError = () => {
        setError(false);
    }

    const handleCancel = () => {
        navigate("/select-flight", { state: flightInformation });
    }

    return (
        <>
            <div className="flex justify-center items-center space-x-8">
                <button className="text-2xl" onClick={handlePrevPage} style={{ cursor: isPrevActive ? "pointer" : "default", opacity: isPrevActive ? 1 : 0.5 }}><i className="fa-solid fa-angle-left"></i></button>
                <div className="flex justify-center space-x-12 mt-12 w-3/4">
                    {currentType.map((type, index) => (
                        <div key={index} className="flex justify-center items-center">
                            <TicketType type={type}
                                onClick={() => setSelectedType(type)}
                                isSelected={selectedType === type} />
                        </div>
                    ))}
                </div>
                <button className="text-2xl" onClick={handleNextPage} style={{ cursor: isNextActive ? "pointer" : "default", opacity: isNextActive ? 1 : 0.5 }}><i className="fa-solid fa-angle-right"></i></button>
            </div>
            <div className="flex justify-between mt-8">
                <button className="font-bold px-20 hover:text-red-400" onClick={handleCancel}>CANCEL</button>
                <button className="font-bold px-12 hover:text-blue-400" onClick={handleErrorConfirm}>CONFIRM AND CONTINUE</button>
            </div>
            {error && (
                <div className='fixed top-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
                    <div className='relative flex flex-col justify-center items-center space-y-10 bg-white p-12 rounded-lg'>
                        <div className='absolute top-4 right-4 cursor-pointer' onClick={hiddenError}>
                            <i className="fa-solid fa-xmark text-xl hover:text-red-500"></i>
                        </div>
                        <div className='flex justify-center items-center border-4 border-red-500 rounded-full w-16 h-16'>
                            <i className="fa-solid fa-exclamation text-4xl text-red-500"></i>
                        </div>
                        <p className='text-2xl font-medium'>{errorMessage}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default TypeList;