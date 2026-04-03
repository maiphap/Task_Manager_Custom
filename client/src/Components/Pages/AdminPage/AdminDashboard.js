import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../Navbar';
import {
	getAllUsers,
	toggleBanUser,
	updateUserRole,
	getAllBoards,
	toggleDeleteBoard,
	getAdminStats,
	getAuditLogs,
	updateSystemNotification,
	getSystemNotification
} from '../../../Services/adminService';
import { xs } from '../../../BreakPoints';
import {
	BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
	PieChart, Pie, Cell
} from 'recharts';
import io from 'socket.io-client';

const Container = styled.div`
	padding-top: 4rem;
	display: flex;
	min-height: 100vh;
	background-color: #f4f5f7;
`;

const Sidebar = styled.div`
	width: 260px;
	background-color: #ffffff;
	border-right: 1px solid #dfe1e6;
	display: flex;
	flex-direction: column;
	padding: 2rem 0;
	position: fixed;
	height: calc(100vh - 4rem);
	${xs({
		width: '60px',
		overflowX: 'hidden'
	})}
`;

const SidebarItem = styled.div`
	padding: 0.75rem 1.5rem;
	cursor: pointer;
	color: ${props => props.active ? '#0079bf' : '#5e6c84'};
	background-color: ${props => props.active ? '#ebf5ff' : 'transparent'};
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 0.75rem;
	border-left: 3px solid ${props => props.active ? '#0079bf' : 'transparent'};
	transition: all 0.2s;
	&:hover {
		background-color: #f4f5f7;
		color: #0079bf;
	}
	${xs({
		padding: '0.75rem',
		justifyContent: 'center'
	})}
`;

const MainContent = styled.div`
	flex: 1;
	margin-left: 260px;
	padding: 2rem;
	${xs({
		marginLeft: '60px',
		padding: '1rem'
	})}
`;

const Card = styled.div`
	background: white;
	padding: 1.5rem;
	border-radius: 8px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
	margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
	font-size: 1.25rem;
	color: #172b4d;
	margin-bottom: 1.5rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
	margin-top: 1rem;
`;

const Th = styled.th`
	text-align: left;
	padding: 1rem;
	background: #f4f5f7;
	color: #5e6c84;
	font-weight: 600;
	font-size: 0.85rem;
	text-transform: uppercase;
`;

const Td = styled.td`
	padding: 1rem;
	border-top: 1px solid #dfe1e6;
	color: #172b4d;
	font-size: 0.95rem;
`;

const Badge = styled.span`
	padding: 0.25rem 0.5rem;
	border-radius: 4px;
	font-size: 0.75rem;
	font-weight: bold;
	background-color: ${props => props.color || '#dfe1e6'};
	color: white;
`;

const ActionBtn = styled.button`
	padding: 0.4rem 0.6rem;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 0.8rem;
	margin-right: 0.5rem;
	color: white;
	background-color: ${props => props.color || '#0079bf'};
	&:hover { opacity: 0.8; }
	&:disabled { background-color: #ebecf0; cursor: not-allowed; }
`;

const Input = styled.input`
	padding: 0.5rem;
	border: 1px solid #dfe1e6;
	border-radius: 4px;
	margin-right: 1rem;
	width: 250px;
`;

const StatsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 1.5rem;
	margin-bottom: 2rem;
	${xs({ gridTemplateColumns: '1fr' })}
`;

const StatCard = styled(Card)`
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 1rem;
`;

const StatValue = styled.div`
	font-size: 1.75rem;
	font-weight: bold;
	color: #0079bf;
`;

const StatLabel = styled.div`
	font-size: 0.8rem;
	color: #5e6c84;
	text-transform: uppercase;
