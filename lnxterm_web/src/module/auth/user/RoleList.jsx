import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Checkbox} from 'antd';
import {Form} from 'antd';
import {Modal} from 'antd';
import api from './api.js';
import store from './store.js';

function RoleList() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeUser = useSelector(store.getUser);
  const storeRoleListVisible = useSelector(store.getRoleListVisible);

  const [stateRoles, setStateRoles] = useState([]);
  const [stateCheckedKeys, setStateCheckedKeys] = useState([]);
  const [stateRoleIds, setStateRoleIds] = useState([]);
  const [stateLoading, setStateLoading] = useState(false);

  useEffect(() => {
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init() {
    const user_id = storeUser.id;

    try {
      setStateLoading(true);
      const response = await api.get_roles(user_id);
      setStateRoles(response.data.data);
      setStateCheckedKeys(response.data.checked_keys);
      setStateRoleIds(response.data.checked_keys);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  async function assignRole() {
    const user_id = storeUser.id;
    const role_ids = stateRoleIds;

    try {
      await api.assign_role(user_id, role_ids);
      message.success('Request succeeded', 1);
      dispatch(store.setRoleListVisible(false));

      dispatch(store.setUserTableLoading(true));
      const response = await api.get_users();
      dispatch(store.setUsers(response.data.data));
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      dispatch(store.setUserTableLoading(false));
    }
  }

  function onChange(checkedValues) {
    setStateCheckedKeys(checkedValues);
    setStateRoleIds(checkedValues);
  }

  return (
    <>
      <Modal
        title="Assign Roles"
        centered={true}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        open={storeRoleListVisible}
        loading={stateLoading}
        onCancel={() => dispatch(store.setRoleListVisible(false))}
        onOk={() => assignRole()}
      >
        <div className="CenterDiv">
          <div className="LeftDiv">
            <Form layout="horizontal">
              <Form.Item>
                <Checkbox.Group
                  value={stateCheckedKeys}
                  onChange={(checkedValues) => onChange(checkedValues)}
                >
                  {stateRoles.map((item, index) => (
                    <div key={index} style={{lineHeight: '250%'}}>
                      <Checkbox value={item.id}>{item.name}</Checkbox>
                    </div>
                  ))}
                </Checkbox.Group>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default RoleList;
