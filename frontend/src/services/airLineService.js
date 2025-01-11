import apiClient from "./apiClient";

const airLineService = {
    async getAirlines() {
        try {
        const response = await apiClient.get("/airline/airlines");
        return response.data;
        } catch (error) {
        // console.error("Error while fetching airlines", error);
        throw error;
        // return [];
        }
    },
    async addAirline(airline) {
        try {
        const response = await apiClient.post("/airline/airlines", airline);
        return response.data;
        } catch (error) {
        // console.error("Error while adding airline", error);
        throw error;
        }
    },
    async updateAirline(id, airline) {
        try {
        const response = await apiClient.put(`/airline/airlines/${id}`, airline);
        return response.data;
        } catch (error) {
        // console.error("Error while updating airline", error);
        throw error;
        }
    },
    async deleteAirline(id) {
        try {
        const response = await apiClient.delete(`/airline/airlines/${id}`);
        return response.data;
        } catch (error) {
        // console.error("Error while deleting airline", error);
        throw error;
        }
    },
};


export default airLineService;