`;

const AdminDashboard = () => {
	const [activeTab, setActiveTab] = useState('users');
	const [users, setUsers] = useState([]);
	const [boards, setBoards] = useState([]);
	const [stats, setStats] = useState(null);
	const [logs, setLogs] = useState([]);
	const [search, setSearch] = useState('');
	const [onlineCount, setOnlineCount] = useState(0);
	const [notification, setNotification] = useState({ message: '', active: false });
	
	const dispatch = useDispatch();
	const user = useSelector(state => state.user.userInfo);
	const baseUrl = process.env.REACT_APP_API_URL;

	useEffect(() => {
		// Socket.io for Real-time Online Users
		const socket = io(baseUrl);
		socket.on('online_users_count', (count) => {
			setOnlineCount(count);
		});
		return () => socket.disconnect();
	}, [baseUrl]);

	const loadData = useCallback(async () => {
		switch (activeTab) {
			case 'users':
				const usersData = await getAllUsers(search, dispatch);
				if (usersData) setUsers(usersData);
				break;
			case 'boards':
				const boardsData = await getAllBoards(dispatch);
				if (boardsData) setBoards(boardsData);
				break;
			case 'stats':
				const statsData = await getAdminStats(dispatch);
				if (statsData) setStats(statsData);
				break;
			case 'logs':
				const logsData = await getAuditLogs(dispatch);
				if (logsData) setLogs(logsData);
				break;
			case 'settings':
				const settings = await getSystemNotification();
				if (settings) setNotification(settings);
				break;
			default: break;
		}
	}, [activeTab, search, dispatch]);

	useEffect(() => {
		loadData();
	}, [activeTab, loadData]);

	const handleBan = async (userId) => {
		const result = await toggleBanUser(userId, dispatch);
		if (result) {
			setUsers(users.map(u => u._id === userId ? { ...u, isBanned: result.isBanned } : u));
		}
	};

	const handleRoleChange = async (userId, role) => {
		const result = await updateUserRole(userId, role, dispatch);
		if (result) {
			setUsers(users.map(u => u._id === userId ? { ...u, role: result.user.role } : u));
		}
	};

	const handleDeleteBoard = async (boardId) => {
		const result = await toggleDeleteBoard(boardId, dispatch);
		if (result) {
			setBoards(boards.map(b => b._id === boardId ? { ...b, isDeleted: result.isDeleted } : b));
		}
	};

	const handleSaveNotification = async () => {
		await updateSystemNotification(notification, dispatch);
	};

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

	return (
		<>
			<Navbar />
			<Container>
				<Sidebar>
					<SidebarItem active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
						<span>👥</span> {xs ? '' : 'Người dùng'}
					</SidebarItem>
					<SidebarItem active={activeTab === 'boards'} onClick={() => setActiveTab('boards')}>
						<span>📋</span> {xs ? '' : 'Tài nguyên'}
					</SidebarItem>
					<SidebarItem active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
						<span>📊</span> {xs ? '' : 'Thống kê'}
					</SidebarItem>
					<SidebarItem active={activeTab === 'logs'} onClick={() => setActiveTab('logs')}>
						<span>📜</span> {xs ? '' : 'Nhật ký'}
					</SidebarItem>
					<SidebarItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
						<span>⚙️</span> {xs ? '' : 'Cấu hình'}
					</SidebarItem>
				</Sidebar>

				<MainContent>
					<SectionTitle>
						{activeTab === 'users' && 'Quản lý người dùng'}
						{activeTab === 'boards' && 'Điều phối nội dung'}
						{activeTab === 'stats' && 'Thống kê & Phân tích'}
						{activeTab === 'logs' && 'Nhật ký hệ thống'}
						{activeTab === 'settings' && 'Cấu hình hệ thống'}
						
						<Badge color="#00C49F">Online: {onlineCount}</Badge>
					</SectionTitle>

					{activeTab === 'users' && (
						<Card>
							<div style={{ marginBottom: '1rem' }}>
								<Input 
									placeholder="Tìm kiếm theo tên hoặc email..." 
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									onKeyPress={(e) => e.key === 'Enter' && loadData()}
								/>
								<ActionBtn onClick={loadData}>Tìm kiếm</ActionBtn>
							</div>
							<Table>
								<thead>
									<tr>
										<Th>Người dùng</Th>
										<Th>Email</Th>
										<Th>Vai trò</Th>
										<Th>Trạng thái</Th>
										<Th>Số Board</Th>
										<Th>Hành động</Th>
									</tr>
								</thead>
								<tbody>
									{users.map(u => (
										<tr key={u._id}>
											<Td>{u.name} {u.surname}</Td>
											<Td>{u.email}</Td>
											<Td>
												<Badge color={u.role === 'admin' ? '#eb5a46' : '#0079bf'}>{u.role}</Badge>
											</Td>
											<Td>
												<Badge color={u.isBanned ? '#616161' : '#61bd4f'}>
													{u.isBanned ? 'Bị khóa' : 'Hoạt động'}
												</Badge>
											</Td>
											<Td>{u.boardCount}</Td>
											<Td>
												<ActionBtn 
													color={u.isBanned ? '#61bd4f' : '#eb5a46'} 
													onClick={() => handleBan(u._id)}
													disabled={u._id === user.id}
												>
													{u.isBanned ? 'Mở khóa' : 'Khóa'}
												</ActionBtn>
												<select 
													value={u.role} 
													onChange={(e) => handleRoleChange(u._id, e.target.value)}
													disabled={u._id === user.id}
													style={{ padding: '0.3rem', borderRadius: '4px' }}
												>
													<option value="user">User</option>
													<option value="admin">Admin</option>
												</select>
											</Td>
										</tr>
									))}
								</tbody>
							</Table>
						</Card>
					)}

					{activeTab === 'boards' && (
						<Card>
							<Table>
								<thead>
									<tr>
										<Th>Board Title</Th>
										<Th>Chủ sở hữu</Th>
										<Th>Thành viên</Th>
										<Th>Ngày tạo</Th>
										<Th>Trạng thái</Th>
										<Th>Hành động</Th>
									</tr>
								</thead>
								<tbody>
									{boards.map(b => (
										<tr key={b._id}>
											<Td>{b.title}</Td>
											<Td>{b.members.find(m => m.role === 'owner')?.email || 'N/A'}</Td>
											<Td>{b.members.length}</Td>
											<Td>{new Date(b.createdAt).toLocaleDateString()}</Td>
											<Td>
												<Badge color={b.isDeleted ? '#eb5a46' : '#61bd4f'}>
													{b.isDeleted ? 'Đã xóa tạm' : 'Hoạt động'}
												</Badge>
											</Td>
											<Td>
												<ActionBtn 
													color={b.isDeleted ? '#61bd4f' : '#eb5a46'}
													onClick={() => handleDeleteBoard(b._id)}
												>
													{b.isDeleted ? 'Khôi phục' : 'Xóa'}
												</ActionBtn>
											</Td>
										</tr>
									))}
								</tbody>
							</Table>
						</Card>
					)}

					{activeTab === 'stats' && stats && (
						<>
							<StatsGrid>
								<StatCard>
									<StatValue>{stats.summary.totalUsers}</StatValue>
									<StatLabel>Tổng người dùng</StatLabel>
								</StatCard>
								<StatCard>
									<StatValue>{stats.summary.totalBoards}</StatValue>
									<StatLabel>Tổng Board</StatLabel>
								</StatCard>
								<StatCard>
									<StatValue>{stats.summary.totalCards}</StatValue>
									<StatLabel>Tổng Card</StatLabel>
								</StatCard>
								<StatCard>
									<StatValue>{onlineCount}</StatValue>
									<StatLabel>Người dùng Online</StatLabel>
								</StatCard>
							</StatsGrid>
							
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
								<Card>
									<SectionTitle>Tăng trưởng người dùng (6 tháng qua)</SectionTitle>
									<div style={{ height: '300px' }}>
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={stats.growth}>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="_id" />
												<YAxis />
												<Tooltip />
												<Bar dataKey="count" fill="#0079bf" />
											</BarChart>
										</ResponsiveContainer>
									</div>
								</Card>
								<Card>
									<SectionTitle>Phân phối tài nguyên</SectionTitle>
									<div style={{ height: '300px' }}>
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={[
														{ name: 'Boards', value: stats.summary.totalBoards },
														{ name: 'Users', value: stats.summary.totalUsers }
													]}
													cx="50%"
													cy="50%"
													outerRadius={80}
													fill="#8884d8"
													dataKey="value"
													label
												>
													{stats.growth.map((entry, index) => (
														<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
													))}
												</Pie>
												<Tooltip />
											</PieChart>
										</ResponsiveContainer>
									</div>
								</Card>
							</div>
						</>
					)}

					{activeTab === 'logs' && (
						<Card>
							<Table>
								<thead>
									<tr>
										<Th>Thời gian</Th>
										<Th>Admin</Th>
										<Th>Hành động</Th>
										<Th>Đối tượng</Th>
										<Th>Chi tiết</Th>
									</tr>
								</thead>
								<tbody>
									{logs.map(log => (
										<tr key={log._id}>
											<Td>{new Date(log.createdAt).toLocaleString()}</Td>
											<Td>{log.adminName}</Td>
											<Td>
												<Badge color="#ff9f1a">{log.action}</Badge>
											</Td>
											<Td>{log.targetType}</Td>
											<Td>{log.details}</Td>
										</tr>
									))}
								</tbody>
							</Table>
						</Card>
					)}

					{activeTab === 'settings' && (
						<Card>
							<SectionTitle>Thông báo hệ thống (System Banner)</SectionTitle>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
								<label>
									<input 
										type="checkbox" 
										checked={notification.active} 
										onChange={(e) => setNotification({...notification, active: e.target.checked})}
									/> Kích hoạt thông báo
								</label>
								<textarea 
									rows="4" 
									style={{ padding: '1rem', borderRadius: '4px', border: '1px solid #dfe1e6' }}
									placeholder="Nhập nội dung thông báo cho người dùng..."
									value={notification.message}
									onChange={(e) => setNotification({...notification, message: e.target.value})}
								></textarea>
								<ActionBtn style={{ width: 'fit-content' }} onClick={handleSaveNotification}>
									Lưu cấu hình
								</ActionBtn>
							</div>
						</Card>
					)}
				</MainContent>
			</Container>
		</>
	);
};

export default AdminDashboard;
