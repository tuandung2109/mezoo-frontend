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
  Modal,
  Form,
  Switch,
  Tooltip
} from 'antd';
import {
  DeleteOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  TagsOutlined,
  VideoCameraOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { genreService } from '../../services/genreService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    isActive: undefined,
    sort: 'name'
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [moviesModalVisible, setMoviesModalVisible] = useState(false);
  const [selectedGenreMovies, setSelectedGenreMovies] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchGenres();
    fetchStats();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...filters
      };
      
      const response = await genreService.getAllGenres(params);
      setGenres(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (error) {
      message.error('Không thể tải danh sách thể loại');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await genreService.getGenreStats();
      setStats(response.data);
    } catch (error) {
      console.error('Không thể tải thống kê:', error);
    }
  };

  const handleCreate = () => {
    setEditingGenre(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (genre) => {
    setEditingGenre(genre);
    form.setFieldsValue(genre);
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingGenre) {
        await genreService.updateGenre(editingGenre._id, values);
        message.success('Đã cập nhật thể loại');
      } else {
        await genreService.createGenre(values);
        message.success('Đã tạo thể loại mới');
      }
      setModalVisible(false);
      fetchGenres();
      fetchStats();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    try {
      await genreService.deleteGenre(id);
      message.success('Đã xóa thể loại');
      fetchGenres();
      fetchStats();
    } catch (error) {
      message.error('Không thể xóa thể loại');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await genreService.toggleGenreStatus(id);
      message.success('Đã cập nhật trạng thái');
      fetchGenres();
      fetchStats();
    } catch (error) {
      message.error('Không thể cập nhật trạng thái');
    }
  };

  const handleViewMovies = async (genre) => {
    try {
      const response = await genreService.getGenreMovies(genre._id, { limit: 20 });
      setSelectedGenreMovies(response.data);
      setMoviesModalVisible(true);
    } catch (error) {
      message.error('Không thể tải danh sách phim');
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

  const columns = [
    {
      title: 'Tên thể loại',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name, record) => (
        <Space>
          {record.icon && <span style={{ fontSize: 20 }}>{record.icon}</span>}
          <span style={{ fontWeight: 'bold' }}>{name}</span>
        </Space>
      )
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      width: 150,
      render: (slug) => <Tag>{slug}</Tag>
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc) => desc || <span style={{ color: '#999' }}>Chưa có mô tả</span>
    },
    {
      title: 'Số phim',
      dataIndex: 'movieCount',
      key: 'movieCount',
      width: 100,
      align: 'center',
      render: (count, record) => (
        <Tooltip title="Xem danh sách phim">
          <Button 
            type="link" 
            onClick={() => handleViewMovies(record)}
            icon={<VideoCameraOutlined />}
          >
            {count}
          </Button>
        </Tooltip>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      align: 'center',
      render: (isActive, record) => (
        <Popconfirm
          title={`${isActive ? 'Ẩn' : 'Hiện'} thể loại này?`}
          onConfirm={() => handleToggleStatus(record._id)}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Tag 
            color={isActive ? 'green' : 'red'}
            style={{ cursor: 'pointer' }}
            icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          >
            {isActive ? 'Hoạt động' : 'Ẩn'}
          </Tag>
        </Popconfirm>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => (
        <Tooltip title={dayjs(date).format('DD/MM/YYYY HH:mm')}>
          <span>{dayjs(date).fromNow()}</span>
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
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa thể loại"
            description="Bạn có chắc muốn xóa thể loại này?"
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
        <h2 style={{ marginBottom: 16 }}>Quản lý Thể loại</h2>
        
        {stats && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng thể loại"
                  value={stats.totalGenres}
                  prefix={<TagsOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đang hoạt động"
                  value={stats.activeGenres}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Đã ẩn"
                  value={stats.inactiveGenres}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Thể loại phổ biến nhất"
                  value={stats.topGenres?.[0]?.movieCount || 0}
                  prefix={<VideoCameraOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
                {stats.topGenres?.[0] && (
                  <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                    {stats.topGenres[0].name}
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        )}

        <Card>
          <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
            <Space>
              <Search
                placeholder="Tìm kiếm thể loại..."
                allowClear
                onSearch={handleSearch}
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="Trạng thái"
                allowClear
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange('isActive', value)}
              >
                <Option value="true">Hoạt động</Option>
                <Option value="false">Đã ẩn</Option>
              </Select>
              <Select
                value={filters.sort}
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange('sort', value)}
              >
                <Option value="name">Tên A-Z</Option>
                <Option value="movieCount">Nhiều phim nhất</Option>
                <Option value="newest">Mới nhất</Option>
                <Option value="oldest">Cũ nhất</Option>
              </Select>
            </Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              Thêm thể loại
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={genres}
            rowKey="_id"
            loading={loading}
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
          />
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        title={editingGenre ? 'Chỉnh sửa thể loại' : 'Thêm thể loại mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Tên thể loại"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên thể loại' }]}
          >
            <Input placeholder="Ví dụ: Hành động" />
          </Form.Item>

          <Form.Item
            label="Slug"
            name="slug"
            rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
          >
            <Input placeholder="Ví dụ: hanh-dong" />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
          >
            <TextArea rows={3} placeholder="Mô tả ngắn về thể loại..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Icon (Emoji)"
                name="icon"
              >
                <Input placeholder="🎬" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Màu sắc"
                name="color"
              >
                <Input type="color" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Trạng thái"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Ẩn" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingGenre ? 'Cập nhật' : 'Tạo mới'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Movies Modal */}
      <Modal
        title={`Phim thuộc thể loại: ${selectedGenreMovies?.genre?.name}`}
        open={moviesModalVisible}
        onCancel={() => setMoviesModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedGenreMovies && (
          <div>
            <p style={{ marginBottom: 16 }}>
              Tổng số: <strong>{selectedGenreMovies.pagination.total}</strong> phim
            </p>
            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
              {selectedGenreMovies.movies.map((movie) => (
                <Card 
                  key={movie._id} 
                  size="small" 
                  style={{ marginBottom: 8 }}
                  hoverable
                >
                  <Space>
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      style={{ width: 50, height: 75, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{movie.title}</div>
                      <Space size="small">
                        <Tag>{new Date(movie.releaseDate).getFullYear()}</Tag>
                        <Tag color="gold">⭐ {movie.rating?.average || 0}</Tag>
                        <Tag color="blue">👁 {movie.views || 0}</Tag>
                      </Space>
                    </div>
                  </Space>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Genres;
