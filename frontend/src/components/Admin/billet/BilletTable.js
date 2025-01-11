import React, { useState } from "react";
import { fetchTickets, deleteTicket, editTicket } from '../billet/API';
import { useEffect } from 'react';
import {ticketList} from '../../../constant/index';

const BilletTable = () => {
  const [tableData, setTableData] = useState(ticketList);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editedRow, setEditedRow] = useState(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);
        const tickets = await fetchTickets(); // Gọi hàm fetchTickets
        setTableData(tickets); // Lưu danh sách vé vào state
      } catch (error) {
        console.error('Failed to load tickets:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []); 

  if (loading) return <p>Loading...</p>;

  // Handle opening the delete confirmation modal
  const openDeleteModal = (row) => {
    setSelectedRow(row);
    setIsDeleteModalOpen(true);
  };

  // Handle closing the delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRow(null);
  };

  // Handle opening the edit modal
  const openEditModal = (row) => {
    setSelectedRow(row);
    setEditedRow({ ...row }); // Create a copy of the row for editing
    setIsEditModalOpen(true);
  };

  // Handle closing the edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditedRow(null);
  };

  // Handle deleting the row from table
  const handleDelete = async () => {
    try {
      await deleteTicket(selectedRow.id); // Gọi hàm deleteTicket
      setTableData((prev) => prev.filter((row) => row.id !== selectedRow.id)); // Loại bỏ vé khỏi danh sách
      alert('Ticket deleted successfully!');
    } catch (error) {
      alert(`Failed to delete ticket: ${error.message}`);
    } finally {
      closeDeleteModal();
    }
  };

  // Handle saving the edited data
  const handleSaveEdit = async () => {
    try {
      const updatedTicket = await editTicket(selectedRow.id, editedRow); // Gọi hàm editTicket
      setTableData((prev) =>
        prev.map((row) => (row.id === selectedRow.id ? updatedTicket : row))
      ); // Cập nhật danh sách vé
      alert('Ticket updated successfully!');
    } catch (error) {
      alert(`Failed to edit ticket: ${error.message}`);
    } finally {
      closeEditModal();
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <table className="w-11/12 mx-auto border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#455a73] text-white">
            <th className="py-3 px-6 text-center">No</th>
            <th className="py-3 px-6 text-center">Booking Code</th>
            <th className="py-3 px-6 text-center">ID Customer</th>
            <th className="py-3 px-6 text-center">ID Flight</th>
            <th className="py-3 px-6 text-center">Airline</th>
            <th className="py-3 px-6 text-center">Edit</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <TableRow
              key={row.id}
              index={index + 1}
              row={row}
              openDeleteModal={openDeleteModal}
              openEditModal={openEditModal}
            />
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteModal
          closeDeleteModal={closeDeleteModal}
          handleDelete={handleDelete}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditModal
          closeEditModal={closeEditModal}
          editedRow={editedRow}
          setEditedRow={setEditedRow}
          handleSaveEdit={handleSaveEdit}
        />
      )}
    </div>
  );
};

const TableRow = ({ index, row, openDeleteModal, openEditModal }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
      <td className="py-3 px-6 text-center">{index}</td>
      <td className="py-3 px-6 text-center">{row.bookingCode}</td>
      <td className="py-3 px-6 text-center">{row.customerId}</td>
      <td className="py-3 px-6 text-center">{row.flightId}</td>
      <td className="py-3 px-6 text-center">{row.airline}</td>
      <td className="py-3 px-6 text-center flex justify-center items-center space-x-4">
        <button
          onClick={() => openEditModal(row)}
          className="text-[#2d5167] text-xl hover:text-[#1a394d]"
        >
          ✎
        </button>
        <button
          onClick={() => openDeleteModal(row)}
          className="text-[#2d5167] text-xl hover:text-[#1a394d]"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
};

const DeleteModal = ({ closeDeleteModal, handleDelete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-5 w-96 max-w-full">
        <h3 className="text-lg font-semibold mb-4">Are you sure you want to cancel?</h3>
        <div className="flex justify-between">
          <button
            onClick={handleDelete}
            className="w-1/3 py-2 bg-[#2d5167] text-white rounded-lg hover:bg-[#1a394d]"
          >
            Yes
          </button>
          <button
            onClick={closeDeleteModal}
            className="w-1/3 py-2 bg-[#f0f0f0] text-black rounded-lg hover:bg-[#e1e1e1]"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ closeEditModal, editedRow, setEditedRow, handleSaveEdit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRow((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-5 w-96 max-w-full">
        <button
          onClick={closeEditModal}
          className="absolute top-3 right-3 text-2xl font-bold text-black"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4">Edit Ticket</h3>
        <form>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="bookingCode" className="block text-sm font-medium mb-2">
                Booking Code:
              </label>
              <input
                type="text"
                id="bookingCode"
                name="bookingCode"
                value={editedRow.bookingCode}
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
                name="customerId"
                value={editedRow.customerId}
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
                name="flightId"
                value={editedRow.flightId}
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
                name="airline"
                value={editedRow.airline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleSaveEdit}
              className="w-1/3 py-2 bg-[#2d5167] text-white rounded-lg hover:bg-[#1a394d]"
            >
              Save
            </button>
            <button
              type="button"
              onClick={closeEditModal}
              className="w-1/3 py-2 bg-[#f0f0f0] text-black rounded-lg hover:bg-[#e1e1e1]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BilletTable;


