import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import ClusterDetail from './ClusterDetail.jsx';
import ClusterFormAdd from './ClusterFormAdd.jsx';
import ClusterFormUpdate from './ClusterFormUpdate.jsx';
import ClusterList from './ClusterList.jsx';
import EventList from './EventList.jsx';
import store from './store.js';

function Cluster() {
  const storeClusterDetailVisible = useSelector(store.getClusterDetailVisible);
  const storeClusterFormAddVisible = useSelector(store.getClusterFormAddVisible);
  const storeClusterFormUpdateVisible = useSelector(store.getClusterFormUpdateVisible);
  const storeEventListVisible = useSelector(store.getEventListVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'Cluster List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent">
        <ClusterList />
      </Layout.Content>

      {storeClusterDetailVisible === true && <ClusterDetail />}
      {storeClusterFormAddVisible === true && <ClusterFormAdd />}
      {storeClusterFormUpdateVisible === true && <ClusterFormUpdate />}
      {storeEventListVisible === true && <EventList />}
    </>
  );
}

export default Cluster;
