import StraightLine from '../../../assets/images/Client/select_flight/line.svg';

const FlightInformation = ({ flightInformation }) => {
    const totalPassengers = flightInformation.adult + flightInformation.children + flightInformation.infant;

    return (
        <>
            <div className="relative w-1/2 mx-auto">
                <div className="flex flex-col justify-center items-center mt-4 space-y-4">
                    <h1 className="text-5xl font-bold text-white mb-8">Select your Flight</h1>
                    {/* <!--Flight Duration--> */}
                    <div className="relative flex justify-between items-center w-2/3">
                        {/* <!--Return by user's selection--> */}
                        <p className="relative z-10 p-2 bg-blue-200 text-black font-bold border border-white rounded-full">{flightInformation.from}</p>  {/* flightInformation.from */}
                        <i className="fa-solid fa-plane text-3xl border-none" style={{background: "transparent"}}></i>
                        <p className="relative z-10 p-2 bg-blue-200 text-black font-bold border border-white rounded-full">{flightInformation.to}</p>  {/* flightInformation.to */}
                        <img src={StraightLine} alt="line" className="absolute z-1 w-full" />
                    </div>
                    {/* <!--Flight Information--> */}
                    <div className="flex justify-between space-x-8 w-2/3">
                        <div className="flex text-lg font-medium p-3 pr-6 space-x-4 justify-around items-center bg-[#D7DEE3] border border-transparent rounded-lg">
                            <i className="fa-regular fa-calendar"></i>
                            {/* <!--Base on user's booking information--> */}
                            <p>{flightInformation.departure}</p>   {/* flightInformation.departure */}
                        </div>
                        <div className="flex text-lg font-medium p-3 pr-6 space-x-4 justify-around items-center bg-[#D7DEE3] border border-transparent rounded-lg">
                            <i className="fa-solid fa-user"></i>
                            {/* <!--Base on user's booking information--> */}
                            {totalPassengers > 1 ? <p>{totalPassengers} passengers</p> : <p>{totalPassengers} passenger</p>}
                        </div>
                    </div>
                    {/* <!--Type of ticket--> */}
                    {/* <!--Base on user's booking information--> */}
                    <div className="text-center text-white font-bold py-4 border border-black rounded-lg shadow-xl w-1/2" style={{background: "linear-gradient(to bottom, #176CBA 54%, #176CBA)"}}>
                        {flightInformation.type.toUpperCase()}</div>   {/* flightInformation.ticketType */}
                </div>
            </div>
        </>
    )
}

export default FlightInformation;