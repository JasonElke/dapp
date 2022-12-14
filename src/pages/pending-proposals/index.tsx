import { FC, useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { Skeleton } from 'antd';
import BaseContainer from '@/components/basic/container';
import PendingProposalItem from './pending.proposal.item';

import { proposalDetail } from '@/common/govermanceFunction';
import { useWeb3Context } from '@/hooks/web3';

import bgPendingProposals from '@/assets/bg-pending-proposals.png';
import iconHeaderForm from '@/assets/header-form.png';
import iconFooterForm from '@/assets/footer-form.png';

import './index.less';
import { getContract } from '@/utils/getContract';

const PendingProposalsPage: FC = () => {
  const { connected, provider, address } = useWeb3Context();
  const [listProposal, setListProposal] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setIsLoading(true);
    if (connected) getListPendingProposal();
  
  }, [connected]);

  const getListPendingProposal = async () => {
    try {
      const listProposal = await proposalDetail(provider, address);

      const tempPendingData = listProposal?.length
        ? listProposal.filter(
            details =>
              details?.stateName === 'Pending' ||
              details?.stateName === 'Active' ||
              details?.stateName === 'Succeeded' ||
              details?.stateName === 'Queued',
          )
        : [];

      setListProposal(tempPendingData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <BaseContainer className="pending-proposals-page">
      <div className="body-pending-proposals">
        <img src={bgPendingProposals} alt="" className="bg-pending-proposals" />
        <div className="wrapper-pending">
          <img src={iconHeaderForm} alt="" className="icon-header-pending" />

          <div className="content-stake">
            <div className="title">Pending Proposals</div>

            {isLoading ? (
              <Skeleton.Button active shape="round" size="small" style={{ width: '320px', marginTop: '20px' }} />
            ) : listProposal?.length ? (
              <div>
                {listProposal.map((details: any, index: number) => (
                  <PendingProposalItem details={details} key={index} />
                ))}
              </div>
            ) : (
              <div className="no-proposals-found">
                <span>No Proposals found</span>
              </div>
            )}
          </div>

          <div className="footer-pending">
            <Link to="/close-proposals">Finished Proposals</Link>
            <img src={iconFooterForm} alt="" className="icon-footer-pending" />
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default PendingProposalsPage;
