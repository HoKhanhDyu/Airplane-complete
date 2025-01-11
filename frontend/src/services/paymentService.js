import { da } from "date-fns/locale";
import apiClient from "./apiClient";

const paymentService = {
  async createPayment(data) {
    try {
      const response = await apiClient.post("payment/payment", {
        order_type: "pay_ticket",
        order_id: data.invoice_id,
        amount: data.total_price,
        order_desc: "Payment for ticket",
        bank_code: "VNBANK",
        language: "vn",
      });
      window.location.href = response.data.url;
      console.log("payment response", response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default paymentService;