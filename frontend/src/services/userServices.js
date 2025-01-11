import apiClient from "./apiClient";

const userServices = {
  async register(data) {
    try {
      const response = await apiClient.post("user/register", {
        email: data.email,
        password: data.password,
        full_name: data.name,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async verifyOTP(data) {
    try {
      const response = await apiClient.post("user/verify-otp", {
        user_email: data.email,
        otp: data.otp,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async refreshToken() {
    try {
      await apiClient.post("/auth/token/refresh");
    } catch (error) {
      throw error;
    }
  },

  async resendOTP(data) {
    try {
      const response = await apiClient.post("user/resend-otp", {
        email: data.email,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async login(data) {
    try {
      const response = await apiClient.post("user/login", {
        email: data.email,
        password: data.password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    try {
      await apiClient.post("user/logout");
    } catch (error) {
      throw error;
    }
  },
  async getUserInfo() {
    try {
      const response = await apiClient.get("user/info");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async updateUserInfo(user_id, data) {
    try {
      const response = await apiClient.put(`user/info/${user_id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getAllStaff() {
    try {
      const response = await apiClient.get("user/staffs");
      console.log("response", response);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async createUserByAdmin(data) {
    try {
      const response = await apiClient.post("user/add-admin-user", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async deleteUserByAdmin(user_id) {
    try {
      const response = await apiClient.delete(`user/${user_id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getCusTomerInfo() {
    try {
      const response = await apiClient.get("user/customer_info");
      console.log("response", response);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userServices;
