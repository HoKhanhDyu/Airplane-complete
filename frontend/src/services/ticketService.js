import apiClient from "./apiClient";

const ticketService = {
    async getUserTickets() {
        try {
        const response = await apiClient.get("/ticket/user_ticket");
        return response.data;
        } catch (error) {
        // console.error("Error while fetching tickets", error);
        throw error;
        // return [];
        }
    },

};

export default ticketService;
   