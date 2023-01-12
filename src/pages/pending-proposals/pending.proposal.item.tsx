import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { Statistic } from 'antd';

import { useWeb3Context } from '@/hooks/web3';

import './index.less';
import { useDispatch } from 'react-redux';
import { currentProposal } from '@/stores/proposal.store';
import { Execute, Queue } from '@/common/govermanceFunction';
import MyButton from '@/components/basic/button';
import { toast } from 'react-toastify';

interface props {
  details: any;
  refreshData: () => void;
  loading: any;
  setLoading: any
}

const { Countdown } = Statistic;

const PendingProposalItem = (props: props) => {
  const dispatch = useDispatch();
  const { details }: any = props;
  const { provider } = useWeb3Context();
  const [endIn, setEndIn] = useState(0);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    setEndInOrStatus(details);
  }, [details]);



  const makeQueued = async (id: any) => {
    try{
      setIsLoading(true)
      let tx = await Queue(id, provider);
      await tx.wait();
      setIsLoading(false);
      toast.success('Transaction confirmed');
      props.setLoading(!props.loading);
    }catch(e){
      setIsLoading(false);
      toast.error('Transaction failed');
    }
  };

  const DoExecute = async (id: any) => {
    try{
      setIsLoading(true)
      let tx = await Execute(id, provider);
      await tx.wait();
      setIsLoading(false);
      toast.success('Transaction confirmed');
      props.setLoading(!props.loading);
    }catch(e){
      setIsLoading(false);
      toast.error('Transaction failed');
    }
  };

  const approvePercentage = (data: any) => {
    const favour = data?.forVotes / 10 ** 18;
    const against = data?.againstVotes / 10 ** 18;
    const total = favour + against;

    if (favour === 0 && against === 0) {
      return 0;
    }

    return (favour / total) * 100 === 100 || (favour / total) * 100 === 0
      ? (favour / total) * 100
      : ((favour / total) * 100).toFixed(2);
  };

  const rejectPercentage = (data: any) => {
    const favour = data?.forVotes / 10 ** 18;
    const against = data?.againstVotes / 10 ** 18;
    const total = favour + against;

    if (favour === 0 && against === 0) {
      return 0;
    }

    return (against / total) * 100 === 100 || (against / total) * 100 === 0
      ? (against / total) * 100
      : ((against / total) * 100).toFixed(2);
  };

  const setEndInOrStatus = async (data: any) => {
    const currentBlock = await provider.getBlockNumber();
    const estimatedTime = (parseInt(data?.endBlock) - currentBlock) * 15;

    setEndIn(estimatedTime);
  };

  const status = (data: any) => {
    if (data?.stateName === 'Active') {
      return (
        <>
          <span>Ends in: </span>
          <span>
            {/*{endIn && Date.now() + endIn * 1000}*/}
            {endIn ? <Countdown value={Date.now() + endIn * 1000} format="DD:HH:mm:ss" /> : ''}
          </span>
        </>
      );
    } else if (data?.stateName === 'Succeeded') {
      return (
          <>
          {/* Status:{" "} */}
          <MyButton className="btn-normal" loading={isLoading} onClick={() => makeQueued(data?.id)}>
            Queue
          </MyButton>
        </>

      );
    } else if (data?.stateName === 'Queued') {
      const time = new Date().getTime();

      if (+data?.eta?.toString() > time / 1000) {
        return (
          <>
            <div>
              <span>Status:</span>
              <span>{data?.stateName}</span>
            </div>
              <span>Ends in: </span>
            <span>
              {+data?.eta?.toString() > 0 ? <Countdown value={(+data?.eta?.toString())* 1000} format="DD:HH:mm:ss" /> : ''}
            </span>
          </>
        );
      }

      return (
        <>
          {/* Status:{" "} */}
          <MyButton className="btn-normal" loading={isLoading} onClick={() => DoExecute(data?.id)}>
            Execute
          </MyButton>
        </>
      );
    } else {
      return (
        <>
          <span>Status:</span>
          <span className="">{data?.stateName}</span>
        </>
      );
    }
  };

  const handleSelectProposalDetail = (details: any) => {
    dispatch(currentProposal(details));
  };

  return (
    <div className="proposal-pending-item" onClick={() => handleSelectProposalDetail(props.details)}>
      <Link to="/proposal-detail" className="project-name">
        <span>Proposal:</span>
        <span>({details?.description?.projectName})</span>
      </Link>

      <div className="box-top">
        <div className="box-percentage">
          <div className="">
            <span>Approve</span> <span>{approvePercentage(details)}%</span>
          </div>
          <div className="">
            <span>Reject</span> <span>{rejectPercentage(details)}%</span>
          </div>
        </div>
        <div className="box-voted">
          <div>
            <span>You Voted:</span>
            <span className="font-semibold">
              {details?.voteCount?.hasVoted ? (details?.voteCount?.support !== 0 ? 'Approve' : 'Reject') : 'Pending'}
            </span>
          </div>
          <div>{status(details)}</div>
        </div>
      </div>
      <div className="box-bottom">
        <div>
          <div className="bottom-item">
            <span>Approved:</span>
            <span>{(details?.forVotes / 10 ** 18).toLocaleString()}</span>
          </div>
          <div className="bottom-item">
            <span>Rejected:</span>
            <span>{(details?.againstVotes / 10 ** 18).toLocaleString()}</span>
          </div>
        </div>
        <div className="bottom-item">
          <span>Total Votes: </span>
          <span>{(details?.againstVotes / 10 ** 18 + details?.forVotes / 10 ** 18).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PendingProposalItem;
