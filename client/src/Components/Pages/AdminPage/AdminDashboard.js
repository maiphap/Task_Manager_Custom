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

// Icons from MUI
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StorageIcon from '@mui/icons-material/Storage';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const Container = styled.div`
	padding-top: 4rem;
	display: flex;
	min-height: 100vh;
	background-color: #f8fafc;
	font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const Sidebar = styled.div`
	width: 280px;
	background-color: #ffffff;
	border-right: 1px solid #e2e8f0;
	display: flex;
	flex-direction: column;
	padding: 1.5rem 0.75rem;
	position: fixed;
	height: calc(100vh - 4rem);
	z-index: 10;
	${xs({
		width: '70px',
		padding: '1.5rem 0.5rem'
	})}
`;

const SidebarItem = styled.div`
	padding: 0.85rem 1.25rem;
	cursor: pointer;
	margin-bottom: 0.25rem;
	border-radius: 12px;
	color: ${props => props.active ? '#4f46e5' : '#64748b'};
	background-color: ${props => props.active ? '#f5f3ff' : 'transparent'};
	font-weight: 600;
	display: flex;
	align-items: center;
	gap: 1rem;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	
	&:hover {
		background-color: ${props => props.active ? '#f5f3ff' : '#f1f5f9'};
		color: ${props => props.active ? '#4f46e5' : '#1e293b'};
		transform: translateX(4px);
	}

	svg {
		font-size: 1.25rem;
	}

	${xs({
		padding: '0.85rem',
		justifyContent: 'center',
		span: { display: 'none' }
	})}
`;

const MainContent = styled.div`
	flex: 1;
	margin-left: 280px;
	padding: 2.5rem;
	max-width: 1600px;
	${xs({
		marginLeft: '70px',
		padding: '1.5rem'
	})}
`;

const HeaderSection = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;
`;

const TitleWrapper = styled.div`
	h1 {
		font-size: 1.875rem;
		font-weight: 800;
		color: #1e293b;
		margin: 0;
		letter-spacing: -0.025em;
	}
	p {
		color: #64748b;
		margin-top: 0.25rem;
		font-size: 0.95rem;
	}
`;

const Card = styled.div`
	background: white;
	padding: 1.75rem;
	border-radius: 16px;
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
	border: 1px solid #f1f5f9;
	margin-bottom: 2rem;
	transition: transform 0.2s;
`;

const StatsGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 1.5rem;
	margin-bottom: 2.5rem;
	${xs({ gridTemplateColumns: '1fr' })}
`;

const StatCard = styled(Card)`
	margin-bottom: 0;
	position: relative;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	justify-content: center;

	&::after {
		content: '';
		position: absolute;
		top: -20px;
		right: -20px;
		width: 100px;
		height: 100px;
		background: ${props => props.color || '#4f46e5'};
		opacity: 0.05;
		border-radius: 50%;
	}
`;

const StatHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	margin-bottom: 1rem;
	
	.icon-box {
		width: 40px;
		height: 40px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: ${props => props.bgColor || '#f5f3ff'};
		color: ${props => props.iconColor || '#4f46e5'};
	}
`;

const StatValue = styled.div`
	font-size: 2rem;
	font-weight: 800;
	color: #1e293b;
	line-height: 1;
`;

const StatLabel = styled.div`
	font-size: 0.875rem;
	color: #64748b;
	font-weight: 600;
	margin-top: 0.5rem;
`;

const TableWrapper = styled.div`
	overflow-x: auto;
	margin-top: 1rem;
`;

const Table = styled.table`
	width: 100%;
	border-collapse: separate;
	border-spacing: 0;
`;

const Th = styled.th`
	text-align: left;
	padding: 1rem 1.25rem;
	background: #f8fafc;
	color: #475569;
	font-weight: 700;
	font-size: 0.75rem;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	border-bottom: 1px solid #f1f5f9;
	&:first-child { border-top-left-radius: 12px; }
	&:last-child { border-top-right-radius: 12px; }
`;

const Td = styled.td`
	padding: 1.25rem;
	border-bottom: 1px solid #f1f5f9;
	color: #334155;
	font-size: 0.95rem;
	vertical-align: middle;
`;

