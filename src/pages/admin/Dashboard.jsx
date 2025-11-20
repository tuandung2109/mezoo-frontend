import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import {
  UserOutlined,
  VideoCameraOutlined,
  StarOutlined,
  EyeOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { Line, Column } from '@ant-design/plots';

function Dashboard() {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalReviews: 0,
    totalViews: 0
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      totalMovies: 39,
      totalUsers: 12,
      totalReviews: 143,
      totalViews: 1250
    });
  }, []);

  // Mock data for charts
  const viewsData = [
    { date: '2025-01', views: 120 },
    { date: '2025-02', views: 180 },
    { date: '2025-03', views: 250 },
    { date: '2025-04', views: 320 },
    { date: '2025-05', views: 280 },
    { date: '2025-06', views: 400 }
  ];

  const topMoviesData = [
    { title: 'Avengers: Endgame', views: 450 },
    { title: 'Spider-Man', views: 380 },
    { title: 'Inception', views: 320 },
    { title: 'The Dark Knight', views: 290 },
    { title: 'Interstellar', views: 250 }
  ];

  const lineConfig = {
    data: viewsData,
    xField: 'date',
    yField: 'views',
    smooth: true,
    color: '#E50914',
    point: {
      size: 5,
      shape: 'circle'
    }
  };

  const columnConfig = {
    data: topMoviesData,
    xField: 'title',
    yField: 'views',
    color: '#E50914',
    label: {
      position: 'top',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6
      }
    }
  };

  // Recent activities
  const recentActivities = [
    {
      key: '1',
      user: 'John Doe',
      action: 'Đã xem',
      movie: 'Avengers: Endgame',
      time: '5 phút trước'
    },
    {
      key: '2',
      user: 'Jane Smith',
      action: 'Đánh giá',
      movie: 'Spider-Man',
      time: '10 phút trước'
    },
    {
      key: '3',
      user: 'Mike Wilson',
      action: 'Thêm vào yêu thích',
      movie: 'Inception',
      time: '15 phút trước'
    }
  ];

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user'
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (action) => {
        let color = 'blue';
        if (action === 'Đánh giá') color = 'gold';
        if (action === 'Thêm vào yêu thích') color = 'red';
        return <Tag color={color}>{action}</Tag>;
      }
    },
    {
      title: 'Phim',
      dataIndex: 'movie',
      key: 'movie'
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time'
    }
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>
        Dashboard Overview
      </h1>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số phim"
              value={stats.totalMovies}
              prefix={<VideoCameraOutlined />}
              valueStyle={{ color: '#E50914' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đánh giá"
              value={stats.totalReviews}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Lượt xem"
              value={stats.totalViews}
              prefix={<EyeOutlined />}
              suffix={<RiseOutlined style={{ color: '#52c41a', fontSize: 14 }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Lượt xem theo tháng">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Top 5 phim xem nhiều nhất">
            <Column {...columnConfig} />
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Card title="Hoạt động gần đây">
        <Table 
          columns={columns} 
          dataSource={recentActivities} 
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default Dashboard;
