import React, { useState, useEffect } from 'react';
import '../../styles/style_QLCB.css';
import {TitleTypography} from '../../components/StyledComponents';
import { de } from 'date-fns/locale';
import flightService from '../../services/flightService';
import airPortService from '../../services/airportService';
import airPlaneService from '../../services/airPlaneService';

const QLCB = () => {
    const [chuyenBays, setChuyenBays] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        AirplaneID: '',
        DepartureAirport: '',
        ArrivalAirport: '',
        DepartureTime: '',
        ArrivalTime: '',
        Note: '',
        TakeOffPlace: '',
        LandingPlace: '',
        Giave: '',
        flight_number: '' // Thêm 'flight_number'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState({
        airports: [],
        planes: []
    });

    const chuyenBayAPI = 'https://127.0.0.1:8000/api/flight/flights';



    const fetchChuyenBays = async () => {
        try {
            const data = await flightService.getAllFlights();
            setChuyenBays(data);
        } catch (error) {
            console.error('Error fetching data:', error);
            setChuyenBays([]);
        }
    };

    const fetchAllData = async () => {
        try {
            const [airportsRes, planesRes] = await Promise.all([
                airPortService.getAirports(),
                airPlaneService.getAirPlanes()
            ]);

            console.log(airportsRes);

            const [airports, planes] = await Promise.all([
                airportsRes,
                planesRes
            ]);

            setOptions({
                airports,
                planes
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleAddChuyenBay = async () => {
        // if (!formData.AirplaneID  || !formData.DepartureTime || !formData.ArrivalTime ||  !formData.TakeOffPlace || !formData.LandingPlace || !formData.Giave) {
        //     alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
        //     return;
        // }
        
        // departure_airport_id: int
        // arrival_airport_id: int
        // airline_id: int
        // aircraft_id: int
        // departure_time: datetime
        // arrival_time: datetime
        // price_economy: float
        // price_business: float
        // flight_number: str

        const options = JSON.stringify(
                {
                    departure_airport_id: formData.DepartureAirport,
                    arrival_airport_id: formData.ArrivalAirport,
                    aircraft_id: formData.AirplaneID,
                    departure_time: formData.DepartureTime,
                    arrival_time: formData.ArrivalTime,
                    price_economy: formData.Giave,
                    flight_number: formData.flight_number,
                    
                });

        const response = await flightService.addFlight(options);
        const data = response
        fetchChuyenBays();
        setModalVisible(false);
        resetForm();
    };

    const handleEditChuyenBay = (id) => {
        const chuyenBay = chuyenBays.find(cb => cb.id === id);
        setFormData(chuyenBay);
        setIsEditing(true);
        setEditId(id);
        setModalVisible(true);
    };

    const handleUpdateChuyenBay = async () => {
        // const options = {
        //     method: 'PUT',
        //     body: JSON.stringify(formData),
        //     headers: {
        //         "Content-Type": "application/json",
        //     }
        // };

        const options = JSON.stringify(
            {
                departure_airport_id: formData.DepartureAirport,
                arrival_airport_id: formData.ArrivalAirport,
                aircraft_id: formData.AirplaneID,
                departure_time: formData.DepartureTime,
                arrival_time: formData.ArrivalTime,
                price_economy: formData.Giave,
                flight_number: formData.flight_number,
                
            });


        const data = await flightService.updateFlight(editId, options);
        setChuyenBays(chuyenBays.map(cb => cb.id === editId ? data : cb));
        fetchChuyenBays();
        setModalVisible(false);
        resetForm();
        setIsEditing(false);
        setEditId(null);
    };

    const handleDeleteChuyenBay = async (id) => {
        const options = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            }
        };

        await flightService.deleteFlight(id);
        setChuyenBays(chuyenBays.filter(cb => cb.id !== id));
    };

    const handleSearch = () => {
        const filteredChuyenBays = chuyenBays.filter(cb => 
            cb.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
            cb.DepartureAirport.toLowerCase().includes(searchTerm.toLowerCase()) || 
            cb.ArrivalAirport.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setChuyenBays(filteredChuyenBays);
    };

    // useEffect(() => {
    //     if (!searchTerm) {
    //         fetchChuyenBays();
    //     }
    // }, [searchTerm]);
    
    const resetForm = () => {
        setFormData({
            AirplaneID: '',
            DepartureAirport: '',
            ArrivalAirport: '',
            DepartureTime: '',
            ArrivalTime: '',
            Note: '',
            TakeOffPlace: '',
            LandingPlace: '',
            Giave: '',
            flight_number: '' // Reset 'flight_number'
        });
    };

    const getAirportName = (id) => {
        const airport = options.airports.find(airport => airport.id === id);
        return airport ? airport.Name : '';
    };
    const getPlaneName = (id) => {
        const plane =options.planes.find(plane => plane.id === id);
        return plane ? plane.name: '';
    };

    useEffect(() => {
        fetchChuyenBays();
        fetchAllData();
    }, []);

    return (
        <div className="dashboard">
            

            <main className="content">

            <TitleTypography
      >
        flights management
      </TitleTypography>
                <div className="search-box">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Mã chuyến"
                    />
                    <button onClick={handleSearch}>🔍</button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Số hiệu chuyến bay</th>
                            <th>Máy bay</th>
                            <th>Nơi cất cánh</th>
                            <th>Nơi hạ cánh</th>
                            <th>Sân bay đi</th>
                            <th>Sân bay đến</th>
                            <th>Thời gian bay</th>
                            <th>THời gian đến</th>
                            <th>Giá tiền</th> {/* Add Giave column */}
                            <th>Ghi chú</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chuyenBays.map((chuyenBay, index) => (
                            <tr key={chuyenBay.id}>
                                <td>{index + 1}</td>
                                <td>{chuyenBay.flight_number}</td>
                                <td>{getPlaneName(chuyenBay.AirplaneID)}</td>
                                <td>{chuyenBay.TakeOffPlace}</td>
                                <td>{chuyenBay.LandingPlace}</td>
                                <td>{getAirportName(chuyenBay.DepartureAirport)}</td>
                                <td>{getAirportName(chuyenBay.ArrivalAirport)}</td>
                                <td>{chuyenBay.DepartureTime}</td>
                                <td>{chuyenBay.ArrivalTime}</td>
                                <td>{chuyenBay.Giave}</td> 
                                <td>{chuyenBay.Note}</td>
                                <td className="edit-icons">
                                    <button onClick={() => handleEditChuyenBay(chuyenBay.id)}>✎</button>
                                    <button onClick={() => handleDeleteChuyenBay(chuyenBay.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div id="container">
                    <div id="ADD" className="add-plane">
                        <button id="openModalButton" onClick={() => setModalVisible(true)}>Thêm Chuyến Bay</button>
                    </div>

                    {modalVisible && (
                        <div id="modalOverlay" className="modal-overlay visible">
                            <div className="modal">
                                <button type="button" id="closeModalButton" className="close-button" onClick={() => {
                                    setModalVisible(false);
                                    resetForm();
                                    setIsEditing(false);
                                    setEditId(null);
                                }}>&times;</button>
                                <h3>{isEditing ? 'Chỉnh sửa' : 'Thêm Chuyến Bay'}</h3>
                                <form id="addPlaneForm" 
                                    style={{
                                        backgroundColor: isEditing ? 'lightblue' : 'white',
                                        padding: '10px',
                                        borderRadius: '5px'
                                    }}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    isEditing ? handleUpdateChuyenBay() : handleAddChuyenBay();
                                }}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="flight_number">Số Hiệu Chuyến Bay:</label> {/* Thêm input cho 'flight_number' */}
                                            <input type="text" id="flight_number" value={formData.flight_number} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="DepartureAirport">Sân bay đi:</label>
                                            <select id="DepartureAirport" value={formData.DepartureAirport} onChange={handleInputChange} required>
                                                <option value="">-- Chọn --</option>
                                                {options.airports.map(airport => (
                                                    <option key={airport.id} value={airport.id}>
                                                        {airport.Name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="ArrivalAirport">Sân bay đến:</label>
                                            <select id="ArrivalAirport" value={formData.ArrivalAirport} onChange={handleInputChange} required>
                                                <option value="">-- Chọn --</option>
                                                {options.airports.map(airport => (
                                                    <option key={airport.id} value={airport.id}>
                                                        {airport.Name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="AirplaneID">Mã máy bay:</label>
                                            <select id="AirplaneID" value={formData.AirplaneID} onChange={handleInputChange} required>
                                                <option value="">-- Chọn --</option>
                                                {options.planes.map(plane => (
                                                    <option key={plane.id} value={plane.id}>
                                                        {plane.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="DepartureTime">Ngày khởi hành:</label>
                                            <input type="datetime-local" id="DepartureTime" value={formData.DepartureTime} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="ArrivalTime">Ngày đến:</label>
                                            <input type="datetime-local" id="ArrivalTime" value={formData.ArrivalTime} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="Giave">Giá vé:</label> {/* Add Giave input */}
                                            <input type="number" id="Giave" value={formData.Giave} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="Note">Ghi chú:</label>
                                            <input type="text" id="Note" value={formData.Note} onChange={handleInputChange} required />
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

export default QLCB;