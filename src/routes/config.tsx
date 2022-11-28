import React from 'react';
import { FC } from 'react';
import { RouteProps } from 'react-router';
import PrivateRoute from './pravateRoute';

export interface WrapperRouteProps extends RouteProps {
  auth?: boolean;
  title: string;
}

const WrapperRouteComponent: FC<WrapperRouteProps> = ({ title, ...props }) => {
  document.title = title;

  return <PrivateRoute {...props} />;
};

export default WrapperRouteComponent;
