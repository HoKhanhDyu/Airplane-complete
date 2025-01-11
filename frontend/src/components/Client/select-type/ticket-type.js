import DotLine from "../../../assets/images/Client/type_ticket/dot.svg";
import { showPrice } from "../select-flight/show-price";

const TicketType = ({ type, onClick, isSelected }) => {
    const { name, additionalExpense, feature } = type;

    return (
        <>
            <div className={`relative flex flex-col px-8 pt-4 pb-16 border border-black rounded-lg bg-white h-full cursor-pointer hover:scale-105 hover:shadow-lg transition-transform duration-300 ${isSelected ? "scale-105" : ""}`} onClick={onClick}>
                <div className="ml-4 mb-4 w-full">
                    <h2 className="text-xl font-bold">{name.toUpperCase()}</h2>
                    <div className="w-full flex space-x-2">
                        <p className="">Add Fee:</p>
                        <p className=""><span className="text-red-400">{showPrice(additionalExpense)} VNĐ</span>/passenger</p>
                    </div>
                </div>
                {/* <!--Feature--> */}
                <div className="flex flex-col">
                    <div className="flex justify-start items-center space-x-4">
                        <i className="fa-solid fa-suitcase"></i>
                        <p>{feature.baggage} carry-on baggage</p>
                    </div>
                    <div className="flex justify-start items-center space-x-4">
                        <i className="fa-regular fa-calendar"></i>
                        <p>Tiket exchange fee: <span className="text-red-400">{showPrice(feature.exchangeFee)} VNĐ</span></p>
                    </div>
                </div>
                {feature.refundable && (<div className="flex justify-start items-center space-x-4">
                    <i className="fa-solid fa-arrow-rotate-right"></i>
                    <p>Refundable</p>
                </div>)}
                {feature.food && (<div className="flex justify-start items-center space-x-4">
                    <i className="fa-solid fa-utensils"></i>
                    <p>Fast food, drink includes</p>
                </div>)}
                <img src={DotLine} alt="dot" className="absolute bottom-6 left-1/2 transform -translate-x-1/2" />
            </div>
        </>
    )
}

export default TicketType;