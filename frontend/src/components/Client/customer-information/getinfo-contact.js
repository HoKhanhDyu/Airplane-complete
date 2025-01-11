import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import buyTicketService from '../../../services/buyTicketService';

const ContactForm = ({ flightInformation, onBack }) => {
    const [errors, setErrors] = useState({});
    const [notice, setNotice] = useState('');
    const navigate = useNavigate();

    const validateContactForm = () => {
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const newErrors = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!phoneNumber) {
            newErrors.phoneNumber = 'Phone Number is required';
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            newErrors.phoneNumber = 'Phone Number is invalid';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleFocus = (e) => {
        const { name } = e.target;
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const hiddenError = () => {
        setNotice('');
    }

    // Random code máy bay
    const generateRandomCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateContactForm()) {
            setNotice('Please fill all required information');
        }
        else {
            setNotice('');
            const newFlightInformation = {
                ...flightInformation,
                contactInfo: {
                    email: document.getElementById('email').value,
                    phoneNumber: document.getElementById('phoneNumber').value,
                },
                bookingCode: generateRandomCode(),
            }

            // Tạm thời chuyển sang trang show-ticket do chưa gọi đc API Payment

            const list_ticket = ( 
                newFlightInformation.customerSeats.map((item, index) => ({
                    seat_id: item.seatID, 
                    ...newFlightInformation.passengers[index], 
                    email: newFlightInformation.contactInfo.email, 
                    phoneNumber: newFlightInformation.contactInfo.phoneNumber,
                    ticket_type_id: 1
                }))
            ); 

            const buy_ticket_info = {
                flight_id: newFlightInformation.flightID,
                booking_code: newFlightInformation.bookingCode,
                ticket: list_ticket,
                additional: newFlightInformation.additional,
                seat_type: newFlightInformation.type,
            }
            console.log('buy_ticket_info', buy_ticket_info);

            const res = await buyTicketService.bookTicket(buy_ticket_info);
            newFlightInformation.invoice = res;
            console.log('res', res);
            const flightInfo = {
                ...newFlightInformation,
                invoice: res
            }
            navigate('/show-ticket', { state: flightInfo });
            console.log('info',newFlightInformation);
        }
    }

    return (
        <>
            <div className="flex flex-col h-4/6 space-y-10 items-center">
                <h1 className="my-8 text-4xl text-white font-extrabold">Enter your information</h1>
                <div className="relative items-center space-x-8 space-y-8 bg-white border border-transparent rounded-lg px-20 pt-10 pb-14 w-1/2 mx-auto">
                    <h1>This Contact info will be used to process and store this booking</h1>
                    <form className="space-y-6">
                        <div>
                            <label className="ml-4 text-sm font-medium">Email: <span className="text-red-600 text-lg">*</span></label>
                            <input type="email" name="email" id="email" className={`px-4 py-2 border ${errors.email ? "border-red-500" : "border-black"} rounded-md w-full text-gray-400`} onFocus={handleFocus}/>
                            {errors.email && <p className="text-red-500 text-sm ml-4">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="ml-4 text-sm font-medium">Phone Number: <span className="text-red-600 text-lg">*</span></label>
                            <input type="phone" name="phoneNumber" id="phoneNumber" className={`px-4 py-2 border ${errors.phoneNumber ? "border-red-500" : "border-black"} rounded-md w-full text-gray-400`} onFocus={handleFocus}/>
                            {errors.phoneNumber && <p className="text-red-500 text-sm ml-4">{errors.phoneNumber}</p>}
                        </div>
                    </form>
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 py-2 px-2 text-xl bg-[#FFBD00] rounded-lg">CONTACT INFORMATION</div>
                </div>
                {notice !== '' && (
                    <div className='fixed top-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
                        <div className='relative flex flex-col justify-center items-center space-y-10 bg-white p-12 rounded-lg'>
                            <div className='absolute top-4 right-4 cursor-pointer' onClick={hiddenError}>
                                <i className="fa-solid fa-xmark text-xl hover:text-red-500"></i>
                            </div>
                            <div className='flex justify-center items-center border-4 border-red-500 rounded-full w-16 h-16'>
                                <i className="fa-solid fa-exclamation text-4xl text-red-500"></i>
                            </div>
                            <p className='text-2xl font-medium'>{notice}</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-between my-8">
                <button onClick={onBack} className="font-bold px-20 hover:text-red-400">BACK</button>
                <button onClick={handleSubmit} className="font-bold px-12 hover:text-blue-400">CONFIRM AND CONTINUE</button>
            </div>
        </>
    )
}

export default ContactForm;