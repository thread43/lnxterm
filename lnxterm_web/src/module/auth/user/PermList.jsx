import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import {Space} from 'antd';
import {Tag} from 'antd';
import {Tree} from 'antd';
import {CaretDownOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function PermList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeUser = useSelector(store.getUser);
  const storePermListVisible = useSelector(store.getPermListVisible);

  const [statePerms, setStatePerms] = useState([]);
  const [stateCheckedKeys, setStateCheckedKeys] = useState([]);
  const [stateExpandedKeys, setStateExpandedKeys] = useState([]);
  const [statePermIds, setStatePermIds] = useState([]);
  const [stateAutoExpandParent, setStateAutoExpandParent] = useState(true);
  const [stateLoading, setStateLoading] = useState(false);

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const user_id = storeUser.id;

    try {
      setStateLoading(true);
      const response = await api.get_perms(user_id);
      // setStatePerms(response.data.data);
      setStatePerms(parsePerms(response.data.data));
      setStateCheckedKeys(response.data.checked_keys);
      setStateExpandedKeys(response.data.expanded_keys);
      setStatePermIds(response.data.checked_keys);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  function parsePerms(perms) {
    perms.forEach((item, index) => {
      item.children.forEach((item2, index2) => {
        item2.children.forEach((item3, index3) => {
          let title = item3['title'];
          let type = item3['type'];
          if (type === 0) {
            title = <span><Tag color="success" style={{width: '28px'}}>R</Tag>{title}</span>;
          } else if (type === 1) {
            title = <span><Tag color="warning">W</Tag>{title}</span>;
          } else {
            ;
          }
          perms[index]['children'][index2]['children'][index3]['title'] = title;
        });
      });
    });
    return [
      {
        key: 'root',
        title: 'Root',
        children: perms,
      },
    ];
  }

  async function grantPerm() {
    const user_id = storeUser.id;
    const perm_ids = statePermIds;

    try {
      await api.grant_perm(user_id, perm_ids);
      message.success('Request succeeded', 1);
      dispatch(store.setPermListVisible(false));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  function onCheck(checkedKeys, info) {
    setStateCheckedKeys(checkedKeys);
    const permIds = info.checkedNodes.filter(node => node.is_leaf === true).map(node => node.key);
    setStatePermIds(permIds);
  }

  function onExpand(expandedKeys) {
    setStateExpandedKeys(expandedKeys);
    setStateAutoExpandParent(false);
  }

  function expand() {
    let expandedKeys = [];
    statePerms.forEach((item) => {
      item.children.forEach((item2) => {
        item2.children.forEach((item3) => {
          item3.children.forEach((item4) => {
            expandedKeys.push(item4.key);
          });
        });
      });
    });
    setStateExpandedKeys(expandedKeys);
    setStateAutoExpandParent(true);
  }

  function collapse() {
    let expandedKeys = [];
    statePerms.forEach((item) => {
      item.children.forEach((item2) => {
        expandedKeys.push(item2.key);
      });
    });
    setStateExpandedKeys(expandedKeys);
    setStateAutoExpandParent(true);
  }

  function readonly() {
    let checkedKeys = [];
    let permIds = [];
    statePerms.forEach((item) => {
      item.children.forEach((item2) => {
        item2.children.forEach((item3) => {
          item3.children.forEach((item4) => {
            if (item4.type === 0) {
              checkedKeys.push(item4.key);
              permIds.push(item4.id);
            }
          });
        });
      });
    });
    setStateCheckedKeys(checkedKeys);
    setStatePermIds(permIds);
  }

  function readwrite() {
    let checkedKeys = [];
    let permIds = [];
    statePerms.forEach((item) => {
      item.children.forEach((item2) => {
        item2.children.forEach((item3) => {
          item3.children.forEach((item4) => {
            checkedKeys.push(item4.key);
            permIds.push(item4.id);
          });
        });
      });
    });
    setStateCheckedKeys(checkedKeys);
    setStatePermIds(permIds);
  }

  return (
    <>
      <Modal
        title="Grant Permissions"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        width={600}
        open={storePermListVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setPermListVisible(false))}
        onOk={() => grantPerm()}
      >
        <div className="MyContentHeader">
          <Space>
            <Button type="primary" onClick={() => expand()}>Expand</Button>
            <Button type="primary" onClick={() => collapse()}>Collapse</Button>
            <Button type="primary" onClick={() => readonly()}>Read-only</Button>
            <Button type="primary" onClick={() => readwrite()}>Read-write</Button>
          </Space>
        </div>
        <Form layout="horizontal">
          <Form.Item>
            <Tree
              autoExpandParent={stateAutoExpandParent}
              checkable={true}
              checkedKeys={stateCheckedKeys}
              expandedKeys={stateExpandedKeys}
              selectable={false}
              switcherIcon={<CaretDownOutlined className="TreeIcon" />}
              treeData={statePerms}
              onCheck={(checkedKeys, info) => onCheck(checkedKeys, info)}
              onExpand={(expandedKeys) => onExpand(expandedKeys)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default PermList;
