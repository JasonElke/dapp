import React, { useEffect } from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import { useLocale } from '@/locales';
import { useSelector } from 'react-redux';
import { message } from 'antd';

export const history = createBrowserHistory();

interface HistoryRouterProps {
  history: typeof history;
}

export const HistoryRouter: React.FC<HistoryRouterProps> = ({ history, children }) => {
  const { formatMessage } = useLocale();
  const { errorCode }: { errorCode: any } = useSelector(state => state.global);

  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => {
    history.listen(setState);
  }, [history]);

  useEffect(() => {
    if (errorCode) {
      message.error(formatMessage({ id: errorCode }));
    }
  }, [errorCode]);

  return React.createElement(Router, Object.assign({ children, navigator: history }, state));
};
