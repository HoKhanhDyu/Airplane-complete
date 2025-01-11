import SearchIntroduction from "../../components/Client/search-ticket/search-introduction";
import SearchForm from "../../components/Client/search-ticket/search-form";
import SearchAds from "../../components/Client/search-ticket/search-ads";
import bookingImg from "../../assets/images/Client/book_ticket/booking_bg.png";

const SearchTicket = () => {
    return (
        <>
            <div style={{backgroundImage: `url(${bookingImg})`}} className="bg-cover bg-no-repeat h-screen overflow-y-hidden">
                <div className="flex pt-12">
                    <SearchIntroduction />
                    <SearchForm />
                </div>
                <SearchAds />
            </div>
        </>
    )
}

export default SearchTicket;
