import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import PodDetail from './PodDetail.jsx';
import PodFileBrowser from './PodFileBrowser.jsx';
import PodList from './PodList.jsx';
import PodLog from './PodLog.jsx';
import PodTerminal from './PodTerminal.jsx';
import PodYaml from './PodYaml.jsx';
import store from './store.js';

function Pod() {
  const storePodDetailVisible = useSelector(store.getPodDetailVisible);
  const storePodYamlVisible = useSelector(store.getPodYamlVisible);
  const storePodLogVisible = useSelector(store.getPodLogVisible);
  const storePodTerminalVisible = useSelector(store.getPodTerminalVisible);
  const storePodFileBrowserVisible = useSelector(store.getPodFileBrowserVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/k8s">Kubernetes</Link>},
          {title: 'Pod List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <PodList />
      </Layout.Content>

      {storePodDetailVisible === true && <PodDetail />}
      {storePodYamlVisible === true && <PodYaml />}
      {storePodLogVisible === true && <PodLog />}
      {storePodTerminalVisible === true && <PodTerminal />}
      {storePodFileBrowserVisible === true && <PodFileBrowser />}
    </>
  );
}

export default Pod;
