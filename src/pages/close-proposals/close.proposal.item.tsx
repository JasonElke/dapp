import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { Statistic } from 'antd';

import { useWeb3Context } from '@/hooks/web3';

import './index.less';
import { useDispatch } from 'react-redux';
import { currentProposal } from '@/stores/proposal.store';

interface props {
  details: any;
}

const { Countdown } = Statistic;

const CloseProposalItem = (props: props) => {
  const dispatch = useDispatch();
  const { details }: any = props;
  const { provider } = useWeb3Context();
  const [endIn, setEndIn] = useState('');

  useEffect(() => {
    setEndInOrStatus(details);
  }, [details]);

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
    const value = await provider.getBlock(+data?.endBlock?.toString());

    console.log(value);

    const date = new Date(value?.timestamp * 1000);

    setEndIn(date.toLocaleString('en-GB', { hour12: false }));
  };

  // const setEndInOrStatus = async (data: any) => {
  //   const currentBlock = await provider.getBlockNumber();
  //   const estimatedTime = (parseInt(data?.endBlock) - currentBlock) * 13.5;

  //   setEndIn(estimatedTime);
  // };

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
      // return (
      //   <>
      //     {/* Status:{" "} */}
      //     <button
      //       type="submit"
      //       className="border sm:w-24 w-24 sm:h-7 h-6 rounded-lg sm:text-lg text-base font-Nixie bg-buttonBg border-slate-600 font-semibold"
      //       onClick={() => makeQueued(data?.id)}
      //     >
      //       Queue
      //     </button>
      //   </>
      // );
    } else if (data?.stateName === 'Queued') {
      const time = new Date().getTime();

      if (data?.eta > time / 1000) {
        return (
          <>
            <span>Status:</span>
            <span>{data?.stateName}</span>
          </>
        );
      }

      // return (
      //   <>
      //     {/* Status:{" "} */}
      //     <button
      //       type="submit"
      //       className="border sm:w-24 w-24 sm:h-7 h-6 rounded-lg sm:text-lg text-base font-Nixie bg-buttonBg border-slate-600 font-semibold"
      //       onClick={() => DoExecute(data?.id)}
      //     >
      //       Execute
      //     </button>
      //   </>
      // );
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
            <span>Result:</span>
            <span className="font-semibold">{details?.stateName}</span>
          </div>
          <div>
            {details?.stateName === 'Canceled' ? (
              <br></br>
            ) : (
              <p>
                Ended: <span className="font-semibold">{endIn}</span>
              </p>
            )}
          </div>
          {/* <div>{status(details)}</div> */}
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

export default CloseProposalItem;
