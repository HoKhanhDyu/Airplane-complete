import React, { useState } from 'react';
import { addTickets } from '../billet/API';


const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Disable body scrolling when modal is open
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Re-enable body scrolling when modal is closed
  };

  return (
    <div className="container">
      {/* Add Plane Button */}
      <div className="add-plane text-center my-5">
        <button
          onClick={openModal}
          className="py-2 px-5 font-medium text-white bg-[#7da1c4] hover:bg-[#5a8aa0] rounded-lg transition-colors"
        >
          Add Ticket
        </button>
      </div>

      {/* Modal Component (conditionally rendered) */}
      {isModalOpen && (
        <Modal closeModal={closeModal} />
      )}
    </div>
  );
};

// Modal Component
const Modal = ({ closeModal }) => {

      // State để lưu dữ liệu form
    const [formData, setFormData] = useState({
        bookingCode: '',
        customerId: '',
        flightId: '',
        airline: '',
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      };

    const handleAddTicket = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    try {
      const newTicket = await addTickets(formData); // Gọi hàm API addTicket
      console.log(newTicket);
      alert('Ticket added successfully!');
      closeModal(); // Đóng modal sau khi thêm thành công
    } catch (error) {
      alert(`Failed to add ticket: ${error.message}`);
    }
  };

    

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-5 w-96 max-w-full">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-2xl font-bold text-black"
        >
           </button>
        <h3 className="text-xl font-semibold mb-4">Add Ticket</h3>
        
        <form onSubmit={handleAddTicket}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="bookingCode" className="block text-sm font-medium mb-2">
                Booking Code:
              </label>
              <input
                type="text"
                id="bookingCode"
                value={formData.bookingCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="customerId" className="block text-sm font-medium mb-2">
                ID Customer:
              </label>
              <input
                type="text"
                id="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="flightId" className="block text-sm font-medium mb-2">
                ID Flight:
              </label>
              <input
                type="text"
                id="flightId"
                value={formData.flightId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="airline" className="block text-sm font-medium mb-2">
                Airline:
              </label>
              <input
                type="text"
                id="airline"
                value={formData.airline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-[#2d5167] text-white rounded-lg hover:bg-[#1a394d] transition-colors"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default Main;