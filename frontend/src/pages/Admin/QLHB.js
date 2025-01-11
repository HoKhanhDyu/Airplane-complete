import React, { useState, useEffect } from 'react';
import '../../styles/style_QLHB.css';
import {TitleTypography} from '../../components/StyledComponents';
import airLineService from '../../services/airLineService';

const QLHB = () => {
    const [airlines, setAirlines] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({ Name: '', Country: '', Code: '' }); // Thêm 'Code'
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const hangBayAPI = 'https://127.0.0.1:8000/api/airline/airlines';

    // useEffect(() => {
    //     fetchAirlines();
    // }, []);

    const fetchAirlines = async () => {
        try {
            const data = await airLineService.getAirlines();
            setAirlines(data);
        } catch (error) {
            console.error("Error while fetching airlines", error);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleAddAirline = async () => {
        if (formData.Name === "" || formData.Country === "" || formData.Code === "") { // Thêm 'Code'
            alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
            return;
        }

        const options = {
            method: 'POST',
            body: JSON.stringify(
                {
                    name: formData.Name,
                    country: formData.Country,
                    code: formData.Code
                }
            ),
            headers: {
                "Content-Type": "application/json",
            }
        };
        
        console.log(options);

        const response = await airLineService.addAirline(options);
        console.log(response);
        fetchAirlines();
        setModalVisible(false);
        setFormData({ Name: '', Country: '', Code: '' }); // Thêm 'Code'
    };

    const handleEditAirline = (id) => {
        const airline = airlines.find(a => a.id === id);
        setFormData({ Name: airline.Name, Country: airline.Country, Code: airline.code }); // Thêm 'Code'
        setIsEditing(true);
        setEditId(id);
        setModalVisible(true);
    };

    const handleUpdateAirline = async () => {
        const options = {
            method: 'PUT',
            body: JSON.stringify(
                {
                    name: formData.Name,
                    country: formData.Country,
                    code: formData.Code
                }
            ),
            headers: {
                "Content-Type": "application/json",
            }
        };

        console.log(options);

        const response = await airLineService.updateAirline(editId, options);
        console.log(response);
        fetchAirlines();
        setModalVisible(false);
        setFormData({ Name: '', Country: '', Code: '' }); // Thêm 'Code'
        setIsEditing(false);
        setEditId(null);
    };

    const handleDeleteAirline = async (id) => {
        const options = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            }
        };

        await airLineService.deleteAirline(id, options);
        fetchAirlines();
    };

    const handleSearch = () => {
        if (searchTerm) {
            const filteredAirlines = airlines.filter(airline => airline.Name.toLowerCase().includes(searchTerm.toLowerCase()));
            setAirlines(filteredAirlines);
        } else {
            fetchAirlines();
        }
    };

    useEffect(() => {
        if (!searchTerm) {
            fetchAirlines();
        }
    }, [searchTerm]);

    return (
        <div className="dashboard">

            <main className="content">

            <TitleTypography
      >
        airlines management
      </TitleTypography>
                <div className="search-box">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tên hãng bay"
                    />
                    <button onClick={handleSearch}>🔍</button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã hãng bay</th>
                            <th>Tên hãng bay</th>
                            <th>Quốc gia</th> {/* Bỏ cột "Thành phố" */}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {airlines.map((airline, index) => (
                            <tr key={airline.id} className={`airline-item-${airline.id}`}>
                                <td>{index + 1}</td>
                                <td>{airline.code}</td>
                                <td>{airline.Name}</td>
                                <td>{airline.Country}</td> {/* Bỏ "City" */}
                                <td className="edit-icons">
                                    <button onClick={() => handleEditAirline(airline.id)}>✎</button>
                                    <button onClick={() => handleDeleteAirline(airline.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div id="container">
                    <div id="ADD" className="add-plane">
                        <button id="openModalButton" onClick={() => setModalVisible(true)}>Thêm Hãng Bay</button>
                    </div>

                    {modalVisible && (
                        <div id="modalOverlay" className="modal-overlay visible">
                            <div className="modal">
                                <button type="button" id="closeModalButton" className="close-button" onClick={() => {
                                    setModalVisible(false);
                                    setFormData({ Name: '', Country: '', Code: '' }); // Thêm 'Code'
                                    setIsEditing(false);
                                    setEditId(null);
                                }}>&times;</button>
                                <h3>{isEditing ? 'Chỉnh sửa' : 'Thêm Hãng Bay'}</h3>
                                <form id="addPlaneForm" 
                                    style={{
                                        backgroundColor: isEditing ? 'lightblue' : 'white',
                                        padding: '20px',
                                        borderRadius: '5px'
                                    }}                                
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    isEditing ? handleUpdateAirline() : handleAddAirline();
                                }}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="Name">Tên hãng:</label>
                                            <input type="text" id="Name" value={formData.Name} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="Country">Quốc gia:</label>
                                            <input type="text" id="Country" value={formData.Country} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="Code">Mã Hãng Bay:</label> {/* Thêm input cho 'Code' */}
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

export default QLHB;
