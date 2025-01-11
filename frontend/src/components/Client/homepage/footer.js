

const HomeFooter = () => {
    return (
        <>
            <div className="bg-[#2D82B5] flex justify-between items-center px-14 py-8 mt-24">
                <div className="flex flex-col justify-center items-center">
                    <div className="flex items-center space-x-4">
                        <i className="fa-solid fa-paper-plane text-4xl text-white opacity-80"></i>
                        <div className="items-center text-center text-white">
                            <p className="text-xl font-semibold">AirPlane</p>
                            <p>Flight Management System</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <i className="fa-solid fa-comment text-3xl text-white opacity-50 hover:opacity-100 hover:scale-105 duration-300"></i>
                        <i className="fa-solid fa-envelope text-3xl text-white opacity-50 hover:opacity-100 hover:scale-105 duration-300"></i>
                    </div>
                </div>
                <div className="w-1/6 text-white">
                    <p className="text-lg cursor-pointer hover:text-lime-500">LEGAL NOTICES DATA PROTECTION POLICY</p>
                </div>
                <div className="w-1/6">
                    <p className="text-lg text-white">Airport services to accompany you at every stage of your journey.</p>
                </div>
            </div>
        </>
    )
}

export default HomeFooter;