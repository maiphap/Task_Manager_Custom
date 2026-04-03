import styled from 'styled-components';
import { xs } from '../../../../../BreakPoints';

export const TopBar = styled.div`
	height: 52px;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: space-between;
	padding: 0rem 1rem;
	justify-content: center;
	flex-wrap: wrap;
	gap: 0.3rem;

	${xs({
		gap: '0.1rem',
	})}
`;

export const LeftWrapper = styled.div`
	display: flex;
	flex-direction: row;
	flex: 3;
	width: 75%;
	align-items: center;
	justify-content: flex-start;
	height: 100%;
	gap: 1rem;
`;

export const MemberWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 0.2rem;
	margin-left: 0.5rem;
`;

export const RemoveIcon = styled.div`
	position: absolute;
	top: -5px;
	right: -5px;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background-color: #ef4444;
	color: white;
	display: none;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	font-weight: 900;
	border: 1px solid white;
	z-index: 100;
	box-shadow: 0 1px 3px rgba(0,0,0,0.3);
	&:hover {
		background-color: #dc2626;
		transform: scale(1.2);
	}
`;

export const MemberAvatar = styled.div`
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	background-color: ${(props) => props.color || '#0079bf'};
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 0.85rem;
	font-weight: 600;
	cursor: pointer;
	border: 2px solid transparent;
	transition: 200ms ease;
	position: relative;
	opacity: ${(props) => (props.isPending ? '0.6' : '1')};
	
	&:hover {
		filter: brightness(95%);
		border: 2px solid white;
		${RemoveIcon} {
			display: flex;
		}
	}
`;

export const RightWrapper = styled.div`
	display: flex;
	flex: 1;
	height: 100%;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
`;

export const InviteButton = styled.button`
	display: flex;
	border: none;
	height: 2rem;
	color: white;
	padding: 0rem 1rem;
	align-items: center;
	gap: 0.5rem;
	border-radius: 3px;
	background-color: #0079bf;
	cursor: pointer;
	transition: 250ms ease;
	&:hover {
		background-color: #00599f;
	}
`;

export const TextSpan = styled.span`
	font-size: 0.85rem;
	font-weight: 600;
	${xs({
		display: 'none',
	})}
`;

export const BoardNameInput = styled.input`
	height: 1.75rem;
	background-color: rgba(255, 255, 255, 0.25);
	border: none;
	border-radius: 1px;
	font-size: 1.1rem;
	text-align: center;
	min-width: 6.5rem;
	max-width: 10rem;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	width: ${(props) => props.value.length * 0.75 + 'rem'};
	font-weight: 600;
	color: white;
	outline: 2px solid rgba(255, 255, 255, 0.25);
	transition: 250ms ease;
	cursor: pointer;
	&:focus {
		background-color: white;
		outline: 2px solid #0079bf;
		color: black;
		cursor: text;
	}
	&:focus:hover {
		background-color: white;
		outline: 2px solid #0079bf;
		color: black;
		cursor: text;
	}
	&:hover {
		background-color: rgba(255, 255, 255, 0.5);
		outline: 2px solid rgba(255, 255, 255, 0.5);
	}
	&::placeholder {
		color: #d0d0d0;
	}

	${xs({
		maxWidth: '8rem',
	})}
`;
