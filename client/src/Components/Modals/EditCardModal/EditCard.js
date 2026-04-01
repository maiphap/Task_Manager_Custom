import * as React from 'react';
import Modal from '@mui/material/Modal';
import Actions from './Actions/Actions';
import Activity from './Activity/Activity';
import AddToCard from './AddToCard/AddToCard';
import Checklist from './Checklist/Checklist';
import Description from './Description/Description';
import Attachments from './Attachments/Attachments';
import Features from './Features/Features';
import Title from './Title/Title';
import CardLoadingSvg from '../../../Images/cardLoading.svg';
import { getCard } from '../../../Services/cardService';
import { useSelector, useDispatch } from 'react-redux';
import IconButton from './ReUsableComponents/IconButton';
import CoverIcon from '@mui/icons-material/TableChartOutlined';
import CloseIcon from '@mui/icons-material/Close';
import {
	Container,
	Wrapper,
	CoverContainer,
	MainContainer,
	TitleContainer,
	FeaturesContainer,
	DescriptionContainer,
	ChecklistContainer,
	ActivityContainer,
	RightContainer,
	AddToCardContainer,
	ActionsContainer,
	LoadingScreen,
	AttachmentContainer,
	CoverButtonWrapper,
	CloseIconWrapper,
} from './styled';

const MODAL_STYLE = { overflow: 'auto' };

export default function EditCard(props) {
	const { cardId, listId, boardId } = props.ids;
	const dispatch = useDispatch();
	const thisCard = useSelector((state) => state.card);
	React.useEffect(() => {
		if (props.open) {
			getCard(cardId, listId, boardId, dispatch);
		}
	}, [boardId, cardId, listId, props.open, dispatch]);

	return (
		<div style={{ position: 'relative' }}>
			<Modal open={props.open} onClose={props.callback} style={MODAL_STYLE} disableEnforceFocus>
				<Container>
					<CoverContainer
						color={!thisCard.pending ? (thisCard.cover.image ? null : thisCard.cover.color) : null}
						style={
							!thisCard.pending && thisCard.cover.image
								? {
										display: 'block',
										backgroundImage: `url(${thisCard.cover.image})`,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										minHeight: '10rem',
										margin: '-0.5rem 0rem 0rem -0.25rem',
										borderTopLeftRadius: '3px',
										borderTopRightRadius: '3px',
										position: 'relative',
								  }
								: {}
						}
					>
						<CoverButtonWrapper>
							<IconButton title='Cover' icon={<CoverIcon fontSize='small' />} />
						</CoverButtonWrapper>
					</CoverContainer>
					<TitleContainer>{!thisCard.pending && <Title />}</TitleContainer>
					<Wrapper>
						<MainContainer>
							{!thisCard.pending ? (
								<>
									{(thisCard.members.length > 0 ||
										thisCard.labels.filter((label) => label.selected).length > 0 ||
										thisCard.date.startDate ||
										thisCard.date.dueDate) && (
										<FeaturesContainer>
											<Features />
										</FeaturesContainer>
									)}
									<DescriptionContainer>
										<Description />
									</DescriptionContainer>
									{thisCard.attachments.length > 0 && (
										<AttachmentContainer>
											<Attachments />
										</AttachmentContainer>
									)}
									{thisCard.checklists.length > 0 && (
										<ChecklistContainer>
											{thisCard.checklists.map((list) => {
												return <Checklist key={list._id} {...list} />;
											})}
										</ChecklistContainer>
									)}
									<ActivityContainer>
										<Activity />
									</ActivityContainer>
								</>
							) : (
								<LoadingScreen image={CardLoadingSvg} />
							)}
						</MainContainer>
						<RightContainer>
							<AddToCardContainer>
								<AddToCard />
							</AddToCardContainer>
							<ActionsContainer>
								<Actions />
							</ActionsContainer>
						</RightContainer>
					</Wrapper>
					<CloseIconWrapper onClick={props.callback}>
						<CloseIcon fontSize='small' color='black' />
					</CloseIconWrapper>
				</Container>
			</Modal>
		</div>
	);
}