const UserInfo = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	.avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: #e2e8f0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		color: #475569;
		font-size: 0.85rem;
	}
	.details {
		display: flex;
		flex-direction: column;
		.name { font-weight: 600; color: #1e293b; }
		.email { font-size: 0.8rem; color: #64748b; }
	}
`;

const Badge = styled.span`
	padding: 0.35rem 0.75rem;
	border-radius: 9999px;
	font-size: 0.75rem;
	font-weight: 700;
	display: inline-flex;
	align-items: center;
	gap: 0.35rem;
	background-color: ${props => props.bgColor || '#f1f5f9'};
	color: ${props => props.textColor || '#475569'};
`;

const ActionButton = styled.button`
	padding: 0.5rem 0.75rem;
	border: none;
	border-radius: 8px;
	cursor: pointer;
	font-weight: 600;
	font-size: 0.8rem;
	transition: all 0.2s;
	background: ${props => props.outline ? 'transparent' : props.color || '#4f46e5'};
	color: ${props => props.outline ? (props.color || '#4f46e5') : 'white'};
	border: ${props => props.outline ? `1.5px solid ${props.color || '#4f46e5'}` : 'none'};
	
	&:hover {
		opacity: 0.9;
		transform: translateY(-1px);
		box-shadow: ${props => props.outline ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'};
	}
	&:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;

const SearchWrapper = styled.div`
	position: relative;
	margin-bottom: 2rem;
	svg {
		position: absolute;
		left: 1rem;
		top: 50%;
		transform: translateY(-50%);
		color: #94a3b8;
		font-size: 1.1rem;
	}
`;

const SearchInput = styled.input`
	width: 100%;
	max-width: 400px;
	padding: 0.75rem 1rem 0.75rem 2.75rem;
	border: 1px solid #e2e8f0;
	border-radius: 12px;
	font-size: 0.95rem;
	color: #1e293b;
	transition: all 0.2s;
	&:focus {
		outline: none;
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
	}
`;

const OnlineStatus = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
	background: white;
	padding: 0.5rem 1rem;
	border-radius: 9999px;
	box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	font-weight: 700;
	font-size: 0.85rem;
	color: #059669;
	svg { font-size: 0.75rem; animation: pulse 2s infinite; }

	@keyframes pulse {
		0% { opacity: 1; }
		50% { opacity: 0.4; }
		100% { opacity: 1; }
	}
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

	const CHART_COLORS = ['#4f46e5', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

	return (
		<>
			<Navbar />
			<Container>
				<Sidebar>
					<SidebarItem active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
						<PeopleIcon /> <span>Người dùng</span>
					</SidebarItem>
					<SidebarItem active={activeTab === 'boards'} onClick={() => setActiveTab('boards')}>
						<DashboardIcon /> <span>Tài nguyên</span>
					</SidebarItem>
					<SidebarItem active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
						<AssessmentIcon /> <span>Thống kê</span>
					</SidebarItem>
					<SidebarItem active={activeTab === 'logs'} onClick={() => setActiveTab('logs')}>
						<HistoryIcon /> <span>Nhật ký</span>
					</SidebarItem>
					<SidebarItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
						<SettingsIcon /> <span>Cấu hình</span>
					</SidebarItem>
				</Sidebar>

				<MainContent>
					<HeaderSection>
						<TitleWrapper>
							<h1>
								{activeTab === 'users' && 'Quản lý người dùng'}
								{activeTab === 'boards' && 'Điều phối nội dung'}
								{activeTab === 'stats' && 'Thống kê & Phân tích'}
								{activeTab === 'logs' && 'Nhật ký hệ thống'}
								{activeTab === 'settings' && 'Cấu hình hệ thống'}
							</h1>
							<p>Chào mừng trở lại, {user.name}. Đây là những gì đang diễn ra.</p>
						</TitleWrapper>
						
						<OnlineStatus>
							<FiberManualRecordIcon /> Online: {onlineCount}
						</OnlineStatus>
					</HeaderSection>

					{activeTab === 'users' && (
						<Card>
							<SearchWrapper>
								<SearchIcon />
								<SearchInput 
									placeholder="Tìm kiếm theo tên hoặc email..." 
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									onKeyPress={(e) => e.key === 'Enter' && loadData()}
								/>
							</SearchWrapper>
							<TableWrapper>
								<Table>
									<thead>
										<tr>
											<Th>Người dùng</Th>
											<Th>Vai trò</Th>
											<Th>Trạng thái</Th>
											<Th>Số Board</Th>
											<Th>Hành động</Th>
										</tr>
									</thead>
									<tbody>
										{users.map(u => (
											<tr key={u._id}>
												<Td>
													<UserInfo>
														<div className="avatar">{u.name[0]}</div>
														<div className="details">
															<span className="name">{u.name} {u.surname}</span>
															<span className="email">{u.email}</span>
														</div>
													</UserInfo>
												</Td>
												<Td>
													<Badge 
														bgColor={u.role === 'admin' ? '#fdf2f2' : '#f0f9ff'} 
														textColor={u.role === 'admin' ? '#9b1c1c' : '#0369a1'}
													>
														{u.role}
													</Badge>
												</Td>
												<Td>
													<Badge 
														bgColor={u.isBanned ? '#f1f5f9' : '#ecfdf5'} 
														textColor={u.isBanned ? '#475569' : '#047857'}
													>
														<FiberManualRecordIcon style={{ fontSize: '0.6rem' }} />
														{u.isBanned ? 'Bị khóa' : 'Hoạt động'}
													</Badge>
												</Td>
												<Td style={{ fontWeight: '700' }}>{u.boardCount}</Td>
												<Td>
													<ActionButton 
														color={u.isBanned ? '#10b981' : '#ef4444'} 
														onClick={() => handleBan(u._id)}
														disabled={u._id === user.id}
													>
														{u.isBanned ? 'Mở khóa' : 'Khóa'}
													</ActionButton>
													<select 
														value={u.role} 
														onChange={(e) => handleRoleChange(u._id, e.target.value)}
														disabled={u._id === user.id}
														style={{ marginLeft: '0.5rem', padding: '0.45rem', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
													>
														<option value="user">User</option>
														<option value="admin">Admin</option>
													</select>
												</Td>
											</tr>
										))}
									</tbody>
								</Table>
							</TableWrapper>
						</Card>
					)}

					{activeTab === 'boards' && (
						<Card>
							<TableWrapper>
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
												<Td style={{ fontWeight: '600' }}>{b.title}</Td>
												<Td>{b.members.find(m => m.role === 'owner')?.email || 'N/A'}</Td>
												<Td>{b.members.length} members</Td>
												<Td>{new Date(b.createdAt).toLocaleDateString()}</Td>
												<Td>
													<Badge 
														bgColor={b.isDeleted ? '#fdf2f2' : '#ecfdf5'} 
														textColor={b.isDeleted ? '#9b1c1c' : '#047857'}
													>
														{b.isDeleted ? 'Đã xóa tạm' : 'Hoạt động'}
													</Badge>
												</Td>
												<Td>
													<ActionButton 
														outline
														color={b.isDeleted ? '#10b981' : '#ef4444'}
														onClick={() => handleDeleteBoard(b._id)}
													>
														{b.isDeleted ? 'Khôi phục' : 'Xóa'}
													</ActionButton>
												</Td>
											</tr>
										))}
									</tbody>
								</Table>
							</TableWrapper>
						</Card>
					)}

					{activeTab === 'stats' && stats && (
						<>
							<StatsGrid>
								<StatCard iconColor="#4f46e5" bgColor="#f5f3ff">
									<StatHeader bgColor="#f5f3ff" iconColor="#4f46e5">
										<div className="icon-box"><GroupAddIcon /></div>
									</StatHeader>
									<StatValue>{stats.summary.totalUsers}</StatValue>
									<StatLabel>Tổng người dùng</StatLabel>
								</StatCard>
								<StatCard iconColor="#06b6d4" bgColor="#ecfeff">
									<StatHeader bgColor="#ecfeff" iconColor="#06b6d4">
										<div className="icon-box"><DashboardIcon /></div>
									</StatHeader>
									<StatValue>{stats.summary.totalBoards}</StatValue>
									<StatLabel>Tổng Board</StatLabel>
								</StatCard>
								<StatCard iconColor="#10b981" bgColor="#ecfdf5">
									<StatHeader bgColor="#ecfdf5" iconColor="#10b981">
										<div className="icon-box"><StorageIcon /></div>
									</StatHeader>
									<StatValue>{stats.summary.totalCards}</StatValue>
									<StatLabel>Tổng Card</StatLabel>
								</StatCard>
								<StatCard iconColor="#f59e0b" bgColor="#fffbeb">
									<StatHeader bgColor="#fffbeb" iconColor="#f59e0b">
										<div className="icon-box"><TrendingUpIcon /></div>
									</StatHeader>
									<StatValue>{onlineCount}</StatValue>
									<StatLabel>Người dùng Online</StatLabel>
								</StatCard>
							</StatsGrid>
							
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
								<Card>
									<SectionTitle>Tăng trưởng (6 tháng qua)</SectionTitle>
									<div style={{ height: '320px' }}>
										<ResponsiveContainer width="100%" height="100%">
											<BarChart data={stats.growth}>
												<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
												<XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
												<YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
												<Tooltip 
													contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
												/>
												<Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
											</BarChart>
										</ResponsiveContainer>
									</div>
								</Card>
								<Card>
									<SectionTitle>Cấu trúc hệ thống</SectionTitle>
									<div style={{ height: '320px' }}>
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={[
														{ name: 'Boards', value: stats.summary.totalBoards },
														{ name: 'Cards', value: stats.summary.totalCards },
														{ name: 'Users', value: stats.summary.totalUsers }
													]}
													cx="50%"
													cy="50%"
													innerRadius={60}
													outerRadius={100}
													paddingAngle={5}
													dataKey="value"
												>
													{[1,2,3].map((entry, index) => (
														<Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
													))}
												</Pie>
												<Tooltip 
													contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
												/>
											</PieChart>
										</ResponsiveContainer>
									</div>
								</Card>
							</div>
						</>
					)}

					{activeTab === 'logs' && (
						<Card>
							<TableWrapper>
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
												<Td style={{ color: '#64748b', fontSize: '0.85rem' }}>{new Date(log.createdAt).toLocaleString()}</Td>
												<Td style={{ fontWeight: '600' }}>{log.adminName}</Td>
												<Td>
													<Badge bgColor="#fff7ed" textColor="#c2410c">{log.action}</Badge>
												</Td>
												<Td>{log.targetType}</Td>
												<Td style={{ color: '#64748b' }}>{log.details}</Td>
											</tr>
										))}
									</tbody>
								</Table>
							</TableWrapper>
						</Card>
					)}

					{activeTab === 'settings' && (
						<Card>
							<SectionTitle>Thông báo hệ thống (System Banner)</SectionTitle>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
								<label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>
									<input 
										type="checkbox" 
										checked={notification.active} 
										onChange={(e) => setNotification({...notification, active: e.target.checked})}
										style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
									/> Kích hoạt thông báo trên Header
								</label>
								<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
									<label style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>Nội dung thông báo:</label>
									<textarea 
										rows="4" 
										style={{ padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', transition: 'all 0.2s' }}
										placeholder="Nhập nội dung thông báo cho người dùng..."
										value={notification.message}
										onChange={(e) => setNotification({...notification, message: e.target.value})}
										onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
										onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
									></textarea>
								</div>
								<ActionButton style={{ width: 'fit-content', padding: '0.75rem 1.5rem' }} onClick={handleSaveNotification}>
									Lưu cấu hình ngay
								</ActionButton>
							</div>
						</Card>
					)}
				</MainContent>
			</Container>
		</>
	);
};

const SectionTitle = styled.h3`
	font-size: 1.125rem;
	font-weight: 700;
	color: #1e293b;
	margin-bottom: 1.5rem;
`;

export default AdminDashboard;
