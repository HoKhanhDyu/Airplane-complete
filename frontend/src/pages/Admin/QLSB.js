import React, { useState, useEffect } from 'react';
import '../../styles/style_QLSB.css';
import {TitleTypography} from '../../components/StyledComponents';
import airPortService from '../../services/airportService';


const QLSB = () => {
  const [airports, setAirports] = useState([]); 
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({ Name: '', City: '', Country: '', Code: '' }); // Thêm 'Code'
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const airportAPI = 'https://127.0.0.1:8000/api/airport/airports'; 

  // useEffect(() => {
  //   fetchAirports();
  // }, []);

  const fetchAirports = async () => { 
    const data = await airPortService.getAirports();
    setAirports(data); 
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleAddAirport = async () => { 
    
    if (formData.Name === "" || formData.City === "" || formData.Country === "" || formData.Code === "") {
      alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
      return;
    }

    const options = {
      method: 'POST',
      body: JSON.stringify({
        name: formData.Name,
        city: formData.City,
        country: formData.Country,
        code: formData.Code
      }),
      headers: {
        "Content-Type": "application/json",
      }
    };

    airPortService.addAirport(options);
    fetchAirports();
    setModalVisible(false);
    setFormData({ Name: '', City: '', Country: '', Code: '' }); 
  };

  


  const handleEditAirport = (id) => { 
    const airport = airports.find(a => a.id === id);
    setFormData({ Name: airport.Name, City: airport.City, Country: airport.Country, Code: airport.Code });
    setIsEditing(true);
    setEditId(id); 
    setModalVisible(true);
  };

  const handleUpdateAirport = async () => { 
    const options = {
      method: 'PUT',
      body: JSON.stringify({
        name: formData.Name,
        city: formData.City,
        country: formData.Country,
        code: formData.Code
      }),
      headers: {
        "Content-Type": "application/json",
      }
    };

    console.log(options);

    airPortService.updateAirport(editId, options);
    fetchAirports();
    setModalVisible(false);
    setFormData({ Name: '', City: '', Country: '', Code: '' });
    setIsEditing(false);
    setEditId(null);
  };

  const handleDeleteAirport = async (id) => { 
    const options = {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      }
    };

    airPortService.deleteAirport(id, options);
    fetchAirports();
  };

  const handleSearch = () => {
    if (searchTerm) {
      const filteredAirports = airports.filter(airport => airport.Name.toLowerCase().includes(searchTerm.toLowerCase()));
      setAirports(filteredAirports);
    } else {
      fetchAirports(); // Re-fetch the airports when the search term is empty
    }
  };
  
  // useEffect to refetch airports when search term is empty or updated
  useEffect(() => {
    if (!searchTerm) {
      fetchAirports();
    }
  }, [searchTerm]);


  return (
    <div className="dashboard">


      <main className="content">
      <TitleTypography
      >
        airports management
      </TitleTypography>
        <div className="search-box">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tên sân bay"
          />
          <button onClick={handleSearch}>🔍</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mã sân bay</th>
              <th>Tên sân bay</th>
              <th>Thành phố</th>
              <th>Quốc gia</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {airports.map((airport, index) => ( 
              <tr key={airport.id} className={`airport-item-${airport.id}`}>
                <td>{index + 1}</td>
                <td>{airport.code}</td> {/* Thay ID thành id */}
                <td>{airport.Name}</td> {/* Tên thành Name */}
                <td>{airport.City}</td> {/* Thành phố thành City */}
                <td>{airport.Country}</td> {/* Quốc gia thành Country */}
                <td className="edit-icons">
                  <button onClick={() => handleEditAirport(airport.id)}>✎</button> {/* Sửa ID thành id */}
                  <button onClick={() => handleDeleteAirport(airport.id)}>🗑️</button> {/* Sửa ID thành id */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div id="container">
          <div id="ADD" className="add-plane">
            <button id="openModalButton" onClick={() => setModalVisible(true)}>Thêm Sân Bay</button>
          </div>

          {modalVisible && (
            <div id="modalOverlay" className="modal-overlay visible">
              <div className="modal">
                <button type="button" id="closeModalButton" className="close-button" onClick={() => {
                      setModalVisible(false);
                      setFormData({ Name: '', City: '', Country: '', Code: '' });
                      setIsEditing(false);
                      setEditId(null);
                }}>&times;</button>
                <h3>{isEditing ? 'Chỉnh sửa' : 'Thêm Sân Bay'}</h3> {/* Sửa thông báo */}
                <form id="addPlaneForm" 
                                    style={{
                                      backgroundColor: isEditing ? 'lightblue' : 'white',
                                        padding: '20px',
                                        borderRadius: '5px'
                                  }}               
                onSubmit={(e) => {
                  e.preventDefault();
                  isEditing ? handleUpdateAirport() : handleAddAirport(); // Chỉnh sửa lại tên hàm
                }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="Name">Tên sân bay:</label> {/* Cập nhật thành Name */}
                      <input type="text" id="Name" value={formData.Name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="City">Thành phố:</label> {/* Cập nhật thành City */}
                      <input type="text" id="City" value={formData.City} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="Country">Quốc gia:</label> {/* Cập nhật thành Country */}
                      <input type="text" id="Country" value={formData.Country} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="Code">Mã sân bay:</label> {/* Thêm input cho 'Code' */}
                      <input type="text" id="Code" value={formData.Code} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <button type="submit">{isEditing ? 'Lưu' : 'Thêm'}</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QLSB;
