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
  Rate,
  Avatar,
  Typography,
  Tooltip,
  Modal
} from 'antd';
import {
  DeleteOutlined,
  SearchOutlined,
  StarOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LikeOutlined,
  EditOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { reviewService } from '../../services/reviewService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    rating: null,
    sort: 'newest'
  });
  const [selectedReview, setSelectedReview] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      };
      
      const response = await reviewService.getAllReviews(params);
      setReviews(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (error) {
      message.error('Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await reviewService.getReviewStats();
      setStats(response.data);
    } catch (error) {
      console.error('Không thể tải thống kê:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await reviewService.deleteReview(id);
      message.success('Đã xóa đánh giá');
      fetchReviews();
      fetchStats();
    } catch (error) {
      message.error('Không thể xóa đánh giá');
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

  const showReviewDetail = (review) => {
    setSelectedReview(review);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'Phim',
      dataIndex: 'movie',
      key: 'movie',
      width: 250,
      render: (movie) => (
        <Space>
          <Avatar 
            src={movie?.poster} 
            icon={<VideoCameraOutlined />}
            shape="square"
            size={50}
          />
          <Text strong>{movie?.title || 'N/A'}</Text>
        </Space>
      )
    },
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
              {user?.fullName || user?.email}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      align: 'center',
      render: (rating) => (
        <Rate disabled value={rating} style={{ fontSize: 16 }} />
      )
    },
    {
      title: 'Nội dung',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
      render: (comment, record) => (
        <Tooltip title="Xem chi tiết">
          <Paragraph 
            ellipsis={{ rows: 2 }}
            style={{ marginBottom: 0, cursor: 'pointer' }}
            onClick={() => showReviewDetail(record)}
          >
            {comment}
            {record.isEdited && (
              <Tag color="orange" style={{ marginLeft: 8 }}>
                <EditOutlined /> Đã chỉnh sửa
              </Tag>
            )}
          </Paragraph>
        </Tooltip>
      )
    },
    {
      title: 'Hữu ích',
      dataIndex: 'helpful',
      key: 'helpful',
      width: 100,
      align: 'center',
      render: (helpful) => (
        <Space>
          <LikeOutlined />
          <Text>{helpful?.length || 0}</Text>
        </Space>
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
              onClick={() => showReviewDetail(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa đánh giá"
            description="Bạn có chắc muốn xóa đánh giá này?"
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
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 16 }}>Quản lý Đánh giá</h2>
        
        {stats && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng đánh giá"
                  value={stats.totalReviews}
                  prefix={<StarOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đánh giá trung bình"
                  value={stats.averageRating}
                  suffix="/ 5"
                  precision={2}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Phim được đánh giá nhiều nhất"
                  value={stats.topReviewedMovies?.[0]?.count || 0}
                  prefix={<VideoCameraOutlined />}
                />
                {stats.topReviewedMovies?.[0] && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {stats.topReviewedMovies[0].movieInfo.title}
                  </Text>
                )}
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Người dùng tích cực nhất"
                  value={stats.mostActiveReviewers?.[0]?.count || 0}
                  prefix={<UserOutlined />}
                />
                {stats.mostActiveReviewers?.[0] && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {stats.mostActiveReviewers[0].userInfo.username}
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
                placeholder="Tìm kiếm nội dung đánh giá..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="Lọc theo rating"
                allowClear
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange('rating', value)}
              >
                <Option value={5}>5 sao</Option>
                <Option value={4}>4 sao</Option>
                <Option value={3}>3 sao</Option>
                <Option value={2}>2 sao</Option>
                <Option value={1}>1 sao</Option>
              </Select>
              <Select
                value={filters.sort}
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange('sort', value)}
              >
                <Option value="newest">Mới nhất</Option>
                <Option value="oldest">Cũ nhất</Option>
                <Option value="rating-high">Rating cao</Option>
                <Option value="rating-low">Rating thấp</Option>
                <Option value="helpful">Hữu ích nhất</Option>
              </Select>
            </Space>
          </Space>

          <Table
            columns={columns}
            dataSource={reviews}
            rowKey="_id"
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
          />
        </Card>
      </div>

      <Modal
        title="Chi tiết đánh giá"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Popconfirm
            key="delete"
            title="Xóa đánh giá"
            description="Bạn có chắc muốn xóa đánh giá này?"
            onConfirm={() => {
              handleDelete(selectedReview._id);
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
        ]}
        width={700}
      >
        {selectedReview && (
          <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Phim:</Text>
                <div style={{ marginTop: 8 }}>
                  <Space>
                    <Avatar 
                      src={selectedReview.movie?.poster} 
                      shape="square"
                      size={64}
                    />
                    <Text strong style={{ fontSize: 16 }}>
                      {selectedReview.movie?.title}
                    </Text>
                  </Space>
                </div>
              </div>

              <div>
                <Text type="secondary">Người đánh giá:</Text>
                <div style={{ marginTop: 8 }}>
                  <Space>
                    <Avatar src={selectedReview.user?.avatar} size={40} />
                    <div>
                      <div><Text strong>{selectedReview.user?.username}</Text></div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {selectedReview.user?.email}
                      </Text>
                    </div>
                  </Space>
                </div>
              </div>

              <div>
                <Text type="secondary">Đánh giá:</Text>
                <div style={{ marginTop: 8 }}>
                  <Rate disabled value={selectedReview.rating} />
                  <Text style={{ marginLeft: 8 }}>
                    {selectedReview.rating}/5
                  </Text>
                </div>
              </div>

              <div>
                <Text type="secondary">Nội dung:</Text>
                <Card style={{ marginTop: 8, backgroundColor: '#fafafa' }}>
                  <Paragraph style={{ marginBottom: 0 }}>
                    {selectedReview.comment}
                  </Paragraph>
                  {selectedReview.isEdited && (
                    <Tag color="orange" style={{ marginTop: 8 }}>
                      <EditOutlined /> Đã chỉnh sửa
                    </Tag>
                  )}
                </Card>
              </div>

              <div>
                <Space size="large">
                  <div>
                    <LikeOutlined style={{ marginRight: 8 }} />
                    <Text>{selectedReview.helpful?.length || 0} người thấy hữu ích</Text>
                  </div>
                  <div>
                    <Text type="secondary">
                      Đăng {dayjs(selectedReview.createdAt).fromNow()}
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

export default Reviews;
