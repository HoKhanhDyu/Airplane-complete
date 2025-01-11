import React from "react";
import { useNavigate } from "react-router-dom";

const PrintButton = () => {
  const navigate = useNavigate(); // Sử dụng useNavigate để chuyển trang

  const handleBackNavigate = () => { 
    navigate("/manage-revenue"); // Đường dẫn đến trang khác
  }

  const handleNavigate = () => {
    navigate("/amin/revenue/print"); // Đường dẫn đến trang khác
  };

  return (
    <div className="flex justify-start gap-4">
      <button className="px-4 py-2 bg-white border-2 border-black text-black rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 ease-out"
      onClick={handleBackNavigate}>
        Revenue
      </button>
      <button
        className="px-4 py-2 bg-white border-2 border-black text-black rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300 ease-out"
        onClick={handleNavigate} // Gắn sự kiện click vào nút
      >
        Export Excel File
      </button>
    </div>
  );
};

export default PrintButton;
