

const CustomerPersonalDetail = ({ information, setIsEdit }) => {
    const { name, id, gender, dob, image, address, contact } = information;

    const handleUpdateClick = () => {
        setIsEdit('user');
    }

    return (
        <>
            <div className="flex justify-end mt-4 mr-16">
                <button onClick={handleUpdateClick} className="p-2 text-lg font-semibold text-blue-400 bg-white border-2 border-black rounded-lg hover:bg-blue-500 hover:text-white hover:scale-105 duration-300">Update Information</button>
            </div>
            <div className="pl-32">
                <div className="flex space-x-4 items-center mb-4">
                    <h2 className="text-xl font-semibold text-[#2F80ED]">Personal Details</h2>
                    <i class="fa-solid fa-user"></i>
                </div>
                {/* <!--Information--> */}
                <div className="flex space-x-6 mb-8">
                    <img src={image}
                        alt="img" className="rounded-lg" />
                    <div className="flex flex-col space-y-4">
                        <div>
                            <p className="text-sm font-bold text-gray-500">Name</p>
                            <p className="text-lg font-semibold">{name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">ID</p>
                            <p className="text-lg font-semibold">{id}</p>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Gender</p>
                            {gender ?
                                <p className="text-lg font-semibold">{gender}</p>
                                :
                                <p className="text-lg font-semibold">Not Available</p>
                            }
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Date of Birth</p>
                            {dob ?
                                <p className="text-lg font-semibold">{dob}</p>
                                :
                                <p className="text-lg font-semibold">Not Available</p>
                            }
                        </div>
                    </div>
                </div>
                {/* <!--Contact & Address--> */}
                <div className="flex space-x-24">
                    <div className="space-y-2">
                        <div className="flex space-x-4 items-center">
                            <h2 className="text-xl font-semibold text-[#2F80ED]">Address</h2>
                            <i class="fa-solid fa-location-dot"></i>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Address Line</p>
                            {address.street ?
                                <p className="text-lg font-semibold">{address.street}</p>
                                :
                                <p className="text-lg font-semibold">Not Available</p>
                            }
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">City</p>
                            {address.city ?
                                <p className="text-lg font-semibold">{address.city}</p>
                                :
                                <p className="text-lg font-semibold">Not Available</p>
                            }
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Country</p>
                            {address.country ?
                                <p className="text-lg font-semibold">{address.country}</p>
                                :
                                <p className="text-lg font-semibold">Not Available</p>
                            }
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex space-x-4 items-center">
                            <h2 className="text-xl font-semibold text-[#2F80ED]">Contact Details</h2>
                            <i class="fa-solid fa-address-book"></i>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Phone Number</p>
                            {contact.phone ?
                                <p className="text-lg font-semibold">{contact.phone}</p>
                                :
                                <p className="text-lg font-semibold">Not Available</p>
                            }
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Email</p>
                            {contact.email ?
                                <p className="text-lg font-semibold">{contact.email}</p>
                                :
                                <p className="text-lg font-semibold">Not Available</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomerPersonalDetail;