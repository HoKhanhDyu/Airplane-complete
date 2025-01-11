import apiClient from "./apiClient";


const flightService = {
    async getFlights(data) {
        try {
            console.log(data);
            const response = await apiClient.get("/flight/flights", {
                params: {
                    'departure_airport_id': data.from,
                    'arrival_airport_id': data.to,
                    'seat_type': data.seatType,
                    'number_of_passenger': data.numberOfPassenger,
                    'airline_id': data.airline,
                    'time_departure': data.departure
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async getFlightById(id) {
        try {
            const response = await apiClient.get(`/flight/flights/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    // async getFlights() {
    //     try {
    //         const response = await apiClient.get("/flight/flights");
    //         return response.data;
    //     } catch (error) {
    //         throw error;
    //     }
    // },
    async addFlight(flight) {
        try {
            const response = await apiClient.post("/flight/flights/", flight);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async updateFlight(flight_id, flight) {
        try {
            const response = await apiClient.put(`/flight/flights/${flight_id}`, flight);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async deleteFlight(flight_id) {
        try {
            const response = await apiClient.delete(`/flight/flights/${flight_id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async getAllFlights() {
        try {
            const response = await apiClient.get("/flight/flights");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default flightService;