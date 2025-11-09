import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Form} from 'antd';
import {Popconfirm} from 'antd';
import {Select} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {Tag} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {SearchOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import {UndoOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function PermList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeContext = useSelector(store.getContext);
  const storePerms = useSelector(store.getPerms);
  const storePermTableLoading = useSelector(store.getPermTableLoading);
  const storeMenus = useSelector(store.getMenus);

  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(store.setContext({}));

    getPerms();

    getMenus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addPerm() {
    dispatch(store.setPermFormAddVisible(true));
  }

  async function deletePerm(id) {
    const {menu_id} = storeContext;

    try {
      await api.delete_perm(id);
      message.success('Request succeeded', 1);

      dispatch(store.setPermTableLoading(true));
      const response = await api.get_perms(menu_id);
      dispatch(store.setPerms(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPermTableLoading(false));
    }
  }

  function getPerm(id) {
    dispatch(store.setPerm({id}));
    dispatch(store.setPermDetailVisible(true));
  }

  async function getPerms() {
    const {menu_id} = storeContext;

    try {
      dispatch(store.setPermTableLoading(true));
      const response = await api.get_perms(menu_id);
      dispatch(store.setPerms(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPermTableLoading(false));
    }
  }

  function updatePerm(id) {
    dispatch(store.setPerm({id}));
    dispatch(store.setPermFormUpdateVisible(true));
  }

  function copyPerm(id) {
    dispatch(store.setPerm({id}));
    dispatch(store.setPermFormCopyVisible(true));
  }

  async function getMenus() {
    try {
      const response = await api.get_menus();
      dispatch(store.setMenus(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  async function changeMenu(menu_id) {
    dispatch(store.setContext({menu_id}));

    try {
      dispatch(store.setPermTableLoading(true));
      const response = await api.get_perms(menu_id);
      dispatch(store.setPerms(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPermTableLoading(false));
    }
  }

  async function reset() {
    form.resetFields();

    dispatch(store.setContext({}));

    try {
      dispatch(store.setPermTableLoading(true));
      const response = await api.get_perms();
      dispatch(store.setPerms(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPermTableLoading(false));
    }
  }

  async function search() {
    const {menu_id} = storeContext;

    try {
      dispatch(store.setPermTableLoading(true));
      const response = await api.get_perms(menu_id);
      dispatch(store.setPerms(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setPermTableLoading(false));
    }
  }

  const columns = [
    {
      key: 'code',
      title: 'Code',
      dataIndex: 'code',
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getPerm(record.id)}>{text}</Button>
      ),
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
      render: (text) => {
        if (text === 0) {
          return (<span><Tag color="success" bordered={false}>R</Tag></span>);
        } if (text === 1 ) {
          return (<span><Tag color="warning" bordered={false}>W</Tag></span>);
        } else {
          return '';
        }
      }
    },
    {
      key: 'menu_name',
      title: 'Menu',
      dataIndex: 'menu_name',
    },
    {
      key: 'actions',
      title: 'Actions',
      fixed: 'right',
      render: (record) => (
        <span>
          <Button type="link" className="ButtonLink" onClick={() => updatePerm(record.id)}>Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deletePerm(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
          >
            <Button type="link" className="ButtonLink">Delete</Button>
          </Popconfirm>
          <Divider type="vertical" />
          <Button type="link" className="ButtonLink" onClick={() => copyPerm(record.id)}>Copy</Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentBlock">
        <Form form={form} name="horizontal_login" layout="inline">
          <Form.Item name="menu_id" label="Menu" style={{marginTop: '2px'}}>
            <Select allowClear={true} style={{width: 200}} onChange={(value) => changeMenu(value)}>
              {storeMenus.map((item, index) => (
                <Select.Option key={index} value={item.id} disabled={item.is_parent}>
                  {item.alias}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{marginTop: '2px'}}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={() => search()}>Search</Button>
              <Button type="primary" icon={<UndoOutlined />} onClick={() => reset()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>

      <div className="MyContentDivider"></div>

      <div className="MyContentBlock">
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">Permission List</span>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => addPerm()}>New Permission</Button>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => getPerms()}>Refresh</Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={storePerms}
          loading={storePermTableLoading}
          pagination={false}
          showSorterTooltip={false}
          size="small"
          scroll={{x: 'max-content'}}
        />
      </div>
    </>
  );
}

export default PermList;
