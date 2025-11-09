import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import NamespaceDetail from './NamespaceDetail.jsx';
import NamespaceList from './NamespaceList.jsx';
import NamespaceYaml from './NamespaceYaml.jsx';
import store from './store.js';

function Namespace() {
  const storeNamespaceDetailVisible = useSelector(store.getNamespaceDetailVisible);
  const storeNamespaceYamlVisible = useSelector(store.getNamespaceYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'Namespace List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <NamespaceList />
      </Layout.Content>

      {storeNamespaceDetailVisible === true && <NamespaceDetail />}
      {storeNamespaceYamlVisible === true && <NamespaceYaml />}
    </>
  );
}

export default Namespace;
