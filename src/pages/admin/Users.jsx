import { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, Tag, Avatar, Switch, 
  Select, Drawer, Descriptions, Statistic, Row, Col, message 
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  CrownOutlined,
  StarOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { userService } from '../../services/userService';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Option } = Select;

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers({
        page: pagination.current,
        limit: pagination.pageSize
      });

      setUsers(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.total
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Không thể tải danh sách người dùng');
      setLoading(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDrawerVisible(true);
  };

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      await userService.toggleUserActive(userId);
      message.success(currentStatus ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản');
      fetchUsers();
    } catch (error) {
      message.error('Không thể thay đổi trạng thái');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await userService.updateUserRole(userId, newRole);
      message.success(`Đã đổi role thành ${newRole}`);
      fetchUsers();
    } catch (error) {
      message.error('Không thể thay đổi role');
    }
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      width: 250,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.fullName || record.username}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
          </div>
        </Space>
      )
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      render: (role, record) => (
        <Select
          value={role}
          style={{ width: 120 }}
          onChange={(value) => handleChangeRole(record._id, value)}
        >
          <Option value="user">User</Option>
          <Option value="admin">Admin</Option>
          <Option value="moderator">Moderator</Option>
        </Select>
      )
    },
    {
      title: 'Gói',
      dataIndex: ['subscription', 'plan'],
      key: 'subscription',
      width: 100,
      render: (plan) => {
        const colors = {
          free: 'default',
          basic: 'blue',
          premium: 'purple',
          vip: 'gold'
        };
        return <Tag color={colors[plan]}>{plan.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren="Hoạt động"
          unCheckedChildren="Khóa"
          onChange={(checked) => handleToggleActive(record._id, isActive)}
        />
      )
    },
    {
      title: 'Đăng ký',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Đăng nhập',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 120,
      render: (date) => dayjs(date).fromNow()
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          Chi tiết
        </Button>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>
          Quản lý Người dùng
        </h1>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} người dùng`
        }}
        onChange={(newPagination) => {
          setPagination({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
            total: pagination.total
          });
        }}
        scroll={{ x: 1000 }}
      />

      {/* User Details Drawer */}
      <Drawer
        title="Thông tin người dùng"
        placement="right"
        width={600}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedUser && (
          <div>
            {/* User Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={100} src={selectedUser.avatar} icon={<UserOutlined />} />
              <h2 style={{ marginTop: 16, marginBottom: 4 }}>
                {selectedUser.fullName || selectedUser.username}
              </h2>
              <p style={{ color: '#999' }}>{selectedUser.email}</p>
              <Space>
                <Tag color={selectedUser.role === 'admin' ? 'red' : 'blue'}>
                  {selectedUser.role.toUpperCase()}
                </Tag>
                <Tag color={selectedUser.isActive ? 'green' : 'red'}>
                  {selectedUser.isActive ? 'Hoạt động' : 'Đã khóa'}
                </Tag>
              </Space>
            </div>

            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Statistic
                  title="Đã xem"
                  value={selectedUser.stats.moviesWatched}
                  prefix={<VideoCameraOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Yêu thích"
                  value={selectedUser.stats.favorites}
                  prefix={<StarOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Đánh giá"
                  value={selectedUser.stats.reviews}
                  prefix={<StarOutlined />}
                />
              </Col>
            </Row>

            {/* Details */}
            <Descriptions title="Thông tin chi tiết" column={1} bordered>
              <Descriptions.Item label="Username">
                {selectedUser.username}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedUser.email}
              </Descriptions.Item>
              <Descriptions.Item label="Họ tên">
                {selectedUser.fullName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={selectedUser.role === 'admin' ? 'red' : 'blue'}>
                  {selectedUser.role}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Gói đăng ký">
                <Tag color="purple">
                  {selectedUser.subscription.plan.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đăng ký">
                {dayjs(selectedUser.createdAt).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Đăng nhập gần nhất">
                {dayjs(selectedUser.lastLogin).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={selectedUser.isActive ? 'green' : 'red'}>
                  {selectedUser.isActive ? 'Hoạt động' : 'Đã khóa'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
}

export default Users;
