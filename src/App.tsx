import 'moment/locale/zh-cn';
import { Suspense } from 'react';
import RenderRouter from './routes';
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import { localeConfig } from './locales';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import LoadingApp from '@/components/app/loading';
import { history, HistoryRouter } from '@/routes/history';
import { Web3ContextProvider } from './hooks/web3';

const App: React.FC = () => {
  const { loading } = useSelector(state => state.global);

  return (
    <Web3ContextProvider>
      <ConfigProvider locale={enUS} componentSize="middle">
        <IntlProvider locale={'en'} messages={localeConfig['EN']}>
          <HistoryRouter history={history}>
            <Suspense fallback={<h1>Loading...</h1>}>
              <LoadingApp isLoading={loading} />
              <RenderRouter />
            </Suspense>
          </HistoryRouter>
        </IntlProvider>
      </ConfigProvider>
    </Web3ContextProvider>
  );
};

export default App;
