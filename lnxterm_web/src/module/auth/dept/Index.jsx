import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import DeptDetail from './DeptDetail.jsx';
import DeptFormAdd from './DeptFormAdd.jsx';
import DeptFormUpdate from './DeptFormUpdate.jsx';
import DeptList from './DeptList.jsx';
import store from './store.js';

function Dept() {
  const storeDeptDetailVisible = useSelector(store.getDeptDetailVisible);
  const storeDeptFormAddVisible = useSelector(store.getDeptFormAddVisible);
  const storeDeptFormUpdateVisible = useSelector(store.getDeptFormUpdateVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/auth">Auth</Link>},
          {title: 'Department List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent">
        <DeptList />
      </Layout.Content>

      {storeDeptDetailVisible === true && <DeptDetail />}
      {storeDeptFormAddVisible === true && <DeptFormAdd />}
      {storeDeptFormUpdateVisible === true && <DeptFormUpdate />}
    </>
  );
}

export default Dept;
