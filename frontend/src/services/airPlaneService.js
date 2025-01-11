import apiClient from "./apiClient";

const airPlaneService = {
    async getAirPlanes() {
        try {
        const response = await apiClient.get("/aircraft/aircrafts");
        return response.data;
        } catch (error) {
        // console.error("Error while fetching airplanes", error);
        throw error;
        // return [];
        }
    },
    async addPlane(planeData) {
        try {
            const response = await apiClient.post("/aircraft/aircrafts", planeData);
            return response.data;
        } catch (error) {
            // console.error("Error adding airplane", error);
            throw error;
        }
    },
    async deletePlane(planeId) {
        try {
            const response = await apiClient.delete(`/aircraft/aircrafts/${planeId}`);
            return response.data;
        } catch (error) {
            // console.error("Error deleting airplane", error);
            throw error;
        }
    },
    async editPlane(planeId, updatedData) {
        try {
            const response = await apiClient.put(`/aircraft/aircrafts/${planeId}`, updatedData);
            return response.data;
        } catch (error) {
            // console.error("Error editing airplane", error);
            throw error;
        }
    },
};


export default airPlaneService;