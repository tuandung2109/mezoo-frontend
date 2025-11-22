import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  VideoCameraOutlined,
  UserOutlined,
  StarOutlined,
  MessageOutlined,
  TagsOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined
} from '@ant-design/icons';
import Dashboard from './admin/Dashboard';
import Movies from './admin/Movies';
import Users from './admin/Users';
import Reviews from './admin/Reviews';
import Comments from './admin/Comments';
import Genres from './admin/Genres';
import Settings from './admin/Settings';
import 'antd/dist/reset.css';

const { Header, Sider, Content } = Layout;

function Admin() {
  useDocumentTitle('Quản trị');
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');

  useEffect(() => {
    // Đợi loading xong mới check authentication
    if (loading) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate, loading]);

  // Hiển thị loading khi đang check auth
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  // Không hiển thị gì nếu chưa đăng nhập hoặc không phải admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: 'movies',
      icon: <VideoCameraOutlined />,
      label: 'Quản lý phim'
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Quản lý người dùng'
    },
    {
      key: 'reviews',
      icon: <StarOutlined />,
      label: 'Quản lý đánh giá'
    },
    {
      key: 'comments',
      icon: <MessageOutlined />,
      label: 'Quản lý bình luận'
    },
    {
      key: 'genres',
      icon: <TagsOutlined />,
      label: 'Quản lý thể loại'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt'
    }
  ];

  const userMenuItems = [
    {
      key: 'back-to-site',
      icon: <HomeOutlined />,
      label: 'Về trang chủ',
      onClick: () => navigate('/')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: () => {
        logout();
        navigate('/');
      }
    }
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />;
      case 'movies':
        return <Movies />;
      case 'users':
        return <Users />;
      case 'reviews':
        return <Reviews />;
      case 'comments':
        return <Comments />;
      case 'genres':
        return <Genres />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#E50914',
          fontSize: collapsed ? 20 : 24,
          fontWeight: 'bold'
        }}>
          {collapsed ? 'M' : 'mezoo ADMIN'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />
          
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Avatar 
                src={user.avatar} 
                icon={<UserOutlined />}
                style={{ marginRight: 8 }}
              />
              <span>{user.fullName || user.username}</span>
            </div>
          </Dropdown>
        </Header>
        
        <Content style={{
          margin: '24px',
          padding: 24,
          minHeight: 280,
          background: '#fff',
          borderRadius: 8
        }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default Admin;
