import apiClient from "./apiClient";

const forgotPassService = {
    async sendOTP (data) {
        try {
            await apiClient.post("user/password-reset/send-otp", {
                email: data.email,
            });
        } catch (error) {
            console.error("Error in sendOTP:", error.response?.data || error.message);
            throw error;
        }
    },
    async verifyOTP (data) {
        try {
            console.log(data);
            const response = await apiClient.post("user/password-reset/verify-otp", {
                email: data.email,
                otp: data.otp,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    async resetPassword (data) {
        try {
            const response = await apiClient.post("user/password-reset/reset-password", {
                email: data.email,
                new_password: data.password,
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default forgotPassService;