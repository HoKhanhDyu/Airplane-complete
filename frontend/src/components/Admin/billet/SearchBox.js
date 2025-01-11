import React, { useState, useEffect } from "react";
import { fetchTickets } from "../billet/API";
import { ticketList } from "../../../constant/index";

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Dùng để lưu giá trị nhập vào ô tìm kiếm
  const [searchResult, setSearchResult] = useState(null); // Kết quả tìm kiếm
  const [error, setError] = useState(""); // Thông báo lỗi
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState(ticketList);


  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        const tickets = await fetchTickets(); // Gọi hàm fetchTickets
        setTableData(tickets); // Lưu danh sách vé vào state
      } catch (error) {
        console.error("Failed to load tickets:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setError(""); // Xóa lỗi trước đó
    setSearchResult(null); // Xóa kết quả trước đó

    if (!searchQuery.trim()) {
      setError("Please enter a booking code."); // Thông báo nếu giá trị nhập vào trống
      return;
    }

    // Tìm kiếm trong tableData
    const result = tableData.find(
      (ticket) => ticket.bookingCode.toLowerCase() === searchQuery.toLowerCase()
    );

    if (result) {
      setSearchResult(result); // Hiển thị kết quả nếu tìm thấy
    } else {
      setError("No ticket found with the given booking code."); // Hiển thị lỗi nếu không tìm thấy
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center my-5">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Enter booking code"
          value={searchQuery} // Sử dụng searchQuery cho giá trị ô input
          onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật searchQuery khi thay đổi input
          className="p-2 text-base w-60 border border-gray-300 rounded-l-lg"
          required
        />
        <button
          type="submit"
          className="p-2 px-4 text-base bg-blue-800 text-white rounded-r-lg hover:bg-blue-900 transition-colors duration-300"
        >
          🔍
        </button>
      </form>

      {/* Hiển thị thông báo lỗi nếu có */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Hiển thị kết quả tìm kiếm nếu có */}
      {searchResult && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-100">
          <h3 className="font-semibold text-lg">Search Result:</h3>
          <p><strong>Booking Code:</strong> {searchResult.bookingCode}</p>
          <p><strong>Customer ID:</strong> {searchResult.customerId}</p>
          <p><strong>Flight ID:</strong> {searchResult.flightId}</p>
          <p><strong>Airline:</strong> {searchResult.airline}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
