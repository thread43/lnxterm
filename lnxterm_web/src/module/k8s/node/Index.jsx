import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import NodeDetail from './NodeDetail.jsx';
import NodeList from './NodeList.jsx';
import NodeYaml from './NodeYaml.jsx';
import store from './store.js';

function Node() {
  const storeNodeDetailVisible = useSelector(store.getNodeDetailVisible);
  const storeNodeYamlVisible = useSelector(store.getNodeYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'Node List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <NodeList />
      </Layout.Content>

      {storeNodeDetailVisible === true && <NodeDetail />}
      {storeNodeYamlVisible === true && <NodeYaml />}
    </>
  );
}

export default Node;
