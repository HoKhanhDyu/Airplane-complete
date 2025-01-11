import CustomerPersonalDetail from "../../components/Client/customerAccount/customer-personal-detail";
import CustomerAccountHeader from "../../components/Client/customerAccount/customer-account-header";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Box, Typography, Button, TextField, MenuItem } from '@mui/material';
import { useEffect } from 'react';
import ticketService from '../../services/ticketService';
import userServices from "../../services/userServices";

const CustomerAccount = () => {
    // const customerData = {
    //     name: 'Brad Pitt',
    //     id: '123456',
    //     username: 'bradpitt123',
    //     gender: 'Male',
    //     dob: '1963-12-18',
    //     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCC8BjLBMPtHE5MPlTR6xNRQYI3L9kcSQNpQ&s",
    //     address: {
    //         street: "1234 Hollywood Blvd",
    //         city: "Los Angeles",
    //         country: "USA",
    //     },
    //     contact: {
    //         phone: "123-456-7890",
    //         email: "bradpitt@gmail.com"
    //     }
    // };


    const [customerData, setCustomerData] = useState({});


    const [historyTicketData, setHistoryTicketData] = useState([]);

    const fetchHistoryTicketData = async () => {
        try {
            console.log("Fetching tickets");
            const data = await ticketService.getUserTickets();
            console.log(data);
            setHistoryTicketData(data);
        } catch (error) {
            console.error("Error while fetching tickets", error);
        }

    };



    // const historyTicketData = [
    //     {
    //         bookingCode: 'ABCDEF',
    //         departure: 'Da Nang',
    //         arrive: 'Ho Chi Minh',
    //         departureDate: '2022-12-12',
    //         flightCode: 'VJ123',
    //         seat: '1A',
    //         type: 'Economy',
    //     },
    //     {
    //         bookingCode: 'FHVXST',
    //         departure: 'Da Nang',
    //         arrive: 'Ho Chi Minh',
    //         departureDate: '2022-12-12',
    //         flightCode: 'VJ123',
    //         seat: '3A',
    //         type: 'Economy',
    //     },
    //     {
    //         bookingCode: 'WAFVCX',
    //         departure: 'Ha Noi',
    //         arrive: 'Dak Lak',
    //         departureDate: '2022-12-12',
    //         flightCode: 'VJ123',
    //         seat: '3A',
    //         type: 'Economy',
    //     },
    //     {
    //         bookingCode: 'QUYOJC',
    //         departure: 'Dak Lak',
    //         arrive: 'Ho Chi Minh',
    //         departureDate: '2022-12-12',
    //         flightCode: 'VJ123',
    //         seat: '3A',
    //         type: 'Business',
    //     },
    // ]

    const [isSelect, setIsSelect] = useState('account');
    const [isEdit, setIsEdit] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState();
    
    const fetchCustomerData = async () => {
        try {
            const data = await userServices.getCusTomerInfo();
            console.log(data);
            setFormData(data);
            setCustomerData(data);
        } catch (error) {
            console.error("Error while fetching customer data", error);

        }
    };

    useEffect(() => {
        fetchHistoryTicketData();
        fetchCustomerData();
    }, []);

    if (!formData) {
        return <div>Loading...</div>;
    }

    const handleSelect = (value) => {
        setIsSelect(value);
    }

    const handleCloseDialog = () => {
        setIsEdit('');
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({
            ...prev,
            image: file,
        }));
        // Set image preview for the selected file
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const confirmDeleteTicket = () => {
        setIsEdit('ticket');
    };

    const handleDeleteTicket = () => {
        // Gọi API để xóa vé máy bay
        setIsEdit('');
    };

    const handleSendChangeInformation = () => {
        // Gọi API để thay đổi thông tin
    };

    return (
        <>
            <div className="bg-white flex h-screen relative">
                <div className="flex w-full">
                    <div className="w-1/4">
                        <div className="flex flex-col bg-[#4A7087] pt-14 px-4 h-screen text-white space-y-12">
                            <h1 className='text-3xl text-center font-bold'>CUSTOMER</h1>
                            <div className='flex flex-col space-y-2'>
                                <h2 className='text-2xl font-bold'>GENERAL INFORMATION</h2>
                                <div className='flex flex-col ml-6 space-y-2'>
                                    <Link to={'/customer/homepage'}><button className='text-medium hover:text-rose-400 hover:scale-105 duration-300'>Homepage</button></Link>
                                    <button onClick={() => { handleSelect('history') }} className={`${isSelect === 'history' ? "text-rose-400 scale-105" : ""} text-left text-medium hover:text-rose-400 hover:scale-105 duration-300`}>Ticket purchase history</button>
                                    <Link to={'/search-ticket'}><button className='text-medium hover:text-rose-400 hover:scale-105 duration-300'>Buy ticket</button></Link>
                                </div>
                            </div>
                            <div className='flex flex-col space-y-2'>
                                <h2 className='text-2xl font-bold'>ACCOUNT</h2>
                                <div className='flex flex-col ml-6 space-y-2'>
                                    <Link to={'/customer-information'}><button onClick={() => { handleSelect('account') }} className={`${isSelect === 'account' ? "text-rose-400 scale-105" : ""} text-medium hover:text-rose-400 hover:scale-105 duration-300`}>Account Information</button></Link>
                                    <Link to={'/'}><button className='text-medium hover:text-rose-400 hover:scale-105 duration-300'>Log out</button></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-3/4">
                        <CustomerAccountHeader customer={customerData} />
                        {isSelect === 'account' &&
                            <CustomerPersonalDetail information={customerData} setIsEdit={setIsEdit} />
                        }
                        {isSelect === 'history' &&
                            <div className="flex justify-center mx-auto mt-12 w-5/6 border border-[#4A7087] rounded-lg">
                                {/* <p className="text-3xl text-[#2F80ED]">Ticket Purchase History</p> */}
                                <table className="w-full overflow-hidden border-collapse rounded-lg">
                                    <thead className="bg-[#4A7087] border-2 border-[#4A7087] text-lg text-white font-semibold">
                                        <tr>
                                            <th className="px-2 py-2">No</th>
                                            <th className="px-2 py-2">Booking Code</th>
                                            <th className="px-2 py-2">Departure</th>
                                            <th className="px-2 py-2">Arrival</th>
                                            <th className="px-2 py-2">Departure Date</th>
                                            <th className="px-2 py-2">Flight Code</th>
                                            <th className="px-2 py-2">Seat</th>
                                            <th className="px-2 py-2">Type</th>
                                            {/* <th className="px-2 py-2">Edit</th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {historyTicketData.map((ticket, index) => (
                                            <tr key={index} className="text-center">
                                                <td className="px-2 py-2">{index + 1}</td>
                                                <td className="px-2 py-2">{ticket.bookingCode}</td>
                                                <td className="px-2 py-2">{ticket.departure}</td>
                                                <td className="px-2 py-2">{ticket.arrive}</td>
                                                <td className="px-2 py-2">{ticket.departureDate}</td>
                                                <td className="px-2 py-2">{ticket.flightCode}</td>
                                                <td className="px-2 py-2">{ticket.seat}</td>
                                                <td className="px-2 py-2">{ticket.type}</td>
                                                {/* <td className="px-2 py-2"><i className="fa-solid fa-trash-can cursor-pointer hover:text-red-400" onClick={confirmDeleteTicket}></i></td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {isEdit === 'user' && (
                <div className="absolute top-0 bg-gray-500 bg-opacity-50 h-screen w-full">
                    <div className="relative bg-white w-1/2 h-5/6 mx-auto mt-20 px-8 py-4 rounded-lg overflow-y-scroll edit-customer">
                        <button onClick={handleCloseDialog} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">X</button>
                        <h1 className="text-center text-2xl font-bold text-blue-400 mb-10">UPDATE INFORMATION</h1>
                        <form>
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                style={{
                                    width: '80%', // Khung preview rộng hơn
                                    maxWidth: '500px', // Đảm bảo không quá lớn
                                    aspectRatio: '16/9', // Cố định tỉ lệ khung
                                    border: '2px dashed #ccc',
                                    borderRadius: '10px',
                                    backgroundColor: '#EDEDED',
                                    margin: 'auto',
                                    marginBottom: '20px',
                                    overflow: 'hidden',
                                }}
                            >
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Product Preview"
                                        style={{
                                            width: 'auto',
                                            height: '100%', // Fit ảnh theo chiều cao
                                            objectFit: 'contain',
                                        }}
                                    />
                                ) : (
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        style={{ textAlign: 'center', fontSize: 25, padding: '10px', width: '100%' }}
                                    >
                                        No image selected
                                    </Typography>
                                )}
                            </Box>
                            {/* Image Upload */}
                            <Box mt={2} display="flex" justifyContent="center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    id="product-image-upload"
                                />
                                <label htmlFor="product-image-upload">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        sx={{
                                            borderColor: '#B97A04',
                                            color: '#B97A04',
                                            '&:hover': {
                                                borderColor: '#B97A04',
                                                backgroundColor: '#FFE6CD',
                                            },
                                        }}
                                    >
                                        Browse
                                    </Button>
                                </label>
                            </Box>

                            {/* Product Fields */}
                            <TextField
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="ID"
                                name="id"
                                value={formData.id}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                                disabled
                            />
                            <TextField
                                select
                                label="Gender"
                                name="gender"
                                value={formData.gender.toLowerCase()}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            >
                                <MenuItem key={"male"} value={"male"}>Male</MenuItem>
                                <MenuItem key={"female"} value={"female"}>Female</MenuItem>
                            </TextField>
                            <TextField
                                label="DOB"
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Address Line"
                                name="address"
                                type="text"
                                value={formData.address.street}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="City"
                                name="city"
                                type="text"
                                value={formData.address.city}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Country"
                                name="country"
                                type="text"
                                value={formData.address.country}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Phone Number"
                                name="phone"
                                type="text"
                                value={formData.contact.phone}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Email"
                                name="email"
                                type="text"
                                value={formData.contact.email}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                            <Button
                                variant="outlined"
                                onClick={handleSendChangeInformation}
                                sx={{
                                    borderColor: '#B97A04',
                                    color: '#B97A04',
                                    '&:hover': {
                                        borderColor: '#B97A04',
                                        backgroundColor: '#FFE6CD',
                                    },
                                    margin: '20px 0',
                                }}
                            >
                                Save Change
                            </Button>
                        </form>
                    </div>

                </div>
            )}

            {isEdit === 'ticket' && (
                <div className="absolute top-0 bg-gray-500 bg-opacity-50 h-screen w-full">
                    <div className="relative bg-white w-3/5 mx-auto mt-40 p-12 rounded-lg">
                        <button onClick={handleCloseDialog} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">X</button>
                        <div className="flex flex-col justify-center items-center space-y-4">
                            <i className="fa-solid fa-exclamation text-4xl font-bold text-red-500 p-4 border-4 border-red-500 rounded-full"></i>
                            <p className="text-xl font-bold text-red-500">Are you sure you want to delete this ticket? This action cannot be undone</p>
                        </div>
                        <div className="flex justify-center items-center space-x-4 mt-12">
                            <button onClick={handleDeleteTicket} className="text-xl text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">Yes</button>
                            <button onClick={handleCloseDialog} className="text-xl text-white bg-[#4A7087] px-4 py-2 rounded-lg hover:bg-[#2F80ED]">No</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CustomerAccount;