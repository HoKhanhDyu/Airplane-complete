import apiClient from "./apiClient";

const buyTicketService = {
    async getSeatOfFlight(flightId) {
        try {
            const response = await apiClient.get(`/buy_ticket/seats/${flightId}`);
            const data = response.data;
            return data;
        } catch (error) {
            throw error;
        }
    },
    async bookTicket(data){
        try {
            const response = await apiClient.post('/buy_ticket/buy_ticket', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default buyTicketService;