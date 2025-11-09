import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {Tooltip} from 'antd';
import {SyncOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function LogList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeLogs = useSelector(store.getLogs);
  const storeLogsPagination = useSelector(store.getLogsPagination);
  const storeLogTableLoading = useSelector(store.getLogTableLoading);

  useEffect(() => {
    getLogs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function getLog(id) {
    dispatch(store.setLog({}));

    try {
      const response = await api.get_log(id);
      dispatch(store.setLog(response.data.data));

      dispatch(store.setLogDetailVisible(true));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  async function getLogs(page, size) {
    try {
      dispatch(store.setLogTableLoading(true));
      const response = await api.get_logs(page, size);
      dispatch(store.setLogs(response.data.data));

      if (response.data.pagination !== undefined) {
        const {page, size, total} = response.data.pagination;
        const pagination = {page, size, total};
        dispatch(store.setLogsPagination(pagination));
      }
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setLogTableLoading(false));
    }
  }

  function onChange(page, pageSize) {
    const size = pageSize;
    const pagination = {...storeLogsPagination, page, size};
    dispatch(store.setLogsPagination(pagination));
    getLogs(page, size);
  }

  function refreshLog() {
    const {page, size} = storeLogsPagination;
    getLogs(page, size);
  }

  const columns = [
    {
      key: 'nickname',
      title: 'User',
      dataIndex: 'nickname',
      sorter: (x, y) => x.nickname.localeCompare(y.nickname),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getLog(record.id)}>{text}</Button>
      ),
    },
    {
      key: 'path',
      title: 'Path',
      dataIndex: 'path',
    },
    {
      key: 'ip',
      title: 'IP',
      dataIndex: 'ip',
    },
    {
      key: 'user_agent',
      title: 'User Agent',
      dataIndex: 'user_agent',
      render: text => (
        <span>
          {text.length > 30 ? <Tooltip title={text}>{text.substring(0, 30) + '...'}</Tooltip> : text}
        </span>
      ),
    },
    {
      key: 'referer',
      title: 'Referer',
      dataIndex: 'referer',
      render: text => (
        <span>
          {text.length > 30 ? <Tooltip title={text}>{text.substring(0, 30) + '...'}</Tooltip> : text}
        </span>
      ),
    },
    {
      key: 'access_time',
      title: 'Accessed At',
      dataIndex: 'access_time',
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Log List</span>
        <Space>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => refreshLog()}>Refresh</Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={storeLogs}
        loading={storeLogTableLoading}
        showSorterTooltip={false}
        size="small"
        scroll={{x: 'max-content'}}
        pagination={{
          current: storeLogsPagination.page,
          pageSize: storeLogsPagination.size,
          total: storeLogsPagination.total,
          showSizeChanger: true,
          position: ['bottomRight'],
          onChange: (page, pageSize) => onChange(page, pageSize),
        }}
      />
    </>
  );
}

export default LogList;
