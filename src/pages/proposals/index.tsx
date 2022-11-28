import { FC } from 'react';

import BaseContainer from '@/components/basic/container';

import './index.less';
import { Link } from 'react-router-dom';
import { useWeb3Context } from '@/hooks/web3';
import { useState } from 'react';
import { useEffect } from 'react';
import { totalVotes } from '@/common/cultDaoFunctions';

const ProposalsPage: FC = () => {
  const { address, provider } = useWeb3Context();
  const [totalVote, setTotalVote] = useState(0);

  useEffect(() => {
    totalVotes(address, provider).then(value => {
      setTotalVote(value);
    });
  }, []);

  return (
    <BaseContainer className="proposals-page">
      <div className="body-proposals">
        <Link to="/pending-proposals">
          <div className="item">
            <div>Pending</div>
            <div>Proposals</div>
          </div>
        </Link>

        <Link to="/close-proposals">
          <div className="item">
            <div>Closed</div>
            <div>Proposals</div>
          </div>
        </Link>

        <Link to="/submit-proposals">
          <div className="item">
            <div>Submit</div>
            <div>Proposals</div>
          </div>
        </Link>

        <Link to="/delegate">
          <div className="item">
            <div>Delegate Votes</div>
            <div>{totalVote}</div>
          </div>
        </Link>
      </div>
    </BaseContainer>
  );
};

export default ProposalsPage;
