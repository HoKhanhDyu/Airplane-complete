import SelectTypeHeader from "../../components/Client/select-type/select-type-header";
import GetInformationForm from "../../components/Client/customer-information/getinfo-form";
import GetInformationFooter from "../../components/Client/customer-information/getinfo-footer";
import { useNavigate, useLocation } from "react-router-dom";

const CustomerInformation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const flightInformation = location.state;
    const totalPassengers = flightInformation.adult + flightInformation.children + flightInformation.infant;
    return (
        <>
            <div className="h-screen overflow-auto" style={{ background: "linear-gradient(to bottom, #2D82B5, #BCE6FF)" }}>
                <SelectTypeHeader flightInformation={flightInformation} />
                <GetInformationForm passengers={totalPassengers} flightInformation={flightInformation}/>
                <footer>
                    <GetInformationFooter />
                </footer>
            </div>
        </>
    )
}

export default CustomerInformation;