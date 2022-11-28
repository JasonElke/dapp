import { lazy, FC } from 'react';
import WrapperRouteComponent from './config';
import { useRoutes } from 'react-router-dom';
import { RouteObject } from 'react-router';

import LayoutPage from '@/pages/layout';
import HomePage from '@/pages/home';
import StakePage from '@/pages/stake';
import ProposalsPage from '@/pages/proposals';
import PendingProposalsPage from '@/pages/pending-proposals';
import CloseProposalsPage from '@/pages/close-proposals';
import SubmitProposalsPage from '@/pages/submit-proposals';
import DelegatePage from '@/pages/delegate';
import ProposalDetailPage from '@/pages/proposal-detail';

const NotFound = lazy(() => import(/* webpackChunkName: "404'"*/ '@/pages/404'));

const routeList: RouteObject[] = [
  {
    caseSensitive: false,
    path: '/',
    element: <WrapperRouteComponent element={<LayoutPage />} title="" />,
    children: [
      {
        caseSensitive: false,
        path: '',
        element: <WrapperRouteComponent element={<HomePage />} title="RealmDao" />,
      },
      {
        caseSensitive: false,
        path: '/stake',
        element: <WrapperRouteComponent element={<StakePage />} title="Stake" />,
      },
      {
        caseSensitive: false,
        path: '/proposals',
        element: <WrapperRouteComponent element={<ProposalsPage />} title="Proposals" />,
      },
      {
        caseSensitive: false,
        path: '/pending-proposals',
        element: <WrapperRouteComponent element={<PendingProposalsPage />} title="Proposals" />,
      },
      {
        caseSensitive: false,
        path: '/close-proposals',
        element: <WrapperRouteComponent element={<CloseProposalsPage />} title="Proposals" />,
      },
      {
        caseSensitive: false,
        path: '/submit-proposals',
        element: <WrapperRouteComponent element={<SubmitProposalsPage />} title="Proposals" />,
      },
      {
        caseSensitive: false,
        path: '/delegate',
        element: <WrapperRouteComponent element={<DelegatePage />} title="Proposals" />,
      },
      {
        caseSensitive: false,
        path: '/proposal-detail',
        element: <WrapperRouteComponent element={<ProposalDetailPage />} title="Proposal detail" />,
      },
      {
        caseSensitive: false,
        path: '*',
        element: <WrapperRouteComponent element={<NotFound />} title="Page not found" />,
      },
    ],
  },
];

const RenderRouter: FC = () => {
  const element = useRoutes(routeList);

  return element;
};

export default RenderRouter;
