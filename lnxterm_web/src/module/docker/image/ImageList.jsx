import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Form} from 'antd';
import {Select} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import {UndoOutlined} from '@ant-design/icons';
import api from './api.js';
import commonStore from '../common/store.js';
import store from './store.js';

function ImageList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const commonStoreContext = useSelector(commonStore.getContext);
  const commonStoreServers = useSelector(commonStore.getServers);
  const storeImages = useSelector(store.getImages);
  const storeImageTableLoading = useSelector(store.getImageTableLoading);

  const [form] = Form.useForm();

  useEffect(() => {
    init(commonStoreContext);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init(context) {
    let {server_id} = context;

    form.resetFields();

    try {
      dispatch(store.setImageTableLoading(true));

      const response = await api.get_servers();
      dispatch(commonStore.setServers(response.data.data));

      const servers = response.data.data;
      if (servers.length === 0) {
        message.info('Server not found');
        return;
      }

      if (server_id === undefined) {
        server_id = servers[0].id;
        dispatch(commonStore.setContext({server_id}));
      }

      form.setFieldsValue({server_id});

      const response2 = await api.get_images(server_id);
      if (response2.status === 999) {
        message.info('Server not found');
      } else {
        dispatch(store.setImages(response2.data.data));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setImageTableLoading(false));
    }
  }

  async function changeServer(value) {
    const server_id = value;

    dispatch(commonStore.setContext({server_id}));
    dispatch(store.setImages([]));

    try {
      dispatch(store.setImageTableLoading(true));
      const response = await api.get_images(server_id);
      if (response.status === 999) {
        message.info('Server not found');
      } else {
        dispatch(store.setImages(response.data.data));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setImageTableLoading(false));
    }
  }

  function getImage(image) {
    dispatch(store.setImage(image));
    dispatch(store.setImageDetailVisible(true));
  }

  function refresh() {
    search();
  }

  function reset() {
    const context = {};
    dispatch(commonStore.setContext({}));
    init(context);
  }

  async function search() {
    const form_value = form.getFieldsValue();
    const server_id = form_value.server_id;

    try {
      dispatch(store.setImageTableLoading(true));
      const response = await api.get_images(server_id);
      if (response.status === 999) {
        message.info('Server not found');
      } else {
        dispatch(store.setImages(response.data.data));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setImageTableLoading(false));
    }
  }

  const columns = [
    {
      key: 'image_id',
      title: 'Image ID',
      dataIndex: 'image_id',
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getImage(record)}>{text}</Button>
      ),
    },
    {
      key: 'repository',
      title: 'Repository',
      dataIndex: 'repository',
    },
    {
      key: 'tag',
      title: 'Tag',
      dataIndex: 'tag',
    },
    {
      key: 'size',
      title: 'Size (B)',
      dataIndex: 'size',
    },
  ];

  return (
    <>
      <div className="MyContentBlock">
        <Form form={form} name="horizontal_login" layout="inline">
          <Form.Item name="server_id" label="Server" style={{marginTop: '2px'}}>
            <Select
              allowClear={false}
              style={{width: 200}}
              onChange={(value) => changeServer(value)}
              options={commonStoreServers.map((item) => (
                {value: item.id, label: item.name}
              ))}
            />
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
          <span className="MyContentHeaderTitle">Image List</span>
          <Space>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>

        <Table
          rowKey="image_id"
          columns={columns}
          dataSource={storeImages}
          loading={storeImageTableLoading}
          pagination={false}
          showSorterTooltip={false}
          size="small"
          scroll={{x: 'max-content'}}
        />
      </div>
    </>
  );
}

export default ImageList;
