import React, { useState } from 'react';
import { addPlane } from '../plane/Api';

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
          Add Plane
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
  const [formData, setFormData] = useState({
    airline_id: "",
    name: "",
    code: "",
    rows: 0,
    columns: 0,
    business_rows: 0,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleAddPlane = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    try {
      const newPlane = await addPlane(formData); // Gọi hàm API addPlane
      console.log(newPlane);
    } catch (error) {
      console.error("Error adding plane:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-5 w-96 max-w-full">
        <button
          onClick={closeModal}
          className="text-black rounded-lg p-5 w-96 max-w-full relative top-0 justify-right text-2xl font-bold "
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4">Add Plane</h3>
        <form onSubmit={handleAddPlane}>
          <div className="grid gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name Plane:
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
  
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">

          <div>
              <label htmlFor="code" className="block text-sm font-medium mb-2">
                Code Plane:
              </label>
              <input
                type="text"
                id="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="rows" className="block text-sm font-medium mb-2">
                Rows:
              </label>
              <input
                type="number"
                id="rows"
                value={formData.rows}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="columns" className="block text-sm font-medium mb-2">
                Columns:
              </label>
              <input
                type="number"
                id="columns"
                value={formData.columns}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="business_rows" className="block text-sm font-medium mb-2">
                Business Rows:
              </label>
              <input
                type="number"
                id="business_rows"
                value={formData.business_rows}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="grid gap-4 mb-4">
          <div>
              <label htmlFor="airline_id" className="block text-sm font-medium mb-2">
                Airline:
              </label>
              <input
                type="text"
                id="airline_id"
                value={formData.airline_id}
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
