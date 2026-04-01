import axios from "axios";
import { openAlert } from "../Redux/Slices/alertSlice";

const baseUrl = process.env.REACT_APP_API_URL;

export const getAllUsers = async (dispatch) => {
    try {
        const res = await axios.get(baseUrl + "/user/admin/users");
        return res.data;
    } catch (error) {
        dispatch(openAlert({
            message: error?.response?.data?.errMessage || error.message,
            severity: "error"
        }));
    }
};

export const deleteUser = async (id, dispatch) => {
    try {
        const res = await axios.delete(baseUrl + `/user/admin/user/${id}`);
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

export const getAdminStats = async (dispatch) => {
    try {
        const res = await axios.get(baseUrl + "/user/admin/stats");
        return res.data;
    } catch (error) {
        dispatch(openAlert({
            message: error?.response?.data?.errMessage || error.message,
            severity: "error"
        }));
    }
};

export const getAllBoardsAdmin = async (dispatch) => {
    try {
        const res = await axios.get(baseUrl + "/board/admin/all-boards");
        return res.data;
    } catch (error) {
        dispatch(openAlert({
            message: error?.response?.data?.errMessage || error.message,
            severity: "error"
        }));
    }
};
