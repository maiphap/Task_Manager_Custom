import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import Navbar from '../../Navbar';
import { getAllUsers, deleteUser, getAdminStats, getAllBoardsAdmin } from '../../../Services/adminService';
import { useHistory } from 'react-router-dom';
import { xs } from '../../../BreakPoints';

const Container = styled.div`
	padding-top: 5rem;
	padding-left: 2rem;
	padding-right: 2rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	min-height: 100vh;
	width: 100%;
	background-color: #f4f5f7;
	${xs({
		padding: '5rem 0.5rem',
	})}
`;

const ContentWrapper = styled.div`
	width: 100%;
	max-width: 1000px;
`;

const Title = styled.h1`
	font-size: 1.5rem;
	color: #172b4d;
	margin-bottom: 1.5rem;
`;

const TabContainer = styled.div`
	display: flex;
	gap: 1rem;
	margin-bottom: 1.5rem;
	border-bottom: 1px solid #dfe1e6;
`;

const Tab = styled.button`
	padding: 0.5rem 1rem;
	border: none;
	background: none;
	cursor: pointer;
	font-weight: 600;
	color: ${(props) => (props.active ? '#0079bf' : '#5e6c84')};
	border-bottom: 2px solid ${(props) => (props.active ? '#0079bf' : 'transparent')};
	&:hover {
		color: #0079bf;
	}
`;

const StatsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 1.5rem;
	margin-bottom: 2rem;
	${xs({
		gridTemplateColumns: '1fr',
	})}
`;

const StatCard = styled.div`
	background: white;
	padding: 1.5rem;
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const StatValue = styled.div`
	font-size: 2rem;
	font-weight: bold;
	color: #0079bf;
`;

const StatLabel = styled.div`
	font-size: 0.875rem;
	color: #5e6c84;
	text-transform: uppercase;
	margin-top: 0.5rem;
`;

const Table = styled.table`
	width: 100%;
	background: white;
	border-radius: 8px;
	border-collapse: collapse;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
	text-align: left;
	padding: 1rem;
	background: #ebecf0;
	color: #172b4d;
	font-weight: 600;
`;

const Td = styled.td`
	padding: 1rem;
	border-top: 1px solid #dfe1e6;
	color: #172b4d;
`;

const ActionButton = styled.button`
	padding: 0.4rem 0.8rem;
	border-radius: 4px;
	border: none;
	cursor: pointer;
	font-size: 0.875rem;
	background-color: ${(props) => (props.danger ? '#eb5a46' : '#0079bf')};
	color: white;
	&:hover {
		opacity: 0.9;
	}
`;

const AdminDashboard = () => {
	const [activeTab, setActiveTab] = useState('users');
	const [users, setUsers] = useState([]);
	const [boards, setBoards] = useState([]);
	const [stats, setStats] = useState(null);
	const dispatch = useDispatch();
	const history = useHistory();

	useEffect(() => {
		const loadData = async () => {
			if (activeTab === 'users') {
				const data = await getAllUsers(dispatch);
				if (data) setUsers(data);
			} else if (activeTab === 'boards') {
				const data = await getAllBoardsAdmin(dispatch);
				if (data) setBoards(data);
			} else if (activeTab === 'stats') {
				const data = await getAdminStats(dispatch);
				if (data) setStats(data);
			}
		};
		loadData();
	}, [activeTab, dispatch]);

	const handleDeleteUser = async (id) => {
		if (window.confirm('Are you sure you want to delete this user? This will also remove them from all boards.')) {
			const success = await deleteUser(id, dispatch);
			if (success) {
				setUsers(users.filter((u) => u._id !== id));
			}
		}
	};

	return (
		<Container>
			<Navbar />
			<ContentWrapper>
				<Title>Admin Dashboard</Title>

				<TabContainer>
					<Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
						Users
					</Tab>
					<Tab active={activeTab === 'boards'} onClick={() => setActiveTab('boards')}>
						All Boards
					</Tab>
					<Tab active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
						Statistics
					</Tab>
				</TabContainer>

				{activeTab === 'stats' && stats && (
					<StatsGrid>
						<StatCard>
							<StatValue>{stats.users}</StatValue>
							<StatLabel>Total Users</StatLabel>
						</StatCard>
						<StatCard>
							<StatValue>{stats.boards}</StatValue>
							<StatLabel>Total Boards</StatLabel>
						</StatCard>
						<StatCard>
							<StatValue>{stats.cards}</StatValue>
							<StatLabel>Total Cards</StatLabel>
						</StatCard>
					</StatsGrid>
				)}

				{activeTab === 'users' && (
					<Table>
						<thead>
							<tr>
								<Th>Name</Th>
								<Th>Email</Th>
								<Th>Role</Th>
								<Th>Actions</Th>
							</tr>
						</thead>
						<tbody>
							{users.map((u) => (
								<tr key={u._id}>
									<Td>
										{u.name} {u.surname}
									</Td>
									<Td>{u.email}</Td>
									<Td>{u.role}</Td>
									<Td>
										{u.role !== 'admin' && (
											<ActionButton danger onClick={() => handleDeleteUser(u._id)}>
												Delete
											</ActionButton>
										)}
									</Td>
								</tr>
							))}
						</tbody>
					</Table>
				)}

				{activeTab === 'boards' && (
					<Table>
						<thead>
							<tr>
								<Th>Title</Th>
								<Th>Created At</Th>
								<Th>Members</Th>
								<Th>Actions</Th>
							</tr>
						</thead>
						<tbody>
							{boards.map((b) => (
								<tr key={b._id}>
									<Td>{b.title}</Td>
									<Td>{new Date(b.createdAt).toLocaleDateString()}</Td>
									<Td>{b.members?.length || 0}</Td>
									<Td>
										<ActionButton onClick={() => history.push(`/board/${b._id}`)}>
											View Board
										</ActionButton>
									</Td>
								</tr>
							))}
						</tbody>
					</Table>
				)}
			</ContentWrapper>
		</Container>
	);
};

export default AdminDashboard;
