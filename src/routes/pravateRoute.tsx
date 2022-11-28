import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteProps } from 'react-router';

const PrivateRoute: FC<RouteProps> = props => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const accessToken = localStorage.getItem('auth');
  //
  //   if (!accessToken) {
  //     navigate('/login');
  //   }
  // }, []);

  return props.element as React.ReactElement;
};

export default PrivateRoute;
