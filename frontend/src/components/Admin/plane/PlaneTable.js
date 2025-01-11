import React, { useState } from "react";
import { fetchPlanes, deletePlane, editPlane } from '../plane/Api';
import { useEffect } from 'react';
import {planeList} from '../../../constant/index';

// PlaneTable component
const PlaneTable = () => {
  const [tableData, setTableData] = useState(planeList);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const loadPlanes = async () => {
        try {
          setLoading(true);
          const planes = await fetchPlanes(); // Gọi hàm fetchTickets
          setTableData(planes); // Lưu danh sách vé vào state
        } catch (error) {
          console.error('Failed to load tickets:', error.message);
        } finally {
          setLoading(false);
        }
      };
  
      loadPlanes();
}, []); 

  if (loading) return <p>Loading...</p>;

  // Open Delete Confirmation Modal
  const openDeleteModal = (plane) => {
    setSelectedRow(plane);
    setIsDeleteModalOpen(true);
  };

  // Close Delete Confirmation Modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRow(null);
  };

  // Open Edit Modal
  const openEditModal = (plane) => {
    setSelectedRow(plane);
    setEditedRow({ ...plane });
    setIsEditModalOpen(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditedRow(null);
  };

  // Handle deleting a plane
  const handleDelete = async () => {
    try {
      await deletePlane(selectedRow.id); // Gọi hàm deleteTicket
      setTableData((prev) => prev.filter((row) => row.id !== selectedRow.id)); // Loại bỏ vé khỏi danh sách
      alert('Plane deleted successfully!');
    } catch (error) {
      alert(`Failed to delete ticket: ${error.message}`);
    } finally {
      closeDeleteModal();
    }
  };

  // Handle saving edited plane data
  const handleSaveEdit = async () => {
      try {
        const updatedPlane = await editPlane(selectedRow.id, editedRow); // Gọi hàm editTicket
        setTableData((prev) =>
          prev.map((row) => (row.id === selectedRow.id ? updatedPlane : row))
        ); // Cập nhật danh sách vé
        alert('Plane updated successfully!');
      } catch (error) {
        alert(`Failed to edit ticket: ${error.message}`);
      } finally {
        closeEditModal();
      }
    };

  return (
    <div className="container mx-auto p-4">
      <table className="w-11/12 mx-auto table-auto shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#455a73] text-white">
            <th className="py-3 px-6 text-center">No</th>
            <th className="py-3 px-6 text-center">ID Plane</th>
            <th className="py-3 px-6 text-center">Name Plane</th>
            <th className="py-3 px-6 text-center">Business Seat</th>
            <th className="py-3 px-6 text-center">Economy Seat</th>
            <th className="py-3 px-6 text-center">Airline</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((plane, index) => (
            <TableRow
              key={plane.id}
              index={index + 1}
              plane={plane}
              openDeleteModal={openDeleteModal}
              openEditModal={openEditModal}
            />
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteModal closeDeleteModal={closeDeleteModal} handleDelete={handleDelete} />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditModal
          closeEditModal={closeEditModal}
          editedPlane={editedRow}
          setEditedPlane={setEditedRow}
          handleSaveEdit={handleSaveEdit}
        />
      )}
    </div>
  
  );
};

// TableRow Component
const TableRow = ({ index, plane, openDeleteModal, openEditModal }) => {
  const business = "1 - " + plane.business_rows;
  const economy =  (plane.business_rows + 1) + " - " + plane.rows;
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100">
      <td className="py-3 px-6 text-center">{index}</td>
      <td className="py-3 px-6 text-center">{plane.id}</td>
      <td className="py-3 px-6 text-center">{plane.name}</td>
      <td className="py-3 px-6 text-center">{business}</td>
      <td className="py-3 px-6 text-center">{economy}</td>
      <td className="py-3 px-6 text-center">{plane.airline_name}</td>
      <td className="py-3 px-6 text-center">
        <div className="flex justify-center space-x-4">
          <button onClick={() => openEditModal(plane)} className="text-[#2d5167] text-xl hover:text-[#1a394d]">
            ✎
          </button>
          <button onClick={() => openDeleteModal(plane)} className="text-[#e74c3c] text-xl hover:text-[#c0392b]">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
};

// Delete Modal
const DeleteModal = ({ closeDeleteModal, handleDelete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-5 w-96 max-w-full">
        <h3 className="text-lg font-semibold mb-4">Are you sure want to delete?</h3>
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

// Edit Modal
const EditModal = ({ closeEditModal, editedPlane, setEditedPlane, handleSaveEdit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPlane((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-5 w-96 max-w-full">
        <button onClick={closeEditModal} className="absolute top-3 right-3 text-2xl font-bold text-black">
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4">Edit Plane</h3>
        <form>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-2">
                ID Plane:
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={editedPlane.id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name Plane:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editedPlane.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
              <label htmlFor="ecoSeat" className="block text-sm font-medium mb-2">
                Columns:
              </label>
              <input
                type="number"
                id="ecoSeat"
                name="ecoSeat"
                value={editedPlane.columns}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label htmlFor="ecoSeat" className="block text-sm font-medium mb-2">
                Rows:
              </label>
              <input
                type="number"
                id="ecoSeat"
                name="ecoSeat"
                value={editedPlane.rows}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            </div>
            <div>
              <label htmlFor="buSeats" className="block text-sm font-medium mb-2">
                Business Row:
              </label>
              <input
                type="number"
                id="buSeats"
                name="buSeats"
                value={editedPlane.business_rows}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleSaveEdit}
              className="w-1/3 py-2 bg-[#2d5167] text-white rounded-lg hover:bg-[#1a394d]"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={closeEditModal}
              className="w-1/3 py-2 bg-[#f0f0f0] text-black rounded-lg hover:bg-[#e1e1e1]"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaneTable;
