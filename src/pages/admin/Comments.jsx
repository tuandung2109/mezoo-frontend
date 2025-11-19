import { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  message, 
  Popconfirm,
  Input,
  Select,
  Card,
  Row,
  Col,
  Statistic,
  Avatar,
  Typography,
  Tooltip,
  Modal
} from 'antd';
import {
  DeleteOutlined,
  SearchOutlined,
  MessageOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LikeOutlined,
  EditOutlined,
  UndoOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { commentService } from '../../services/commentService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    isDeleted: undefined,
    sort: 'newest'
  });
  const [selectedComment, setSelectedComment] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchComments();
    fetchStats();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      };
      
      const response = await commentService.getAllComments(params);
      setComments(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (error) {
      message.error('Không thể tải danh sách bình luận');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await commentService.getCommentStats();
      setStats(response.data);
    } catch (error) {
      console.error('Không thể tải thống kê:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await commentService.deleteComment(id);
      message.success('Đã xóa bình luận');
      fetchComments();
      fetchStats();
    } catch (error) {
      message.error('Không thể xóa bình luận');
    }
  };

  const handleRestore = async (id) => {
    try {
      await commentService.restoreComment(id);
      message.success('Đã khôi phục bình luận');
      fetchComments();
      fetchStats();
    } catch (error) {
      message.error('Không thể khôi phục bình luận');
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const showCommentDetail = (comment) => {
    setSelectedComment(comment);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user',
      width: 180,
      render: (user) => (
        <Space>
          <Avatar src={user?.avatar} icon={<UserOutlined />} />
          <div>
            <div><Text strong>{user?.username}</Text></div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {user?.email}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Phim',
      dataIndex: 'movie',
      key: 'movie',
      width: 200,
      render: (movie) => (
        <Space>
          <Avatar 
            src={movie?.poster} 
            icon={<VideoCameraOutlined />}
            shape="square"
            size={40}
          />
          <Text strong>{movie?.title || 'N/A'}</Text>
        </Space>
      )
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (content, record) => (
        <Tooltip title="Xem chi tiết">
          <Paragraph 
            ellipsis={{ rows: 2 }}
            style={{ 
              marginBottom: 0, 
              cursor: 'pointer',
              color: record.isDeleted ? '#999' : 'inherit',
              fontStyle: record.isDeleted ? 'italic' : 'normal'
            }}
            onClick={() => showCommentDetail(record)}
          >
            {content}
            {record.isEdited && !record.isDeleted && (
              <Tag color="orange" style={{ marginLeft: 8 }}>
                <EditOutlined /> Đã sửa
              </Tag>
            )}
            {record.parentComment && (
              <Tag color="blue" style={{ marginLeft: 8 }}>
                Trả lời
              </Tag>
            )}
          </Paragraph>
        </Tooltip>
      )
    },
    {
      title: 'Lượt thích',
      dataIndex: 'likes',
      key: 'likes',
      width: 100,
      align: 'center',
      render: (likes) => (
        <Space>
          <LikeOutlined />
          <Text>{likes?.length || 0}</Text>
        </Space>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      width: 120,
      align: 'center',
      render: (isDeleted) => (
        <Tag color={isDeleted ? 'red' : 'green'}>
          {isDeleted ? 'Đã xóa' : 'Hoạt động'}
        </Tag>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => (
        <Tooltip title={dayjs(date).format('DD/MM/YYYY HH:mm')}>
          <Text type="secondary">{dayjs(date).fromNow()}</Text>
        </Tooltip>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => showCommentDetail(record)}
            />
          </Tooltip>
          {record.isDeleted ? (
            <Tooltip title="Khôi phục">
              <Popconfirm
                title="Khôi phục bình luận"
                description="Bạn có chắc muốn khôi phục bình luận này?"
                onConfirm={() => handleRestore(record._id)}
                okText="Khôi phục"
                cancelText="Hủy"
              >
                <Button 
                  type="text" 
                  icon={<UndoOutlined />}
                  style={{ color: '#52c41a' }}
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Popconfirm
              title="Xóa bình luận"
              description="Bạn có chắc muốn xóa bình luận này?"
              onConfirm={() => handleDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 16 }}>Quản lý Bình luận</h2>
        
        {stats && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng bình luận"
                  value={stats.totalComments}
                  prefix={<MessageOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Bình luận trả lời"
                  value={stats.totalReplies}
                  prefix={<MessageOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đã xóa"
                  value={stats.deletedComments}
                  prefix={<DeleteOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Người dùng tích cực nhất"
                  value={stats.mostActiveCommenters?.[0]?.count || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
                {stats.mostActiveCommenters?.[0] && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {stats.mostActiveCommenters[0].userInfo.username}
                  </Text>
                )}
              </Card>
            </Col>
          </Row>
        )}

        <Card>
          <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Search
                placeholder="Tìm kiếm nội dung bình luận..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="Trạng thái"
                allowClear
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange('isDeleted', value)}
              >
                <Option value="false">Hoạt động</Option>
                <Option value="true">Đã xóa</Option>
              </Select>
              <Select
                value={filters.sort}
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange('sort', value)}
              >
                <Option value="newest">Mới nhất</Option>
                <Option value="oldest">Cũ nhất</Option>
                <Option value="most-liked">Nhiều like nhất</Option>
              </Select>
            </Space>
          </Space>

          <Table
            columns={columns}
            dataSource={comments}
            rowKey="_id"
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>

      <Modal
        title="Chi tiết bình luận"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          selectedComment?.isDeleted ? (
            <Popconfirm
              key="restore"
              title="Khôi phục bình luận"
              description="Bạn có chắc muốn khôi phục bình luận này?"
              onConfirm={() => {
                handleRestore(selectedComment._id);
                setDetailModalVisible(false);
              }}
              okText="Khôi phục"
              cancelText="Hủy"
            >
              <Button type="primary" icon={<UndoOutlined />}>
                Khôi phục
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              key="delete"
              title="Xóa bình luận"
              description="Bạn có chắc muốn xóa bình luận này?"
              onConfirm={() => {
                handleDelete(selectedComment._id);
                setDetailModalVisible(false);
              }}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          )
        ]}
        width={700}
      >
        {selectedComment && (
          <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Phim:</Text>
                <div style={{ marginTop: 8 }}>
                  <Space>
                    <Avatar 
                      src={selectedComment.movie?.poster} 
                      shape="square"
                      size={64}
                    />
                    <Text strong style={{ fontSize: 16 }}>
                      {selectedComment.movie?.title}
                    </Text>
                  </Space>
                </div>
              </div>

              <div>
                <Text type="secondary">Người bình luận:</Text>
                <div style={{ marginTop: 8 }}>
                  <Space>
                    <Avatar src={selectedComment.user?.avatar} size={40} />
                    <div>
                      <div><Text strong>{selectedComment.user?.username}</Text></div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {selectedComment.user?.email}
                      </Text>
                    </div>
                  </Space>
                </div>
              </div>

              {selectedComment.parentComment && (
                <div>
                  <Text type="secondary">Trả lời bình luận:</Text>
                  <Card style={{ marginTop: 8, backgroundColor: '#f5f5f5' }}>
                    <Paragraph style={{ marginBottom: 0, fontSize: 12 }}>
                      {selectedComment.parentComment.content}
                    </Paragraph>
                  </Card>
                </div>
              )}

              <div>
                <Text type="secondary">Nội dung:</Text>
                <Card style={{ 
                  marginTop: 8, 
                  backgroundColor: selectedComment.isDeleted ? '#fff1f0' : '#fafafa' 
                }}>
                  <Paragraph style={{ 
                    marginBottom: 0,
                    fontStyle: selectedComment.isDeleted ? 'italic' : 'normal',
                    color: selectedComment.isDeleted ? '#999' : 'inherit'
                  }}>
                    {selectedComment.content}
                  </Paragraph>
                  <Space style={{ marginTop: 8 }}>
                    {selectedComment.isEdited && (
                      <Tag color="orange">
                        <EditOutlined /> Đã chỉnh sửa
                      </Tag>
                    )}
                    {selectedComment.isDeleted && (
                      <Tag color="red">
                        <DeleteOutlined /> Đã xóa
                      </Tag>
                    )}
                  </Space>
                </Card>
              </div>

              <div>
                <Space size="large">
                  <div>
                    <LikeOutlined style={{ marginRight: 8 }} />
                    <Text>{selectedComment.likes?.length || 0} lượt thích</Text>
                  </div>
                  <div>
                    <MessageOutlined style={{ marginRight: 8 }} />
                    <Text>{selectedComment.replies?.length || 0} trả lời</Text>
                  </div>
                  <div>
                    <Text type="secondary">
                      Đăng {dayjs(selectedComment.createdAt).fromNow()}
                    </Text>
                  </div>
                </Space>
              </div>
            </Space>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Comments;
