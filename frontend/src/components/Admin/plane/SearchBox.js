import React, { useState, useEffect } from "react";
import { fetchPlanes } from "../plane/Api";
import { planeList } from "../../../constant/index";

const SearchBox = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Dùng để lưu giá trị nhập vào ô tìm kiếm
  const [searchResult, setSearchResult] = useState(null); // Kết quả tìm kiếm
  const [error, setError] = useState(""); // Thông báo lỗi
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState(planeList);


  useEffect(() => {
    const loadPlanes = async () => {
      try {
        setLoading(true);
        const planes = await fetchPlanes(); // Gọi hàm fetchTickets
        setTableData(planes); // Lưu danh sách vé vào state
      } catch (error) {
        console.error("Failed to load planes:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadPlanes();
  }, []);

  if (!tableData || tableData.length === 0) {
    setError("No data available to search."); // Dữ liệu trống
    return;
  }
  
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
      (plane) => plane.IDPlane.toLowerCase() === searchQuery.toLowerCase()
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
          placeholder="Enter IDPlane"
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
          <p><strong>ID Plane:</strong> {searchResult.IDPlane}</p>
          <p><strong>Name Plane: </strong> {searchResult.NamePlane}</p>
          <p><strong>Business Seat:</strong> {searchResult.Business}</p>
          <p><strong>Economy Seat:</strong> {searchResult.Economy}</p>
          <p><strong>Airline:</strong> {searchResult.Airline}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
