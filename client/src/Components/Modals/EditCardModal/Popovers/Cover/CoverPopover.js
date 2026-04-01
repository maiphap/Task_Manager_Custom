import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Container, SmallColorBox, SmallColorsContainer, Title } from '../Labels/styled';
import SizeTypeOne from './SizeTypeOne';
import SizeTypeTwo from './SizeTypeTwo';
import Button from '../../ReUsableComponents/Button';
import { coverUpdate, coverImageUpload } from '../../../../../Services/cardService';
import CloudUploadIcon from '@mui/icons-material/CloudUploadOutlined';

const ColorBox = styled(SmallColorBox)`
	border: 2px solid ${(props) => (props.selected ? '#0079bf' : 'transparent')};
	border-radius: 3px;
`;

const SizeContainer = styled.div`
	display: flex;
	width: 100%;
	height: fit-content;
	flex-direction: row;
	align-items: center;
	justify-content: start;
	gap: 0.5rem;
`;

const SizeWrapper = styled.div`
	flex: 1;
	width: 100%;
	height: fit-content;
	cursor: ${(props) => (props.show ? 'pointer' : 'default')};
`;

const UploadArea = styled.div`
	width: 100%;
	min-height: 5rem;
	border: 2px dashed #c4c9cc;
	border-radius: 6px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: all 0.2s ease;
	gap: 0.3rem;
	padding: 0.5rem;
	&:hover {
		border-color: #0079bf;
		background-color: rgba(0, 121, 191, 0.04);
	}
`;

const UploadText = styled.span`
	font-size: 0.75rem;
	color: #5e6c84;
`;

const PreviewImage = styled.img`
	width: 100%;
	max-height: 8rem;
	object-fit: cover;
	border-radius: 4px;
	margin-bottom: 0.4rem;
`;

const HiddenInput = styled.input`
	display: none;
`;

const CoverPopover = () => {
	const dispatch = useDispatch();
	const card = useSelector((state) => state.card);
	const fileInputRef = useRef(null);
	const [uploading, setUploading] = useState(false);

	const handleRemoveClick = async () => {
		await coverUpdate(card.cardId, card.listId, card.boardId, null, null, dispatch);
	};

	const handleColorClick = async (color, isSizeOne) => {
		await coverUpdate(card.cardId, card.listId, card.boardId, color, isSizeOne, dispatch);
	};

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setUploading(true);
		await coverImageUpload(card.cardId, card.listId, card.boardId, file, dispatch);
		setUploading(false);
	};

	return (
		<Container>
			<Title>Size</Title>
			<SizeContainer>
				<SizeWrapper onClick={() => handleColorClick(card.cover.color, true)} show={card.cover.color}>
					<SizeTypeOne
						selected={card.cover.color && card.cover.isSizeOne !== null && card.cover.isSizeOne}
						color={card.cover.color}
					/>
				</SizeWrapper>
				<SizeWrapper onClick={() => handleColorClick(card.cover.color, false)} show={card.cover.color}>
					<SizeTypeTwo
						selected={card.cover.color && card.cover.isSizeOne !== null && !card.cover.isSizeOne}
						color={card.cover.color}
					/>
				</SizeWrapper>
			</SizeContainer>
			<Title>Colors</Title>
			<SmallColorsContainer>
				{card.colors.map((color) => {
					return (
						<ColorBox
							onClick={() => {
								handleColorClick(color.bg, card.cover.isSizeOne === null ? true : card.cover.isSizeOne);
							}}
							selected={card.cover.color === color.bg ? true : false}
							key={color.bg}
							bg={color.bg}
							hbg={color.hbg}
						></ColorBox>
					);
				})}
			</SmallColorsContainer>
			<Title>Upload a cover image</Title>
			{card.cover.image && (
				<PreviewImage src={card.cover.image} alt="Cover preview" />
			)}
			<UploadArea onClick={() => fileInputRef.current && fileInputRef.current.click()}>
				<CloudUploadIcon style={{ color: '#5e6c84', fontSize: '1.5rem' }} />
				<UploadText>{uploading ? 'Uploading...' : 'Click to upload an image'}</UploadText>
				<UploadText style={{ fontSize: '0.65rem' }}>JPG, PNG, GIF, WEBP (Max 5MB)</UploadText>
			</UploadArea>
			<HiddenInput
				ref={fileInputRef}
				type="file"
				accept="image/jpeg,image/png,image/gif,image/webp"
				onChange={handleFileChange}
			/>
			<Button title='Remove' style={{ marginTop: '1rem' }} clickCallback={handleRemoveClick} />
		</Container>
	);
};

export default CoverPopover;
