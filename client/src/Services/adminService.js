import axios from "axios";
import { openAlert } from "../Redux/Slices/alertSlice";

const baseUrl = process.env.REACT_APP_API_URL;

// --- User Management ---

export const getAllUsers = async (search = "", dispatch) => {
    try {
        const res = await axios.get(baseUrl + `/admin/users?search=${search}`);
        return res.data;
    } catch (error) {
        dispatch(openAlert({
            message: error?.response?.data?.errMessage || error.message,
            severity: "error"
        }));
    }
};

export const toggleBanUser = async (userId, dispatch) => {
    try {
        const res = await axios.patch(baseUrl + `/admin/users/${userId}/ban`);
        dispatch(openAlert({
            message: res.data.message,
            severity: "success"
        }));
        return res.data;
    } catch (error) {
        dispatch(openAlert({
            message: error?.response?.data?.errMessage || error.message,
            severity: "error"
        }));
    }
};

export const updateUserRole = async (userId, role, dispatch) => {
    try {
        const res = await axios.patch(baseUrl + `/admin/users/${userId}/role`, { role });
        dispatch(openAlert({
            message: res.data.message,
            severity: "success"
        }));
        return res.data;
    } catch (error) {
        dispatch(openAlert({
            message: error?.response?.data?.errMessage || error.message,
            severity: "error"
        }));
    }
};

// --- Board Moderation ---

export const getAllBoards = async (dispatch) => {
    try {
        const res = await axios.get(baseUrl + "/admin/boards");
        return res.data;
    } catch (error) {
        dispatch(openAlert({
            message: error?.response?.data?.errMessage || error.message,
            severity: "error"
        }));
    }
};

export const toggleDeleteBoard = async (boardId, dispatch) => {
    try {
        const res = await axios.delete(baseUrl + `/admin/boards/${boardId}`);
        dispatch(openAlert({
            message: res.data.message,
            severity: "success"
        }));
        return res.data;
    } catch (error) {
        dispatch(openAlert({
            message: error?.response?.data?.errMessage || error.message,
            severity: "error"
        }));
    }
};

export const restoreBoard = async (boardId, dispatch) => {
    try {
        const res = await axios.patch(baseUrl + `/admin/boards/${boardId}/restore`);
        dispatch(openAlert({
            message: res.data.message,
            severity: "success"
        }));
        return res.data;
    } catch (error) {
        dispatch(openAlert({
            message: error?.response?.data?.errMessage || error.message,
            severity: "error"
        }));
    }
};

// --- Analytics & Logs ---

export const getAdminStats = async (dispatch) => {
    try {
        const res = await axios.get(baseUrl + "/admin/stats");
        return res.data;
    } catch (error) {
        dispatch(openAlert({
            message: error?.response?.data?.errMessage || error.message,
            severity: "error"
        }));
    }
};

export const getAuditLogs = async (dispatch) => {
    try {
        const res = await axios.get(baseUrl + "/admin/logs");
        return res.data;
    } catch (error) {
        dispatch(openAlert({
            message: error?.response?.data?.errMessage || error.message,
            severity: "error"
        }));
    }
};

// --- System Settings ---

export const updateSystemNotification = async (data, dispatch) => {
    try {
        const res = await axios.post(baseUrl + "/admin/settings/notification", data);
        dispatch(openAlert({
            message: res.data.message,
            severity: "success"
        }));
        return true;
    } catch (error) {
        dispatch(openAlert({
            message: error?.response?.data?.errMessage || error.message,
            severity: "error"
        }));
        return false;
    }
};

export const getSystemNotification = async () => {
    try {
        const res = await axios.get(baseUrl + "/admin/settings/notification");
        return res.data;
    } catch (error) {
        console.error("Failed to fetch system notification", error);
        return { message: "", active: false };
    }
};
