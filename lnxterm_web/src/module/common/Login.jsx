import {useNavigate} from 'react-router';
import {App} from 'antd';
import {Button} from 'antd';
import {Form} from 'antd';
import {Input} from 'antd';
import {Layout} from 'antd';
import {LockOutlined} from '@ant-design/icons';
import {UserOutlined} from '@ant-design/icons';
import MyFooter from './MyFooter.jsx';
import api from './api.js';
import styles from './Login.module.css';
import logo from '/src/static/react/logo_dark.svg';

function Login() {
  const {message} = App.useApp();

  const navigate = useNavigate();

  const [form] = Form.useForm();

  async function login() {
    const user = form.getFieldsValue();

    const {username, password} = user;
    if (username === undefined || username.trim() === '') {
      message.info('Username is required');
      return;
    }
    if (password === undefined || password.trim() === '') {
      message.info('Password is required');
      return;
    }

    try {
      await api.login(user);
      navigate('/');
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  return (
    <>
      <Layout style={{minHeight: '100vh'}}>
        <Layout.Content className={styles.LoginLayout}>
          <div className={styles.LoginForm}>
            <div style={{textAlign: 'center', paddingBottom: '10px'}}>
              <img src={logo} alt="" className={styles.SiteLogo} />
              &nbsp;&nbsp;&nbsp;
              <span className={styles.SiteName}>LNXTERM</span>
            </div>

            <br />

            <Form
              form={form}
              name="normal_login"
            >
              <Form.Item name="username">
                <Input
                  prefix={<UserOutlined style={{color: 'rgba(0, 0, 0, 0.25)'}} />}
                  placeholder="Username"
                  size="large"
                />
              </Form.Item>
              <Form.Item name="password">
                <Input.Password
                  prefix={<LockOutlined style={{color: 'rgba(0, 0, 0, 0.25)'}} />}
                  type="password"
                  placeholder="Password"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{width: '100%'}}
                  onClick={() => login()}
                >
                  Log In
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Layout.Content>

        <MyFooter />
      </Layout>
    </>
  );
}

export default Login;
