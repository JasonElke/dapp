import { FC } from 'react';
import { Menu } from 'antd';
import { MenuList } from '../../interface/layout/menu.interface';
import { useNavigate } from 'react-router-dom';
import { CustomIcon } from './customIcon';
import classNames from 'classnames';

const { SubMenu, Item } = Menu;

interface MenuProps {
  menuList: MenuList;
  openKey?: string;
  onChangeOpenKey: (key?: string) => void;
  selectedKey: string;
  listSelectedKey?: string[];
  onChangeSelectedKey: (key: string) => void;
  className?: string;
}

const MenuComponent: FC<MenuProps> = props => {
  const { openKey, onChangeOpenKey, selectedKey, listSelectedKey = [] } = props;

  const navigate = useNavigate();

  const getTitie = (menu: MenuList[0]) => {
    return (
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <CustomIcon type={menu.icon!} />
        <span>{menu.name}</span>
      </span>
    );
  };

  const onOpenChange = (keys: string[]) => {
    const key = keys.pop();

    onChangeOpenKey(key);
  };

  return (
    <Menu
      mode="inline"
      theme="light"
      selectedKeys={[selectedKey, ...listSelectedKey]}
      openKeys={openKey ? [openKey] : []}
      onOpenChange={onOpenChange}
      onClick={e => {
        navigate(e.key);
      }}
      className={classNames(props.className)}
    >
      {props.menuList?.map(menu => {
        if (menu?.children) {
          return (
            <SubMenu key={menu.code} title={getTitie(menu)}>
              {menu?.children?.map((child: any) => {
                return <Item key={child?.path}>{child?.name}</Item>;
              })}
            </SubMenu>
          );
        } else {
          return <Item key={menu?.path}>{getTitie(menu)}</Item>;
        }
      })}
    </Menu>
  );
};

export default MenuComponent;
