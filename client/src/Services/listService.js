import axios from 'axios';
import { openAlert } from '../Redux/Slices/alertSlice';
import { setLoading, successCreatingCard, deleteCard } from '../Redux/Slices/listSlice';
import socket from './socketService';

const baseUrl = process.env.REACT_APP_API_URL + '/card';

export const createCard = async (title, listId, boardId, dispatch) => {
	dispatch(setLoading(true));
	try {
		const updatedList = await axios.post(baseUrl + '/create', { title: title, listId: listId, boardId: boardId });
		dispatch(successCreatingCard({ listId: listId, updatedList: updatedList.data }));
		dispatch(setLoading(false));
		socket.emit('board_updated', boardId);
	} catch (error) {
		dispatch(setLoading(false));
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
};

export const cardDelete = async (listId, boardId, cardId, dispatch) => {
	try {
		await dispatch(deleteCard({ listId, cardId }));
		await axios.delete(baseUrl + "/" + boardId + "/" + listId + "/" + cardId + "/delete-card");
		socket.emit('board_updated', boardId);
	} catch (error) {
		dispatch(
			openAlert({
				message: error?.response?.data?.errMessage ? error.response.data.errMessage : error.message,
				severity: 'error',
			})
		);
	}
}
