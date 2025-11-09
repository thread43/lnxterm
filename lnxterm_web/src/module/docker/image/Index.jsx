import {Link} from 'react-router';
import {useSelector} from 'react-redux';
import {Breadcrumb} from 'antd';
import {Layout} from 'antd';
import ImageDetail from './ImageDetail.jsx';
import ImageList from './ImageList.jsx';
import store from './store.js';

function Image() {
  const storeImageDetailVisible = useSelector(store.getImageDetailVisible);

  return (
    <>
      <Breadcrumb
        items={[
          {title: <Link to="/">Home</Link>},
          {title: <Link to="/docker">Docker</Link>},
          {title: 'Image List'},
        ]}
        className="MyBreadcrumb"
      />

      <Layout.Content className="MyContent2">
        <ImageList />
      </Layout.Content>

      {storeImageDetailVisible === true && <ImageDetail />}
    </>
  );
}

export default Image;
