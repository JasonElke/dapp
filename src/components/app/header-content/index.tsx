import './index.less';
import { FC } from 'react';

const HeaderContent: FC = props => {
  return <div className="header-content-layout">{props.children}</div>;
};

export default HeaderContent;
