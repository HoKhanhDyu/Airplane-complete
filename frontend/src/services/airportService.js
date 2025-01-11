import apiClient from "./apiClient";

const airPortService = {
    async getAirports() {
        try {
        const response = await apiClient.get("/airport/airports");
        return response.data;
        } catch (error) {
        // console.error("Error while fetching airports", error);
        throw error;
        // return [];
        }
    },
    async addAirport(airport) {
        try {
        const response = await apiClient.post("/airport/add", airport);
        return response.data;
        } catch (error) {
        // console.error("Error while adding airport", error);
        throw error;
        }
    },
    async updateAirport(airport_id, airport) {
        try {
        const response = await apiClient.put(`/airport/update/${airport_id}`, airport);
        return response.data;
        } catch (error) {
        // console.error("Error while updating airport", error);
        throw error;
        }
    },
    async deleteAirport(airport_id) {
        try {
        const response = await apiClient.delete(`/airport/delete/${airport_id}`);
        return response.data;
        } catch (error) {
        // console.error("Error while deleting airport", error);
        throw error;
        }
    },
};

export default airPortService;