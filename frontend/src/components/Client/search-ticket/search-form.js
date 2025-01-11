import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import airPortService from '../../../services/airportService';
import airLineService from '../../../services/airLineService';

const SearchForm = () => {
    // Cần update thêm các option cho địa điểm đi và địa điểm đến (chờ database)
    const navigate = useNavigate();
    const [passengers, setPassengers] = useState({
        adult: 1,       // Số lượng người lớn (Mặc định là 1)
        children: 0,    // Số lượng trẻ em
        infant: 0       // Số lượng em bé
    });

    const [showDropDown, setShowDropDown] = useState(false);
    const dropdownRef = useRef(null);

    // Hiển thị lỗi nếu chưa nhập đủ số liệu
    const [errorStatus, setErrorStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const totalPassengers = () => {
        return passengers.adult + passengers.children + passengers.infant;
    };

    const passengerText = totalPassengers() === 1 ? "1 passenger" : `${totalPassengers()} passengers`;

    const increasePassenger = (type, event) => {
        event.preventDefault();
        setPassengers({
            ...passengers,
            [type]: passengers[type] + 1
        });
    };

    const decreasePassenger = (type, event) => {
        event.preventDefault();
        setPassengers({
            ...passengers,
            [type]: type === 'adult' ? Math.max(1, passengers[type] - 1) : Math.max(0, passengers[type] - 1)
        })
    };

    const handleDropDown = (e) => {
        e.preventDefault();
        setShowDropDown(!showDropDown);
    };

    // Handle sự kiện khi click ra ngoài -> ẩn dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropDown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    const [city, setCity] = useState([]);
    const fetchCity = async () => {
        try {
            const response = await airPortService.getAirports();
            // console.log(response);
            setCity(response);
        } catch (error) {
            console.error("Error while fetching airports", error);
        }
    };

    const [airline, setAirline] = useState([]);
    const fetchAirline = async () => {
        try {
            const response = await airLineService.getAirlines();
            console.log(response);
            setAirline(response);
        } catch (error) {
            console.error("Error while fetching airlines", error);
        }
    };
    
    useEffect(() => {
        fetchCity();
        fetchAirline();
    }, []);
    const handleSearch = async (e) => {
        e.preventDefault();
        const from = document.getElementById('from').value;
        const to = document.getElementById('to').value;
        const departure = document.getElementById('departure').value;
        const type = document.getElementById('type').value;
        const airline = document.getElementById('airline').value === 'All' ? null : document.getElementById('airline').value;
        if (from === 'default') {
            setErrorStatus('from');
            setErrorMessage('Please select origin');
        }
        else if (to === 'default') {
            setErrorStatus('to');
            setErrorMessage('Please select destination');
        }
        else if (departure === '') {
            setErrorStatus('departure');
            setErrorMessage('Please select departure date');
        }
        else if (from === to) {
            setErrorStatus('to');
            setErrorMessage('Destination cannot be the same as origin');
        }
        else {
            const searchData = {
                from,
                to,
                departure,
                type,
                adult: passengers.adult,
                children: passengers.children,
                infant: passengers.infant,
                airline 
            };
            console.log(searchData);
            navigate('/select-flight', { state: searchData });
        }
    };

    return (
        <>
            <div className="flex flex-col mr-6 w-2/5 bg-white pb-12 border border-black rounded-tr-lg rounded-br-lg rounded bl-lg">
                <div className="flex items-center space-x-4 mt-4 mx-auto">
                    {/* <i className="fa-solid fa-plane-departure"></i> */}
                    <h2 className="text-2xl font-bold border-b-2 border-gray-400 pb-2">Booking</h2>
                </div>
                <p className="text-lg border-2 border-black p-1 rounded-full text-center my-4 w-1/6 bg-slate-300 ml-8">One-way</p>
                {/* <!--Booking Information--> */}
                <form onSubmit={handleSearch}>
                    <div className="space-y-6">
                        {/* <!--Destination--> */}
                        <div className="flex">
                            {/* <!--From--> */}
                            <div className="flex flex-col ml-5 mr-4 w-1/2">
                                <label className="text-sm font-bold ml-2">From</label>
                                <select name="from" id="from" className="text-gray-400 p-2 pr-4 rounded-lg appearance-none" style={{ border: errorStatus === 'from' ? '2px solid red' : '2px solid black' }} onClick={() => {
                                    if (errorStatus === 'from') {
                                        setErrorStatus(null);
                                        setErrorMessage('');
                                    }
                                }}>
                                    <option value="default">Select origin</option>

                                    {
                                        city.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.detail_name}</option>
                                            )
                                        })
                                    }
                                    {/* <option value="DND">Da Nang</option>
                                    <option value="HN">Ha Noi</option>
                                    <option value="HCM">Ho Chi Minh</option> */}
                                </select>
                                {errorStatus === 'from' && (<p className="text-sm text-red-500 ml-4">{errorMessage}</p>)}
                            </div>
                            {/* <!--To--> */}
                            <div className="flex flex-col ml-5 mr-4 w-1/2">
                                <label className="text-sm font-bold ml-2">To</label>
                                <select name="to" id="to" className="text-gray-400 p-2 pr-4 rounded-lg appearance-none" style={{ border: errorStatus === 'to' ? '2px solid red' : '2px solid black' }} onClick={() => {
                                    if (errorStatus === 'to') {
                                        setErrorStatus(null);
                                        setErrorMessage('');
                                    }
                                }}>
                                    <option value="default">Select destination</option>
                                    {
                                        city.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.detail_name}</option>
                                            )
                                        })
                                    }
                                    {/* <option value="DND">Da Nang</option>
                                    <option value="HN">Ha Noi</option>
                                    <option value="HCM">Ho Chi Minh</option> */}
                                </select>
                                {errorStatus === 'to' && (<p className="text-sm text-red-500 ml-4">{errorMessage}</p>)}
                            </div>
                        </div>

                        {/* <!--Departuree & Passengers--> */}
                        <div className="flex">
                            {/* <!--Departure--> */}
                            <div className="flex flex-col ml-5 mr-4 w-1/2">
                                <label className="text-sm font-bold ml-2">Departure</label>
                                <input type="date" id="departure" name="departure"
                                    className="text-gray-400 p-1.5 pr-4 border-2 border-black rounded-lg" style={{ border: errorStatus === 'departure' ? '2px solid red' : '2px solid black' }} onClick={() => {
                                        if (errorStatus === 'departure') {
                                            setErrorStatus(null);
                                            setErrorMessage('');
                                        }
                                    }} />
                                {errorStatus === 'departure' && (<p className="text-sm text-red-500 ml-4">{errorMessage}</p>)}
                            </div>
                            {/* <!--Passengers--> */}

                            {/* <!--Update add passsenger--> */}
                            <div className="flex flex-col ml-5 mr-4 w-1/2">
                                <label className="text-sm font-bold ml-2">Passenger</label>
                                <div className="relative" ref={dropdownRef}>
                                    <div className="h-full text-gray-400 p-2 pr-4 border-2 border-black rounded-lg" onClick={handleDropDown}>
                                        <div className='flex space-x-3 items-center'>
                                            <i className="fa-regular fa-user"></i>
                                            <p>{passengerText}</p>
                                        </div>
                                    </div>
                                    {showDropDown && (
                                        <div className="space-y-2 absolute top-full bg-white border-2 border-black rounded-lg w-full left-0 text-gray-400 px-2">
                                            {/* Adult */}
                                            <div className="flex justify-between items-center">
                                                <p>Adult (12+)</p>
                                                <div className='flex items-center space-x-2'>
                                                    <button onClick={(e) => decreasePassenger('adult', e)} className="text-xl font-bold">-</button>
                                                    <p>{passengers.adult}</p>
                                                    <button onClick={(e) => increasePassenger('adult', e)} className="text-xl font-bold">+</button>
                                                </div>
                                            </div>
                                            {/* Children */}
                                            <div className="flex justify-between items-center">
                                                <p>Children (2 - 11)</p>
                                                <div className='flex items-center space-x-2'>
                                                    <button onClick={(e) => decreasePassenger('children', e)} className="text-xl font-bold">-</button>
                                                    <p>{passengers.children}</p>
                                                    <button onClick={(e) => increasePassenger('children', e)} className="text-xl font-bold">+</button>
                                                </div>
                                            </div>
                                            {/* Infant */}
                                            <div className="flex justify-between items-center">
                                                <p>Infant (&lt; 2)</p>
                                                <div className='flex items-center space-x-2'>
                                                    <button onClick={(e) => decreasePassenger('infant', e)} className="text-xl font-bold">-</button>
                                                    <p>{passengers.infant}</p>
                                                    <button onClick={(e) => increasePassenger('infant', e)} className="text-xl font-bold">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* <!--Travel Class & Code--> */}
                        <div className="flex">
                            {/* <!--Travel Class--> */}
                            <div className="flex flex-col ml-5 mr-4 w-1/2">
                                <label className="text-sm font-bold ml-2">Travel Class</label>
                                <select name="type" id="type" defaultValue="economy" className="text-gray-400 p-2 pr-4 border-2 border-black rounded-lg appearance-none">
                                    <option value="economy">ECONOMY</option>
                                    <option value="business">BUSINESS</option>
                                </select>
                            </div>
                            {/* <!--Promotional Code--> */}
                            <div className="flex flex-col ml-5 mr-4 w-1/2">
                                <label className="text-sm font-bold ml-2">Airline</label>
                                <select id="airline" name="airline" className="text-gray-400 p-2 pr-4 border-2 border-black rounded-lg appearance-none">
                                    <option value="All">Select Airline</option>
                                    {
                                        airline.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            )
                                        })
                                    }
                                    {/* <option value="VN">Vietnam Airlines</option>
                                    <option value="VJ">VietJet Air</option>
                                    <option value="QH">Bamboo Airways</option>
                                    <option value="VU">Vietravel Airlines</option>
                                    <option value="BL">Pacific Airlines</option> */}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* <!--Search Button--> */}
                    <button type="submit"
                        className="flex justify-center items-center p-2 mt-16 bg-[#EC7070] space-x-2 border-2 border-black rounded-lg w-2/3 mx-auto hover:brightness-105 hover:shadow-lg">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <p>SEARCH</p>
                    </button>
                </form>
            </div>
        </>
    )
}

export default SearchForm;