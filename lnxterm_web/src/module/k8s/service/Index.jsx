import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import ServiceDetail from './ServiceDetail.jsx';
import ServiceList from './ServiceList.jsx';
import ServiceYaml from './ServiceYaml.jsx';
import store from './store.js';

function Service() {
  const storeServiceDetailVisible = useSelector(store.getServiceDetailVisible);
  const storeServiceYamlVisible = useSelector(store.getServiceYamlVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'Service List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <ServiceList />
      </Layout.Content>

      {storeServiceDetailVisible === true && <ServiceDetail />}
      {storeServiceYamlVisible === true && <ServiceYaml />}
    </>
  );
}

export default Service;
