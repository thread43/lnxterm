import {Layout} from 'antd';
import MyContent from '../common/MyContent.jsx';
import MyHeader from '../common/MyHeader.jsx';
import MySider from '../common/MySider.jsx';
import MyFooter from '../common/MyFooter.jsx';
import '../common/MyLayout.module.css';

function TestLayout() {
  return (
    <Layout className="MyLayout">
      <MySider />

      <Layout>
        <MyHeader />

        <MyContent />

        <MyFooter />
      </Layout>
    </Layout>
  );
}

export default TestLayout;
