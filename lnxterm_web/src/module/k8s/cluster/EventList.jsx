import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Modal} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {SyncOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function EventList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeCluster = useSelector(store.getCluster);
  const storeEventListVisible = useSelector(store.getEventListVisible);

  const [stateEvents, setStateEvents] = useState([]);
  const [stateTableLoading, setStateTableLoading] = useState(false);

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    try {
      setStateTableLoading(true);
      const cluster_id = storeCluster.id;
      const response = await api.get_events(cluster_id);
      setStateEvents(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateTableLoading(false);
    }
  }

  function refresh() {
    init();
  }

  const columns = [
    {
      key: 'namespace',
      title: 'Namespace',
      dataIndex: 'namespace',
    },
    {
      key: 'time',
      title: 'Time',
      dataIndex: 'time',
    },
    {
      key: 'type',
      title: 'Type',
      dataIndex: 'type',
    },
    {
      key: 'reason',
      title: 'Reason',
      dataIndex: 'reason',
    },
    {
      key: 'object',
      title: 'Object',
      dataIndex: 'object',
    },
    {
      key: 'message',
      title: 'Message',
      dataIndex: 'message',
      render: (text) => (
        text
      ),
    },
  ];

  return (
    <>
      <Modal
        title="Event List"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={1000}
        open={storeEventListVisible}
        onCancel={() => dispatch(store.setEventListVisible(false))}
        footer={[
          <Button key="close" onClick={() => dispatch(store.setEventListVisible(false))}>Close</Button>,
        ]}
      >
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">
            {storeCluster.name} ({storeCluster.server})
          </span>
          <Space>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>

        <Table
          rowKey="name"
          columns={columns}
          dataSource={stateEvents}
          loading={stateTableLoading}
          pagination={false}
          showSorterTooltip={false}
          size="small"
          scroll={{x: 'max-content'}}
        />
      </Modal>
    </>
  );
}

export default EventList;
