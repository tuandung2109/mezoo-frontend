import { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, Form, Input, InputNumber, 
  Select, DatePicker, Upload, message, Popconfirm, Tag, Image 
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { movieService } from '../../services/movieService';
import dayjs from 'dayjs';
import './Movies.css';

const { TextArea } = Input;
const { Option } = Select;

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  useEffect(() => {
    fetchMovies();
  }, [pagination.current, pagination.pageSize]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await movieService.getMovies({
        page: pagination.current,
        limit: pagination.pageSize
      });
      setMovies(response.movies || []);
      setPagination({
        ...pagination,
        total: response.total || 0
      });
    } catch (error) {
      message.error('Không thể tải danh sách phim');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMovie(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingMovie(record);
    
    // Debug: Check videos data
    console.log('Editing movie:', record);
    console.log('Videos:', record.videos);
    
    form.setFieldsValue({
      ...record,
      releaseDate: record.releaseDate ? dayjs(record.releaseDate) : null,
      genres: record.genres || [],
      videos: record.videos || []
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await movieService.deleteMovie(id);
      message.success('Đã xóa phim');
      fetchMovies();
    } catch (error) {
      message.error('Không thể xóa phim');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const movieData = {
        ...values,
        releaseDate: values.releaseDate ? values.releaseDate.toISOString() : null
      };

      if (editingMovie) {
        await movieService.updateMovie(editingMovie._id, movieData);
        message.success('Đã cập nhật phim');
      } else {
        await movieService.createMovie(movieData);
        message.success('Đã thêm phim mới');
      }

      setModalVisible(false);
      form.resetFields();
      fetchMovies();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const columns = [
    {
      title: 'Poster',
      dataIndex: 'poster',
      key: 'poster',
      width: 80,
      render: (poster) => (
        <Image
          src={poster || 'https://via.placeholder.com/50x75?text=No+Image'}
          alt="poster"
          width={50}
          height={75}
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      )
    },
    {
      title: 'Tên phim',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.originalTitle}</div>
        </div>
      )
    },
    {
      title: 'Thể loại',
      dataIndex: 'genres',
      key: 'genres',
      render: (genres) => (
        <>
          {genres?.slice(0, 2).map((genre, idx) => (
            <Tag key={idx} color="blue">{genre}</Tag>
          ))}
          {genres?.length > 2 && <Tag>+{genres.length - 2}</Tag>}
        </>
      )
    },
    {
      title: 'Năm',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      width: 80,
      render: (date) => date ? new Date(date).getFullYear() : '-'
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      render: (rating) => {
        const value = typeof rating === 'number' ? rating : rating?.average || 0;
        return (
          <Tag color={value >= 8 ? 'green' : value >= 6 ? 'blue' : 'orange'}>
            ⭐ {value.toFixed(1)}
          </Tag>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Ẩn'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      fixed: 'right',
      className: 'action-column',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/movie/${record._id}`, '_blank')}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xóa phim này?"
            description="Bạn có chắc muốn xóa phim này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const genreOptions = [
    'Hành động', 'Phiêu lưu', 'Hoạt hình', 'Hài', 'Tội phạm',
    'Tài liệu', 'Chính kịch', 'Gia đình', 'Giả tưởng', 'Lịch sử',
    'Kinh dị', 'Nhạc', 'Bí ẩn', 'Lãng mạn', 'Khoa học viễn tưởng',
    'Phim truyền hình', 'Gây cấn', 'Chiến tranh', 'Miền Tây'
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>
          Quản lý Phim
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          size="large"
          style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
        >
          Thêm phim mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={movies}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} phim`
        }}
        onChange={(newPagination) => {
          setPagination({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
            total: pagination.total
          });
        }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={editingMovie ? 'Chỉnh sửa phim' : 'Thêm phim mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={900}
        okText={editingMovie ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        okButtonProps={{ type: 'primary' }}
        styles={{
          body: {
            maxHeight: '70vh',
            overflowY: 'auto'
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Tên phim"
            rules={[{ required: true, message: 'Vui lòng nhập tên phim' }]}
          >
            <Input placeholder="Nhập tên phim" />
          </Form.Item>

          <Form.Item
            name="originalTitle"
            label="Tên gốc"
          >
            <Input placeholder="Nhập tên gốc" />
          </Form.Item>

          <Form.Item
            name="overview"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả phim" />
          </Form.Item>

          <Form.Item
            name="genres"
            label="Thể loại"
            rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn thể loại"
              options={genreOptions.map(g => ({ label: g, value: g }))}
            />
          </Form.Item>

          <Form.Item
            name="releaseDate"
            label="Ngày phát hành"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="runtime"
            label="Thời lượng (phút)"
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="poster"
            label="URL Poster"
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item
            name="backdrop"
            label="URL Backdrop"
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            initialValue="active"
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Ẩn</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Videos">
            <Form.List name="videos">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'quality']}
                        rules={[{ required: true, message: 'Chọn chất lượng' }]}
                      >
                        <Select placeholder="Chất lượng" style={{ width: 120 }}>
                          <Option value="480p">480p</Option>
                          <Option value="720p">720p</Option>
                          <Option value="1080p">1080p</Option>
                          <Option value="4k">4K</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'url']}
                        rules={[{ required: true, message: 'Nhập URL video' }]}
                      >
                        <Input placeholder="https://..." style={{ width: 400 }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'size']}
                      >
                        <Select placeholder="Size" style={{ width: 100 }}>
                          <Option value="SD">SD</Option>
                          <Option value="HD">HD</Option>
                          <Option value="Full HD">Full HD</Option>
                          <Option value="4K">4K</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'language']}
                      >
                        <Select placeholder="Ngôn ngữ" style={{ width: 100 }}>
                          <Option value="vi">Tiếng Việt</Option>
                          <Option value="en">English</Option>
                        </Select>
                      </Form.Item>
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Thêm video
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Movies;
