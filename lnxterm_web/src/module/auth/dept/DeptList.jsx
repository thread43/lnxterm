import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Divider} from 'antd';
import {Popconfirm} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {QuestionCircleOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function DeptList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeDepts = useSelector(store.getDepts);
  const storeDeptTableLoading = useSelector(store.getDeptTableLoading);

  useEffect(() => {
    getDepts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function addDept() {
    dispatch(store.setDept({}));
    dispatch(store.setDeptFormAddVisible(true));
  }

  async function deleteDept(id) {
    try {
      await api.delete_dept(id);
      message.success('Request succeeded', 1);

      dispatch(store.setDeptTableLoading(true));
      const response = await api.get_depts();
      dispatch(store.setDepts(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setDeptTableLoading(false));
    }
  }

  function getDept(id) {
    dispatch(store.setDept({id}));
    dispatch(store.setDeptDetailVisible(true));
  }

  async function getDepts() {
    try {
      dispatch(store.setDeptTableLoading(true));
      const response = await api.get_depts();
      dispatch(store.setDepts(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setDeptTableLoading(false));
    }
  }

  function updateDept(id) {
    dispatch(store.setDept({id}));
    dispatch(store.setDeptFormUpdateVisible(true));
  }

  const columns = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sorter: (x, y) => x.name.localeCompare(y.name),
      sortDirections: ['ascend', 'descend'],
      render: (text, record) => (
        <Button type="link" className="ButtonLink" onClick={() => getDept(record.id)}>{text}</Button>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (record) => (
        <span>
          <Button type="link" className="ButtonLink" onClick={() => updateDept(record.id)}>Edit</Button>
          <Divider type="vertical" />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => deleteDept(record.id)}
            okText="Yes"
            cancelText="No"
            icon={<QuestionCircleOutlined style={{color: 'red'}} />}
          >
            <Button type="link" className="ButtonLink">Delete</Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="MyContentHeader">
        <span className="MyContentHeaderTitle">Department List</span>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addDept()}>New Department</Button>
          <Button type="primary" icon={<SyncOutlined />} onClick={() => getDepts()}>Refresh</Button>
        </Space>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={storeDepts}
        loading={storeDeptTableLoading}
        pagination={false}
        showSorterTooltip={false}
        size="small"
        scroll={{x: 'max-content'}}
      />
    </>
  );
}

export default DeptList;
