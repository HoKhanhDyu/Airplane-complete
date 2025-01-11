import { useLocation } from "react-router-dom"; 
import SelectTypeHeader from "../../components/Client/select-type/select-type-header";
import SelectTypeTicket from "../../components/Client/select-type/select-type-ticket";
import TypeList from "../../components/Client/select-type/ticket-type-list";

const SelectTicketType = () => {
    const location = useLocation();
    const flightInformation = location.state;

    // Dữ liệu tạm thời cho loại vé
    const ticketTypeData = [
        {
            type: "economy",
            name: "Economy 1",
            additionalExpense: 0,
            feature: {
                baggage: "7 kg",
                exchangeFee: 699000,
                refundable: false,
                food: false
            }
        },
        {
            type: "economy",
            name: "Economy 2",
            additionalExpense: 190000,
            feature: {
                baggage: "7 kg",
                exchangeFee: 499000,
                refundable: true,
                food: false
            }
        },
        {
            type: "economy",
            name: "Economy 3",
            additionalExpense: 290000,
            feature: {
                baggage: "10 kg",
                exchangeFee: 499000,
                refundable: true,
                food: true
            }
        },
        {
            type: "economy",
            name: "Economy 4",
            additionalExpense: 390000,
            feature: {
                baggage: "11 kg",
                exchangeFee: 499000,
                refundable: true,
                food: true
            }
        },
        {
            type: "economy",
            name: "Economy 5",
            additionalExpense: 490000,
            feature: {
                baggage: "12 kg",
                exchangeFee: 499000,
                refundable: true,
                food: true
            }
        },
        {
            type: "business",
            name: "Business 1",
            additionalExpense: 590000,
            feature: {
                baggage: "7 kg",
                exchangeFee: 899000,
                refundable: false,
                food: true
            }
        },
        {
            type: "business",
            name: "Business 2",
            additionalExpense: 690000,
            feature: {
                baggage: "10 kg",
                exchangeFee: 990000,
                refundable: true,
                food: true
            }
        },
        {
            type: "business",
            name: "Business 3",
            additionalExpense: 790000,
            feature: {
                baggage: "10 kg",
                exchangeFee: "999000",
                refundable: true,
                food: true
            }
        },

    ];

    // Lọc loại vé theo nhu cầu của khách hàng
    const ticketTypeList = ticketTypeData.filter(ticket => ticket.type === flightInformation.type);

    return (
        <>
            <div className="relative h-screen overflow-hidden" style={{background: "linear-gradient(to bottom, #2D82B5, #BCE6FF)"}}>
                <SelectTypeHeader flightInformation={flightInformation} />
                <SelectTypeTicket flightInformation={flightInformation} />
                <TypeList ticketTypeList={ticketTypeList} />
            </div>
        </>
    )
}

export default SelectTicketType;