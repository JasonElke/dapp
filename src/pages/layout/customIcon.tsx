import { FC } from 'react';
import {
  UsergroupAddOutlined,
  AppstoreOutlined,
  SettingOutlined,
  AreaChartOutlined,
  ShopOutlined,
  TeamOutlined,
  BankOutlined,
  IdcardOutlined,
} from '@ant-design/icons';

interface CustomIconProps {
  type: number;
}

export const CustomIcon: FC<CustomIconProps> = props => {
  const { type } = props;
  let com;

  switch (type) {
    case MENU_LIST_ICON.dashboard:
      com = <AreaChartOutlined />;
      break;
    case MENU_LIST_ICON.configSetting:
      com = <SettingOutlined />;
      break;
    case MENU_LIST_ICON.product:
      com = <AppstoreOutlined />;
      break;
    case MENU_LIST_ICON.system:
      com = <UsergroupAddOutlined />;
      break;
    case MENU_LIST_ICON.distributor:
      com = <ShopOutlined />;
      break;
    case MENU_LIST_ICON.retailer:
      com = <TeamOutlined />;
      break;
    case MENU_LIST_ICON.collaborator:
      com = <IdcardOutlined />;
      break;
    case MENU_LIST_ICON.inventory:
      com = <BankOutlined />;
    default:
      break;
  }

  return <span className="anticon">{com}</span>;
};

export enum MENU_LIST_ICON {
  dashboard,
  system,
  account,
  default,
  product,
  configSetting,
  distributor,
  retailer,
  collaborator,
  order,
  inventory,
}
