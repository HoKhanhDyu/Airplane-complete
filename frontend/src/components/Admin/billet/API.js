import axios from 'axios';
const BASE_URL = ''; // URL 


// 1. Fetch tất cả các vé
export const fetchTickets = async () => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }
    return await response.json(); // Trả về danh sách vé
  } catch (error) {
    console.error('Error fetching tickets:', error.message);
    throw error;
  }
};

// 2. Thêm vé mới
export const addTickets = async (ticketData) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData), // Dữ liệu gửi đi
    });
    if (!response.ok) {
      throw new Error('Failed to add ticket');
    }
    return await response.json(); // Trả về dữ liệu của vé vừa được thêm
  } catch (error) {
    console.error('Error adding ticket:', error.message);
    throw error;
  }
};

// 3. Xóa vé
export const deleteTicket = async (ticketId) => {
  try {
    const response = await fetch(`${BASE_URL}/${ticketId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete ticket');
    }
    return await response.json(); // Có thể trả về thông báo hoặc dữ liệu trống
  } catch (error) {
    console.error('Error deleting ticket:', error.message);
    throw error;
  }
};

// 4. Sửa vé
export const editTicket = async (ticketId, updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData), // Dữ liệu cập nhật
    });
    if (!response.ok) {
      throw new Error('Failed to edit ticket');
    }
    return await response.json(); // Trả về dữ liệu vé đã sửa
  } catch (error) {
    console.error('Error editing ticket:', error.message);
    throw error;
  }
};

//search vé theo ID
export const searchTicketById = async (bookingCode) => {
  try {
    const response = await fetch(`/api/tickets/${bookingCode}`, {
      method: "GET",
    });
    // Log response để kiểm tra
    console.log("Response status:", response.status);
    if (!response.ok) {
      throw new Error("Ticket not found");
    }
    const data = await response.json();
    console.log("Data fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching ticket:", error);
    throw error;
  }
};
