import {useEffect} from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import {App} from 'antd';
import {Button} from 'antd';
import {Drawer} from 'antd';
import {Space} from 'antd';
import {Table} from 'antd';
import {Upload} from 'antd';
import {RollbackOutlined} from '@ant-design/icons';
import {SyncOutlined} from '@ant-design/icons';
import {UploadOutlined} from '@ant-design/icons';
import api from './api.js';
import store from './store.js';

function PodFileBrowser() {
  const {message} = App.useApp();

  const dispatch = useDispatch();
  const storeContext = useSelector(store.getContext);
  const storePod = useSelector(store.getPod);
  const storePodFileBrowserVisible = useSelector(store.getPodFileBrowserVisible);

  const [stateFiles, setStateFiles] = useState([]);
  const [stateLoading, setStateLoading] = useState(false);
  const [stateDir, setStateDir] = useState('/');

  useEffect(() => {
    const dir = '/';
    init(dir);

    return () => {
      console.log('drawer unmounted......');
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function init(dir) {
    const pod = storePod;
    const container_name = storeContext.container_name;

    setStateDir(dir);

    try {
      setStateLoading(true);
      const response = await api.get_pod_files(pod, container_name, dir);
      setStateFiles(response.data.data);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    } finally {
      setStateLoading(false);
    }
  }

  function cdParentDir() {
    const fields = stateDir.split('/');
    fields.pop();

    let dir = fields.join('/');
    if (dir === '') {
      dir = '/';
    }

    init(dir);
  }

  async function download(file) {
    const pod = storePod;
    const container_name = storeContext.container_name;

    try {
      await api.download_pod_file(pod, container_name, file);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  }

  function refresh() {
    init(stateDir);
  }

  function handleChange(info) {
    if (info.file.status === 'uploading') {
      setStateLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      message.success('Upload succeeded');
      // setStateLoading(false);
      init(stateDir);
    }
    if (info.file.status === 'error') {
      setStateLoading(false);
      console.error(info.file.response);
      message.error('Upload failed');
    }
  }

  const columns = [
    {
      key: 'mode',
      title: 'Mode',
      dataIndex: 'mode',
      render: (text) => (<pre style={{margin: 0, padding: 0}}>{text}</pre>),
    },
    {
      key: 'size',
      title: 'Size (B)',
      dataIndex: 'size',
      sorter: (x, y) => x.size.localeCompare(y.size),
      sortDirections: ['ascend', 'descend'],
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => {
        if (record.is_dir) {
          return (<Button type="link" className="ButtonLink" onClick={() => init(record.abs_path)}>{text}</Button>);
        } else {
          return (text);
        }
      },
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (record) => (
        <span>
          <Button
            type="link"
            className="ButtonLink"
            disabled={record.is_file === false}
            onClick={() => download(record.abs_path)}
          >
            Download
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      <Drawer
        title="Pod File Browser"
        placement={'right'}
        width={800}
        destroyOnHidden="true"
        styles={{mask: {opacity: '0.1', animation: 'none'}}}
        onClose={() => dispatch(store.setPodFileBrowserVisible(false))}
        open={storePodFileBrowserVisible}
        extra={
          <Space>
            <Button onClick={() => dispatch(store.setPodFileBrowserVisible(false))}>Close</Button>
          </Space>
        }
      >
        <div className="MyContentHeader">
          <span className="MyContentHeaderTitle">
            {storeContext.container_name}:{stateDir}
          </span>
          <Space>
            <Button type="primary" icon={<RollbackOutlined />} onClick={() => cdParentDir()}>Go Back</Button>
            <Upload
              name="file"
              showUploadList={false}
              action={"/api/k8s/pod/upload_pod_file"}
              data={{
                cluster_id: storePod.cluster_id,
                namespace: storePod.namespace,
                pod_name: storePod.name,
                container_name: storeContext.container_name,
                dir: stateDir,
              }}
              onChange={(info) => handleChange(info)}
            >
              <Button type="primary" icon={<UploadOutlined />}>Upload</Button>
            </Upload>
            <Button type="primary" icon={<SyncOutlined />} onClick={() => refresh()}>Refresh</Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={stateFiles}
          loading={stateLoading}
          pagination={false}
          showSorterTooltip={false}
          size="small"
          scroll={{x: 'max-content'}}
        />
      </Drawer>
    </>
  );
}

export default PodFileBrowser;
