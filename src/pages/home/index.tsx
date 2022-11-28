import { FC } from 'react';

import BaseContainer from '@/components/basic/container';

import './index.less';

const DashboardPage: FC = () => {
  return (
    <BaseContainer className="home-page">
      <div className="body-home">
        <div className="item">
          <div>REALM Price</div>
          <div>$0.00003594</div>
        </div>

        <div className="item">
          <div>Market Cap</div>
          <div>$0.00003594</div>
        </div>

        <div className="item">
          <div>Total Value Locked</div>
          <div>$0.00003594</div>
        </div>

        <div className="item">
          <div>Treasury Balance</div>
          <div>$0.00003594</div>
        </div>

        <div className="item">
          <div>Total Funda Sent</div>
          <div>$0.00003594</div>
        </div>

        <div className="item">
          <div>REALM Burned</div>
          <div>$0.00003594</div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default DashboardPage;
