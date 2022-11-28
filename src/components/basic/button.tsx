import { FC } from 'react';
import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';

import './button.less';

interface MyButtonProps extends ButtonProps {}

const BaseButton: FC<MyButtonProps> = props => {
  return <Button className={props.className} {...props} />;
};

const MyButton = Object.assign(Button, BaseButton);

export default MyButton;
