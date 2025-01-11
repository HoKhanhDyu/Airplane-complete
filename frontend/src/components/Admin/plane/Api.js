import airPlaneService from "../../../services/airPlaneService";

// 1. Fetch tất cả các máy bay
export const fetchPlanes = async () => {
    try {
        const response = await airPlaneService.getAirPlanes();
        return response;
    } catch (error) {
        console.error('Error fetching planes:', error.message);
        throw error;
    }
};

// 2. Thêm máy bay mới
export const addPlane = async (planeData) => {
    try {
        const response = await airPlaneService.addPlane(planeData);
        return response;
    } catch (error) {
        console.error('Error adding plane:', error.message);
        throw error;
    }
};

// 3. Xóa máy bay
export const deletePlane = async (planeId) => {
    try {
        const response = await airPlaneService.deletePlane(planeId);
        return response;
    } catch (error) {
        console.error('Error deleting plane:', error.message);
        throw error;
    }
};

// 4. Sửa máy bay
export const editPlane = async (planeId, updatedData) => {
    try {
        const response = await airPlaneService.editPlane(planeId, updatedData);
    } catch (error) {
        console.error('Error editing plane:', error.message);
        throw error;
    }
};