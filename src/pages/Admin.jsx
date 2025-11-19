import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  VideoCameraOutlined,
  UserOutlined,
  StarOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined
} from '@ant-design/icons';
import Dashboard from './admin/Dashboard';
import Movies from './admin/Movies';
import 'antd/dist/reset.css';

const { Header, Sider, Content } = Layout;

function Admin() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('dashboard');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

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
        return <div>Quản lý người dùng - Đang phát triển</div>;
      case 'reviews':
        return <div>Quản lý đánh giá - Đang phát triển</div>;
      case 'settings':
        return <div>Cài đặt - Đang phát triển</div>;
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
          {collapsed ? 'M' : 'MOZI ADMIN'}
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
