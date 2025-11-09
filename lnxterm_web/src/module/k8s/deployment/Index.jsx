import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import DeploymentDetail from './DeploymentDetail.jsx';
import DeploymentList from './DeploymentList.jsx';
import DeploymentYaml from './DeploymentYaml.jsx';
import store from './store.js';

function Deployment() {
  const storeDeploymentDetailVisible = useSelector(store.getDeploymentDetailVisible);
  const storeDeploymentYamlVisible = useSelector(store.getDeploymentYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'Deployment List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <DeploymentList />
      </Layout.Content>

      {storeDeploymentDetailVisible === true && <DeploymentDetail />}
      {storeDeploymentYamlVisible === true && <DeploymentYaml />}
    </>
  );
}

export default Deployment;
