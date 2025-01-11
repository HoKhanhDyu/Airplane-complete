import apiClient from "./apiClient";

const invoiceService = {
    async getInvices() {
        try {
            const response = await apiClient.get("invoice/invoices");
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async getInvoiceById(id) {
        try {
            const response = await apiClient.get(`invoice/invoices/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async filterInvoices(data) {
        try {
            console.log(data);
            const response = await apiClient.post("invoice/filter", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async showTicket(invoice_id) {
        try {
            const response = await apiClient.get(`invoice/ticket_show/${invoice_id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default invoiceService;