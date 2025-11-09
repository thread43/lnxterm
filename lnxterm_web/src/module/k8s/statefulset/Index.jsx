import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import StatefulsetDetail from './StatefulsetDetail.jsx';
import StatefulsetList from './StatefulsetList.jsx';
import StatefulsetYaml from './StatefulsetYaml.jsx';
import store from './store.js';

function Statefulset() {
  const storeStatefulsetDetailVisible = useSelector(store.getStatefulsetDetailVisible);
  const storeStatefulsetYamlVisible = useSelector(store.getStatefulsetYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'StatefulSet List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <StatefulsetList />
      </Layout.Content>

      {storeStatefulsetDetailVisible === true && <StatefulsetDetail />}
      {storeStatefulsetYamlVisible === true && <StatefulsetYaml />}
    </>
  );
}

export default Statefulset;
