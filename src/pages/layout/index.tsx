import { FC } from 'react';
import { Layout } from 'antd';
import HeaderComponent from './header';
import { Outlet } from 'react-router';
import Footer from '@/pages/layout/footer';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './index.less';

const { Content } = Layout;

const LayoutPage: FC = () => {
  return (
    <Layout className="layout-page">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <HeaderComponent collapsed="true" className="layout-page__header" />

      <Content className="layout-page-main__content">
        <Outlet />
      </Content>

      <Footer />
    </Layout>
  );
};

export default LayoutPage;
