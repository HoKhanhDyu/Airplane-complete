import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const SeatTable = ({ seatsData }) => {
    useEffect(() => {
        console.log(seatsData);
    }, [seatsData]);
    const { businessSeats, economySeats } = seatsData[0];
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [error, setError] = useState('');
    const [errorMessage, setErrorMessage] = useState();

    const navigate = useNavigate();
    const location = useLocation();
    const flightInformation = location.state;
    const passengers = flightInformation.adult + flightInformation.children + flightInformation.infant;

    useEffect(() => {

        console.log(flightInformation);
        if (flightInformation && flightInformation.customerSeats) {
            const initialSelectedSeats = flightInformation.customerSeats.map(seat => `${flightInformation.type}-${seat.seatID}`);
            // console.log('Test Seats init', initialSelectedSeats);
            setSelectedSeats(initialSelectedSeats);
        }
        // console.log('Test Seats 2', selectedSeats);
    }, []);

    // Handle click on seat
    const toggleSeatSelection = (seatClass, seatNumber, seatRow, seatID = 10) => {
        if (seatClass !== flightInformation.type) {
            setError('seat');
            setErrorMessage('Please select the correct seat class');
            setTimeout(() => {
                setError('');
            }, 2000);
            return;
        }
        setSelectedSeats((prevSelectedSeats) => {
            const seatId = `${seatClass}-${seatRow}${seatNumber}`; // Định danh duy nhất cho ghế
            if (prevSelectedSeats.includes(seatId)) {
                // Nếu ghế đã được chọn, loại bỏ nó
                return prevSelectedSeats.filter((seat) => seat !== seatId);
            } else {
                // Nếu ghế chưa được chọn, thêm vào danh sách
                if (prevSelectedSeats.length < passengers) {
                    return [...prevSelectedSeats, seatId];
                } else {
                    setError('more');
                    setErrorMessage('You cannot select more seats than the number of passengers');
                    setTimeout(() => {
                        setError('');
                    }, 2000);
                    return prevSelectedSeats;
                }
            }
        });
        console.log("Chosen Seats: ",selectedSeats);
    };

    const isSeatSelected = (seatClass, seatNumber, seatRow) => {
        if (seatClass !== flightInformation.type) {
            return false;
        }
        const seatId = `${seatClass}-${seatRow}${seatNumber}`;
        return selectedSeats.includes(seatId);
    };

    // Kiểm tra và báo lỗi nếu chưa chọn ghế
    const handleError = () => {
        // console.log('check seats:', selectedSeats);
        if (selectedSeats.length === 0) {
            setError('submit');
            setErrorMessage('Please select at least one seat');
        }
        else if (selectedSeats.length !== passengers) {
            setError('submit');
            setErrorMessage('Please select enough seats for all passengers');
        }
        else {
            setError('');
            handleContinue();
        }
    }

    const hiddenError = () => {
        setError('');
    }

    const handleContinue = () => {
        const customerSeats = selectedSeats.map((seat) => {
            const [seatClass, seatDetail] = seat.split("-");
            const seatID = seatDetail;
            return { seatID };
        });
        // console.log('Test Seats 1', customerSeats);
        const newFlightInformation = { ...flightInformation, customerSeats };
        console.log('Test info', newFlightInformation);

        navigate('/customer-information', { state: newFlightInformation });
    }

    const handleCancel = () => {
        navigate('/select-type', { state: flightInformation });
    }
    return (
        <>
            {/* <!--Booking Seat--> */}
            <div className="flex flex-col w-full">
                <div className="flex flex-col justify-center items-center ml-8">
                    <h1 className="text-4xl text-white font-bold my-8">Select Your Seats</h1>
                    {/* <!--Seat Map--> */}
                    <div
                        className="pt-8 px-8 mx-auto bg-white border-2 border-black rounded-lg w-2/3 space-y-8 overflow-y-scroll max-h-[430px] scroll-smooth seat-map-container">
                        {/* <!--Business Class--> */}
                        {(error === 'seat' || error === 'more') && (
                            <div className="flex items-center justify-center space-x-2">
                                <i className="fa-solid fa-triangle-exclamation text-yellow-700"></i>
                                <p className="text-center text-yellow-700 font-bold">{errorMessage}</p>
                            </div>
                        )}
                        <div className="flex flex-col space-y-6">
                            <h1 className="text-xl font-bold border-b-2 border-black w-1/3 text-center">Bussiness Seats</h1>
                            <div className="flex flex-col justify-center items-center ">
                                {businessSeats.reduce((acc, seat) => {
                                    const lastRow = acc[acc.length - 1]; // Lấy hàng ghế cuối cùng được thêm vào
                                    if (!lastRow || lastRow[0][0].seatRow !== seat.seatRow) {
                                        acc.push([[], []]); // Tạo hàng mới gồm 2 dãy (mỗi dãy là một mảng con)
                                    }
                                    const currentRow = acc[acc.length - 1];

                                    if (currentRow[0].length < 2) {
                                        currentRow[0].push(seat); // Thêm vào dãy bên trái
                                    } else {
                                        currentRow[1].push(seat); // Thêm vào dãy bên phải
                                    }

                                    return acc;
                                }, []).map((row, rowIndex) => (
                                    <div className="flex flex-col mb-4 w-4/5" key={rowIndex}>
                                        <div className="flex items-center mb-2 space-x-6">
                                            <div className="flex items-center">
                                                <p className="text-xl font-bold">{row[0][0]?.seatRow || row[1][0]?.seatRow}</p>
                                            </div>
                                            <div className="flex justify-between w-full">
                                                {/* Dãy bên trái */}
                                                <div className="flex space-x-10">
                                                    {row[0].map((seat, seatIndex) => (
                                                        <p
                                                            key={seatIndex}
                                                            className={`border px-4 py-2 rounded-lg ${seat.available
                                                                ? isSeatSelected("business", seat.seatNumber, seat.seatRow)
                                                                    ? "bg-green-500 text-white cursor-pointer"
                                                                    : "bg-transparent text-black border border-black cursor-pointer"
                                                                : "bg-red-500 text-white"
                                                                }`}
                                                            onClick={() => seat.available && toggleSeatSelection("business", seat.seatNumber, seat.seatRow)}
                                                        >
                                                            {seat.seatNumber}
                                                        </p>
                                                    ))}
                                                </div>
                                                {/* Dãy bên phải */}
                                                <div className="flex space-x-10">
                                                    {row[1].map((seat, seatIndex) => (
                                                        <p
                                                            key={seatIndex}
                                                            className={`border px-4 py-2 rounded-lg ${seat.available
                                                                ? isSeatSelected("business", seat.seatNumber, seat.seatRow)
                                                                    ? "bg-green-500 text-white cursor-pointer"
                                                                    : "bg-transparent text-black border border-black cursor-pointer"
                                                                : "bg-red-500 text-white"
                                                                }`}
                                                            onClick={() => seat.available && toggleSeatSelection("business", seat.seatNumber, seat.seatRow)}
                                                        >
                                                            {seat.seatNumber}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        </div>
                        {/* <!--Economy Class--> */}
                        <div className="flex flex-col space-y-6">
                            <h1 className="text-xl font-bold border-b-2 border-black w-1/3 text-center">Economy Seats</h1>
                            <div className="flex flex-col justify-center items-center ">
                                {economySeats.reduce((acc, seat) => {
                                    const lastRow = acc[acc.length - 1]; // Lấy hàng ghế cuối cùng được thêm vào
                                    if (!lastRow || lastRow[0][0].seatRow !== seat.seatRow) {
                                        acc.push([[], []]); // Tạo hàng mới gồm 2 dãy (mỗi dãy là một mảng con)
                                    }
                                    const currentRow = acc[acc.length - 1];

                                    if (currentRow[0].length < 3) {
                                        currentRow[0].push(seat); // Thêm vào dãy bên trái
                                    } else {
                                        currentRow[1].push(seat); // Thêm vào dãy bên phải
                                    }

                                    return acc;
                                }, []).map((row, rowIndex) => (
                                    <div className="flex flex-col mb-4 w-full" key={rowIndex}>
                                        <div className="flex items-center mb-2 space-x-6">
                                            <div className="flex items-center">
                                                <p className="text-xl font-bold">{row[0][0]?.seatRow || row[1][0]?.seatRow}</p>
                                            </div>
                                            <div className="flex justify-between w-full">
                                                {/* Dãy bên trái */}
                                                <div className="flex space-x-10">
                                                    {row[0].map((seat, seatIndex) => (
                                                        <p
                                                            key={seatIndex}
                                                            className={`border px-4 py-2 rounded-lg ${seat.available
                                                                ? isSeatSelected("economy", seat.seatNumber, seat.seatRow)
                                                                    ? "bg-green-500 text-white cursor-pointer"
                                                                    : "bg-transparent text-black border border-black cursor-pointer"
                                                                : "bg-red-500 text-white"
                                                                }`}
                                                            onClick={() => seat.available && toggleSeatSelection("economy", seat.seatNumber, seat.seatRow)}
                                                        >
                                                            {seat.seatNumber}
                                                        </p>
                                                    ))}
                                                </div>
                                                {/* Dãy bên phải */}
                                                <div className="flex space-x-10">
                                                    {row[1].map((seat, seatIndex) => (
                                                        <p
                                                            key={seatIndex}
                                                            className={`border px-4 py-2 rounded-lg ${seat.available
                                                                ? isSeatSelected("economy", seat.seatNumber, seat.seatRow)
                                                                    ? "bg-green-500 text-white cursor-pointer"
                                                                    : "bg-transparent text-black border border-black cursor-pointer"
                                                                : "bg-red-500 text-white"
                                                                }`}
                                                            onClick={() => seat.available && toggleSeatSelection("economy", seat.seatNumber, seat.seatRow)}
                                                        >
                                                            {seat.seatNumber}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center mt-6 ml-16 mb-2">
                <ul className="text-base font-medium list-disc space-y-4">
                    <li>Please log in to buy tickets to earn points and receive many incentives.</li>
                    <li>Check information, choose seat before payment</li>
                </ul>
            </div>
            {/* <!--Continue--> */}
            <div className="flex justify-between mt-6">
                <button className="font-bold px-20 hover:text-red-400" onClick={handleCancel}>CANCEL</button>
                <button className="font-bold px-12 hover:text-blue-400" onClick={handleError}>CONFIRM AND CONTINUE</button>
            </div>

            {/* <!--Error Message--> */}
            {error === 'submit' && (
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

export default SeatTable;