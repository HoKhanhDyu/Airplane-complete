import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContactForm from './getinfo-contact';


const GetInformationForm = ({ passengers, flightInformation }) => {
    const navigate = useNavigate();
    const [currentPassenger, setCurrentPassenger] = useState(0);
    const [isPrevActive, setIsPrevActive] = useState(false);
    const [isNextActive, setIsNextActive] = useState(true);
    const [passengerInfo, setPassengerInfo] = useState(
        Array.from({ length: passengers }, () => ({ firstName: '', lastName: '', gender: '', dob: '' }))
    );
    const [errors, setErrors] = useState({});
    const [notice, setNotice] = useState(false);
    const [noticeMessage, setNoticeMessage] = useState('');
    const [showContactForm, setShowContactForm] = useState(false);
    const [newFlightInformation, setNewFlightInformation] = useState({ ...flightInformation });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPassengerInfo((prevInfo) => {
            const newInfo = [...prevInfo];
            newInfo[currentPassenger][name] = value;
            return newInfo;
        });
    }

    const handleFocus = (e) => {
        const { name } = e.target;
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const updateButtonState = () => {
        setIsPrevActive(currentPassenger > 0);
        setIsNextActive(currentPassenger < passengers - 1);
    };

    const validateForm = (passenger) => {
        const newErrors = {};
        if (!passenger.firstName) {
            newErrors.firstName = 'Please enter your first name';
        }
        if (!passenger.lastName) {
            newErrors.lastName = 'Please enter your last name';
        }
        if (!passenger.gender || passenger.gender === 'default') newErrors.gender = 'Gender is required';
        if (!passenger.dob) newErrors.dob = 'Date of birth is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleNext = () => {
        if (validateForm(passengerInfo[currentPassenger])) {
            if (currentPassenger < passengers - 1) {
                setCurrentPassenger(currentPassenger + 1);
            }
            setErrors({});
        }
        console.log(passengerInfo);
    }

    const handlePrev = () => {
        if (currentPassenger > 0) {
            setCurrentPassenger(currentPassenger - 1);
        }
    };

    useEffect(() => {
        updateButtonState();
    }, [currentPassenger]);

    // Hiện Contact Form khi đã nhập thông tin hành khách
    const handleConfirm = () => {
        if (validateForm(passengerInfo[currentPassenger])) {
            if (currentPassenger === passengers - 1) {
                // Nếu hành khách hiện tại là người cuối cùng, hiển thị form Contact
                setShowContactForm(true);
                setNewFlightInformation({
                    ...flightInformation,
                    passengers: passengerInfo
                });
            } else {
                // Nếu chưa đến hành khách cuối, thông báo và chuyển sang hành khách tiếp theo
                setNotice(true);
                setNoticeMessage('Please fill in all required fields for all passengers');
            }
        } else {
            setNotice(true);
            setNoticeMessage('Please fill in all required fields for this passenger');
        }
    }

    const hiddenError = () => {
        setNotice(false);
    }

    const handleCancel = () => {
        navigate('/book-seat', { state: flightInformation });
    }

    // Handle sự kiện Back cho Contact Form
    const handleBack = () => {
        setShowContactForm(false);
    }

    return (
        <>
            {showContactForm ? (
                <ContactForm flightInformation={newFlightInformation} onBack={handleBack} />
            ) : (
                <div className='relative'>
                    <div className="items-center justify-center flex flex-col">
                        <h1 className="my-8 text-4xl text-white font-extrabold">Enter your information</h1>
                        {/* <!--Form--> */}
                        <div className='flex items-center space-x-8 bg-white border border-transparent rounded-lg px-20 py-4 w-2/3 mx-auto'>
                            <button onClick={handlePrev} className="text-2xl" style={{ cursor: isPrevActive ? "pointer" : "default", opacity: isPrevActive ? 1 : 0.5 }}>
                                <i className="fa-solid fa-angle-left"></i>
                            </button>
                            <form action="" className="w-10/12">
                                <h2 className="mx-auto text-center font-bold text-lg mb-4">Passenger {currentPassenger + 1}</h2>
                                <div className="flex flex-col mb-6">
                                    <label className="ml-4 text-sm font-medium">Middle name and First/given name (as in ID/Passport)
                                        <span className="text-red-600 text-lg">*</span></label>
                                    <input type="text" name='firstName' id='firstName' className={`px-4 py-1 border ${errors.firstName ? 'border-red-500' : 'border-black'} border-black rounded-md w-full text-gray-400`} value={passengerInfo[currentPassenger].firstName}
                                        onChange={handleChange}
                                        onFocus={handleFocus} />
                                    {errors.firstName && <p className='text-sm text-red-500'>{errors.firstName}</p>}
                                </div>
                                <div className="flex flex-col mb-6">
                                    <label className="ml-4 text-sm font-medium">Last/Family Name (as in passport) <span
                                        className="text-red-600 text-lg">*</span></label>
                                    <input type="text" name='lastName' id='lastName' className={`px-4 py-1 border ${errors.lastName ? 'border-red-500' : 'border-black'} rounded-md w-full text-gray-400`} value={passengerInfo[currentPassenger].lastName}
                                        onChange={handleChange}
                                        onFocus={handleFocus} />
                                    {errors.lastName && <p className='text-sm text-red-500'>{errors.lastName}</p>}
                                </div>
                                <div className="flex flex-col mb-6">
                                    <label className="ml-4 text-sm font-medium">Gender</label>
                                    <select name='gender' id='gender' className={`px-4 py-2 border ${errors.gender ? 'border-red-500' : 'border-black'} rounded-md w-full appearance-none text-gray-400`} value={passengerInfo[currentPassenger].gender}
                                        onChange={handleChange}
                                        onFocus={handleFocus}>
                                        <option value="default">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                    {errors.gender && <p className='text-sm text-red-500'>{errors.gender}</p>}
                                </div>
                                <div className="flex flex-col mb-6">
                                    <label className="ml-4 text-sm font-medium">Date of birth <span
                                        className="text-red-600 text-lg">*</span></label>
                                    <input type="date" name='dob' id='dob' className={`px-4 py-1 border ${errors.dob ? 'border-red-500' : 'border-black'} rounded-md w-full text-gray-400`} placeholder="mm/dd/yy" value={passengerInfo[currentPassenger].dob}
                                        onChange={handleChange}
                                        onFocus={handleFocus} />
                                    {errors.dob && <p className='text-sm text-red-500'>{errors.dob}</p>}
                                </div>
                            </form>
                            <button onClick={handleNext} className="text-2xl" style={{ cursor: isNextActive ? "pointer" : "default", opacity: isNextActive ? 1 : 0.5 }}>
                                <i className="fa-solid fa-angle-right"></i>
                            </button>
                        </div>
                    </div>

                    {/* <!--Cancel & Continue--> */}
                    <div className="flex justify-between my-8">
                        <button onClick={handleCancel} className="font-bold px-20 hover:text-red-400">CANCEL</button>
                        <button onClick={handleConfirm} className="font-bold px-12 hover:text-blue-400">CONFIRM</button>
                    </div>
                    {notice && (
                        <div className='fixed top-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
                            <div className='relative flex flex-col justify-center items-center space-y-10 bg-white p-12 rounded-lg'>
                                <div className='absolute top-4 right-4 cursor-pointer' onClick={hiddenError}>
                                    <i className="fa-solid fa-xmark text-xl hover:text-red-500"></i>
                                </div>
                                <div className='flex justify-center items-center border-4 border-red-500 rounded-full w-16 h-16'>
                                    <i className="fa-solid fa-exclamation text-4xl text-red-500"></i>
                                </div>
                                <p className='text-2xl font-medium'>{noticeMessage}</p>
                            </div>
                        </div>
                    )}
                </div>

            )}
        </>
    )
}

export default GetInformationForm;