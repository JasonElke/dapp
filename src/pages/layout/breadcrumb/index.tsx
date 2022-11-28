import { FC } from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const BreadcrumbApp: FC = () => {
  const breadcrumbNameMap: any = {
    '/dashboard': 'Dashboard',
  };

  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);
  const extraBreadcrumbItems: any = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

    if (breadcrumbNameMap[url])
      return (
        <Breadcrumb.Item key={url}>
          <Link to={url}>{breadcrumbNameMap[url]}</Link>
        </Breadcrumb.Item>
      );
  });

  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <div
      id="pageTabs"
      style={{
        padding: '0 10px',
        paddingLeft: '24px',
        backgroundColor: 'white',
        minHeight: '48px',
        borderBottom: '1px solid lightgray',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
    </div>
  );
};

export default BreadcrumbApp;
