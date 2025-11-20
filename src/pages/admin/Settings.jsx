import { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Select,
  message,
  Tabs,
  Space,
  Divider,
  InputNumber,
  Upload,
  Typography,
  Row,
  Col
} from 'antd';
import {
  SaveOutlined,
  UploadOutlined,
  GlobalOutlined,
  SettingOutlined,
  SecurityScanOutlined,
  MailOutlined,
  DatabaseOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [generalForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [mediaForm] = Form.useForm();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      generalForm.setFieldsValue(settings.general || {});
      emailForm.setFieldsValue(settings.email || {});
      securityForm.setFieldsValue(settings.security || {});
      mediaForm.setFieldsValue(settings.media || {});
    } else {
      // Default values
      generalForm.setFieldsValue({
        siteName: 'MOZI',
        siteDescription: 'Nền tảng xem phim trực tuyến hàng đầu',
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        maintenanceMode: false,
        allowRegistration: true
      });

      emailForm.setFieldsValue({
        emailEnabled: true,
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpSecure: true,
        senderName: 'MOZI',
        senderEmail: 'noreply@mozi.com'
      });

      securityForm.setFieldsValue({
        requireEmailVerification: true,
        passwordMinLength: 6,
        sessionTimeout: 24,
        maxLoginAttempts: 5,
        enableTwoFactor: false
      });

      mediaForm.setFieldsValue({
        maxUploadSize: 100,
        allowedImageTypes: 'jpg,jpeg,png,webp',
        allowedVideoTypes: 'mp4,webm,mkv',
        imageQuality: 80,
        enableCDN: false
      });
    }
  };

  const saveSettings = (category, values) => {
    setLoading(true);
    try {
      const savedSettings = JSON.parse(localStorage.getItem('adminSettings') || '{}');
      savedSettings[category] = values;
      localStorage.setItem('adminSettings', JSON.stringify(savedSettings));
      
      message.success('Đã lưu cài đặt thành công');
    } catch (error) {
      message.error('Không thể lưu cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    {
      key: 'general',
      label: (
        <span>
          <GlobalOutlined /> Chung
        </span>
      ),
      children: (
        <Card>
          <Form
            form={generalForm}
            layout="vertical"
            onFinish={(values) => saveSettings('general', values)}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên website"
                  name="siteName"
                  rules={[{ required: true, message: 'Vui lòng nhập tên website' }]}
                >
                  <Input placeholder="MOZI" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngôn ngữ"
                  name="language"
                >
                  <Select>
                    <Option value="vi">Tiếng Việt</Option>
                    <Option value="en">English</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Mô tả website"
              name="siteDescription"
            >
              <TextArea rows={3} placeholder="Mô tả ngắn về website..." />
            </Form.Item>

            <Form.Item
              label="Múi giờ"
              name="timezone"
            >
              <Select>
                <Option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</Option>
                <Option value="Asia/Bangkok">Bangkok (GMT+7)</Option>
                <Option value="Asia/Singapore">Singapore (GMT+8)</Option>
              </Select>
            </Form.Item>

            <Divider />

            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item
                label="Chế độ bảo trì"
                name="maintenanceMode"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Text type="secondary">
                Khi bật, chỉ admin có thể truy cập website
              </Text>

              <Form.Item
                label="Cho phép đăng ký"
                name="allowRegistration"
                valuePropName="checked"
                style={{ marginTop: 16 }}
              >
                <Switch />
              </Form.Item>
              <Text type="secondary">
                Cho phép người dùng mới đăng ký tài khoản
              </Text>
            </Space>

            <Divider />

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />} 
                loading={loading}
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
              >
                Lưu cài đặt
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      key: 'email',
      label: (
        <span>
          <MailOutlined /> Email
        </span>
      ),
      children: (
        <Card>
          <Form
            form={emailForm}
            layout="vertical"
            onFinish={(values) => saveSettings('email', values)}
          >
            <Form.Item
              label="Bật gửi email"
              name="emailEnabled"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Divider>Cấu hình SMTP</Divider>

            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  label="SMTP Host"
                  name="smtpHost"
                >
                  <Input placeholder="smtp.gmail.com" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Port"
                  name="smtpPort"
                >
                  <InputNumber style={{ width: '100%' }} placeholder="587" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Username"
                  name="smtpUsername"
                >
                  <Input placeholder="your-email@gmail.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Password"
                  name="smtpPassword"
                >
                  <Input.Password placeholder="App password" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Sử dụng SSL/TLS"
              name="smtpSecure"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Divider>Thông tin người gửi</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tên người gửi"
                  name="senderName"
                >
                  <Input placeholder="MOZI" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Email người gửi"
                  name="senderEmail"
                >
                  <Input placeholder="noreply@mozi.com" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SaveOutlined />} 
                  loading={loading}
                  style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                >
                  Lưu cài đặt
                </Button>
                <Button>
                  Gửi email test
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      key: 'security',
      label: (
        <span>
          <SecurityScanOutlined /> Bảo mật
        </span>
      ),
      children: (
        <Card>
          <Form
            form={securityForm}
            layout="vertical"
            onFinish={(values) => saveSettings('security', values)}
          >
            <Form.Item
              label="Yêu cầu xác thực email"
              name="requireEmailVerification"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Text type="secondary">
              Người dùng phải xác thực email trước khi sử dụng
            </Text>

            <Divider />

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Độ dài mật khẩu tối thiểu"
                  name="passwordMinLength"
                >
                  <InputNumber min={6} max={20} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Số lần đăng nhập sai tối đa"
                  name="maxLoginAttempts"
                >
                  <InputNumber min={3} max={10} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Thời gian hết hạn phiên (giờ)"
              name="sessionTimeout"
            >
              <InputNumber min={1} max={168} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Bật xác thực 2 yếu tố"
              name="enableTwoFactor"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Text type="secondary">
              Yêu cầu mã OTP khi đăng nhập
            </Text>

            <Divider />

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />} 
                loading={loading}
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
              >
                Lưu cài đặt
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      key: 'media',
      label: (
        <span>
          <DatabaseOutlined /> Media
        </span>
      ),
      children: (
        <Card>
          <Form
            form={mediaForm}
            layout="vertical"
            onFinish={(values) => saveSettings('media', values)}
          >
            <Form.Item
              label="Kích thước upload tối đa (MB)"
              name="maxUploadSize"
            >
              <InputNumber min={1} max={500} style={{ width: '100%' }} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Định dạng ảnh cho phép"
                  name="allowedImageTypes"
                >
                  <Input placeholder="jpg,jpeg,png,webp" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Định dạng video cho phép"
                  name="allowedVideoTypes"
                >
                  <Input placeholder="mp4,webm,mkv" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Chất lượng ảnh (%)"
              name="imageQuality"
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Bật CDN"
              name="enableCDN"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Text type="secondary">
              Sử dụng CDN để tăng tốc độ tải media
            </Text>

            <Form.Item
              label="CDN URL"
              name="cdnUrl"
              style={{ marginTop: 16 }}
            >
              <Input placeholder="https://cdn.mozi.com" />
            </Form.Item>

            <Divider />

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />} 
                loading={loading}
                style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
              >
                Lưu cài đặt
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )
    }
  ];

  return (
    <div>
      <Title level={2}>
        <SettingOutlined /> Cài đặt hệ thống
      </Title>
      <Text type="secondary">
        Quản lý các cấu hình chung của hệ thống
      </Text>
      
      <div style={{ marginTop: 24 }}>
        <Tabs items={tabItems} />
      </div>
    </div>
  );
};

export default Settings;
