import { useState } from 'react';
import { useSelector } from 'react-redux';
import { approveOrRejectProposal } from '@/common/govermanceFunction';
import { highestStaker } from '@/common/cultDaoFunctions';
import { useWeb3Context } from '@/hooks/web3';
import bgPendingProposals from '@/assets/bg-pending-proposals.png';
import iconHeaderForm from '@/assets/header-form.png';
import iconFooterForm from '@/assets/footer-form.png';
import BaseContainer from '@/components/basic/container';
import MyButton from '@/components/basic/button';
import { toast } from 'react-toastify';

import './index.less';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';

function ProposalDetail() {
  const { proposalData } = useSelector(state => state.proposal);
  const { address, provider } = useWeb3Context();
  const [transactionInProgress, setProgress] = useState(false);
  const [isApprove, setIsApprove] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(proposalData);

    if (isEmpty(proposalData)) {
      navigate('/proposals');
    }
  }, [proposalData]);

  const approveProposalOrReject = async (id: number, value: number) => {
    if (value) {
      const checkHighestStaker = await highestStaker(address, provider);

      if (!checkHighestStaker) {
        setProgress(true);
        const res = await approveOrRejectProposal(id, value, address, provider);

        if (res.code === 4001) {
          toast.warn('Transaction Rejected');
        } else {
          toast.warn('Transaction Confirmed');
          navigate('/proposals');
        }

        setProgress(false);
        setIsReject(false);
        setIsApprove(false);

        return '';
      } else {
        toast.error('Guardians cannot vote');
      }
    } else {
      setProgress(true);
      const res = await approveOrRejectProposal(id, value, address, provider);

      if (res.code === 4001) {
        toast.warn('Transaction Rejected');
      } else {
        toast.warn('Transaction Confirmed');
        navigate('/proposals');
      }

      setProgress(false);
      setIsReject(false);
      setIsApprove(false);
    }
  };

  return (
    <BaseContainer className="proposal-detail-page">
      <div className="form-proposal-detail">
        <img src={bgPendingProposals} alt="" className="bg-pending-proposals" />
        <div className="wrapper-form-proposal-detail">
          <img src={iconHeaderForm} alt="" className="icon-header-form" />

          <div className="body-form-proposal-detail">
            <div className="title">Proposal</div>

            <div>
              <div className="my-4">
                <span className="title-item">Proposal:</span>&nbsp;
                <span>({proposalData?.description?.projectName})</span>
              </div>

              <div className="my-4">
                <div className="title-item">Guardian Information</div>
                <div>
                  <div className="">
                    <div className="font-weight-500">Guardian Name -</div>
                    <div> {proposalData?.description?.guardianProposal}</div>
                  </div>
                  <div>
                    <div className="font-weight-500">Guardian Social Handle -</div>
                    <div>{proposalData?.description?.guardianDiscord}</div>
                  </div>
                  <div>
                    <div className="font-weight-500">Guardian Wallet -</div>
                    <div className="word-break-word">{proposalData?.description?.guardianAddress}</div>
                  </div>
                </div>
              </div>

              <div className="my-4">
                <div className="title-item">Project Summary</div>
                <div>{proposalData?.description?.shortDescription}</div>
              </div>

              <div className="my-4">
                <div className="title-item">Project Docs</div>
                <div>
                  <div>
                    <div className="font-weight-500">Lite/Whitepaper -</div>
                    <div>{proposalData?.description?.file}</div>
                  </div>
                  <div>
                    <div className="font-weight-500">Social Docs -</div>
                    <div>{proposalData?.description?.socialChannel}</div>
                  </div>
                  <div>
                    <div className="font-weight-500">Audits -</div>
                    <div className="word-break-word">{proposalData?.description?.links}</div>
                  </div>
                </div>
              </div>

              <div className="my-4">
                <div className="title-item">CULT Reward Allocation</div>
                <div>{proposalData?.description?.range}% of Total Supply</div>
              </div>

              <div className="my-4">
                <div className="title-item">Reward Distribution Terms</div>
                <div>
                  {proposalData?.description?.rate}% per {proposalData?.description?.time}.
                </div>
              </div>

              <div className="my-4">
                <div className="title-item">Project Ethereum Wallet</div>
                <div className="word-break-word">{proposalData?.description?.wallet}</div>
              </div>

              {!proposalData?.voteCount?.hasVoted && proposalData?.stateName === 'Active' ? (
                <div className="group-btn">
                  <MyButton
                    className="btn-normal"
                    style={{
                      pointerEvents: isApprove || isReject ? 'none' : 'initial',
                      opacity: isApprove || isReject ? '0.7' : '1',
                    }}
                    loading={isApprove}
                    onClick={() => {
                      approveProposalOrReject(proposalData?.id, 1);
                      setIsApprove(true);
                    }}
                  >
                    Approve
                  </MyButton>

                  <MyButton
                    className="btn-normal"
                    style={{
                      pointerEvents: isApprove || isReject ? 'none' : 'initial',
                      opacity: isApprove || isReject ? '0.7' : '1',
                    }}
                    loading={isReject}
                    onClick={() => {
                      approveProposalOrReject(proposalData?.id, 0);
                      setIsReject(true);
                    }}
                  >
                    Reject
                  </MyButton>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>

          <div style={{ minHeight: '24px', textAlign: 'center', marginBottom: '20px', color: '#dd4d4f' }}>
            {transactionInProgress && 'Submitting Vote'}
          </div>

          <img src={iconFooterForm} alt="" className="icon-footer-form" />
        </div>
      </div>
    </BaseContainer>
  );
}

export default ProposalDetail;
