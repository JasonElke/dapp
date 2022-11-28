import { FC, useEffect, useState } from 'react';

import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Skeleton } from 'antd';
import MyButton from '@/components/basic/button';
import BaseContainer from '@/components/basic/container';

import bgFormSmall from '@/assets/bg-form-small.png';
import iconHeaderForm from '@/assets/header-form.png';
import iconFooterForm from '@/assets/footer-form.png';

import { useWeb3Context } from '@/hooks/web3';
import { getContract } from '@/utils/getContract';
import { REGEX_COMMON } from '@/utils/regex';
import { DECIMAL_PART, LENGTH_AMOUNT } from '@/utils/constants';
import { parseBalance } from '@/utils/function';

import './index.less';
import { useDispatch } from 'react-redux';
import { setIsReloadData } from '@/stores/global.store';
import { claimCult, pendingCult, realmAllowance, stake } from '@/common/cultDaoFunctions';

const CONFIG = import.meta.env;

const StakePage: FC = () => {
  const { address, provider, connected } = useWeb3Context();

  const [form] = Form.useForm();

  const { setFieldsValue, resetFields } = form;

  const dispatch = useDispatch();

  const [isLoadingApprove, setIsLoadingApprove] = useState(false);
  const [isLoadingWithdraw, setIsLoadingWithdraw] = useState(false);
  const [isLoadingClaim, setIsLoadingClaim] = useState(false);
  const [contracts, setContracts] = useState<any>(null);
  const [amountApprove, setAmountApprove] = useState('');
  const [amountWithdraw, setAmountWithdraw] = useState('');
  const [REALMPrice, setREALMPrice] = useState('');
  const [totalREALM, setTotalREALM] = useState('');
  const [balanceApprove, setBalanceApprove] = useState('');
  const [balanceWithdraw, setBalanceWithdraw] = useState('');
  const [isOpenRewards, setIsOpenRewards] = useState(false);
  const [realmClaimable, setRealmClaimable] = useState(0);
  const [realmAllow, setRealmAllow] = useState(0);

  useEffect(() => {
    pendingCult(address, provider).then(value => {
      setRealmClaimable(+value);
    });
  }, []);

  const checkRealmAllow = () => {
    realmAllowance(address, provider).then(value => setRealmAllow(value));
  };

  const handleGetContract = async () => {
    const result: any = await getContract(provider);

    setContracts(result);
  };

  const getREALMPrice = async () => {
    // const price = await contracts.dRealmContract.CULT();

    // setREALMPrice(price.toString());
    setREALMPrice('0.00003594');
  };

  const getAPR = () => {
    console.log(1111111111);
  };

  const getTotalREALM = async () => {
    let totalREALMStaked = await contracts.dRealmContract.totalCULTStaked();

    totalREALMStaked = parseBalance(totalREALMStaked);

    setTotalREALM(totalREALMStaked);
  };

  const getBalanceApprove = async () => {
    let balance = await contracts.realmContract.balanceOf(address);

    balance = parseBalance(balance);

    setBalanceApprove(balance);
  };

  const getBalanceWithdraw = async () => {
    let balance = await contracts.dRealmContract.balanceOf(address);

    balance = parseBalance(balance);

    setBalanceWithdraw(balance);
  };

  useEffect(() => {
    if (connected) handleGetContract();
  }, [connected]);

  const loadData = () => {
    getREALMPrice();
    getAPR();
    getTotalREALM();
    getBalanceApprove();
    getBalanceWithdraw();
    pendingCult(address, provider).then(value => setRealmClaimable(+value));
    checkRealmAllow();
  };

  useEffect(() => {
    if (contracts) loadData();
  }, [contracts]);

  const handleChangeAmount = ({ value, maxValue, setValue }: any) => {
    if (value?.length > LENGTH_AMOUNT) return;

    if (REGEX_COMMON.decimal.test(value)) {
      if (+value > +maxValue) {
        setValue(`${maxValue}`);

        return;
      }

      const decimalPart = value.split('.')?.[1];

      if (decimalPart?.length > DECIMAL_PART) return;
      setValue(value);
    }

    if (value === '') setValue('');
  };

  const handleApprove = async () => {
    if (!amountApprove || isLoadingApprove) return;

    setIsLoadingApprove(true);

    try {
      const transaction = await contracts.realmContract.approve(
        CONFIG.VITE_dREALM_TOKEN,
        ethers.utils.parseEther(
          Number(1 * 1e50)
            .toLocaleString()
            .split(',')
            .join(''),
        ),
        {
          from: address,
        },
      );

      await transaction.wait();
      toast.success('Approve success!');
      loadData();
      dispatch(setIsReloadData());
      setIsLoadingApprove(false);
    } catch (e) {
      setIsLoadingApprove(false);
      if (e?.error?.message) toast.error(e.error.message);
      else if (e?.message) toast.error(e.message);
      else if (e?.data?.message) toast.error(e.data.message);
      else if (e?.code) toast.error(e.code.replaceAll('_', ' '));
      console.log(e);
    }
  };

  const handleStake = async () => {
    if (!amountApprove || isLoadingApprove) return;

    setIsLoadingApprove(true);

    try {
      const amount = Number(+amountApprove * 1e18)
        .toLocaleString()
        .split(',')
        .join('');

      console.log(amount);

      const transaction = await stake(amount, provider);

      await transaction.wait();

      toast.success('Stake success!');
      loadData();
      setIsLoadingApprove(false);
      setAmountApprove('');
      dispatch(setIsReloadData());

      setIsLoadingApprove(false);
    } catch (e) {
      setIsLoadingApprove(false);
      if (e?.error?.message) toast.error(e.error.message);
      else if (e?.message) toast.error(e.message);
      else if (e?.data?.message) toast.error(e.data.message);
      else if (e?.code) toast.error(e.code.replaceAll('_', ' '));
      console.log(e);
    }
  };

  const handleWithdraw = async () => {
    if (!amountWithdraw || isLoadingWithdraw) return;

    setIsLoadingWithdraw(true);

    try {
      const transaction = await contracts.dRealmContract.withdraw(
        0,
        ethers.utils.parseEther(amountWithdraw.toString()),
        {
          from: address,
        },
      );

      await transaction.wait();

      loadData();
      setIsLoadingWithdraw(false);
      setAmountWithdraw('');
      resetFields(['dREALMBalance']);
      toast.success('Withdraw success!');
      dispatch(setIsReloadData());
    } catch (e) {
      setIsLoadingWithdraw(false);
      if (e?.error?.message) toast.error(e.error.message);
      else if (e?.message) toast.error(e.message);
      else if (e?.data?.message) toast.error(e.data.message);
      else if (e?.code) toast.error(e.code.replaceAll('_', ' '));
      console.log(e);
    }
  };

  const handleFinish = async () => {
    if (isLoadingClaim) return;

    try {
      setIsLoadingClaim(true);

      const transaction = await claimCult(address, provider);

      await transaction.wait();

      loadData();
      setIsLoadingClaim(false);
      toast.success('Claim REALM success!');
    } catch (e) {
      setIsLoadingClaim(false);
      if (e?.error?.message) toast.error(e.error.message);
      else if (e?.message) toast.error(e.message);
      else if (e?.data?.message) toast.error(e.data.message);
      else if (e?.code) toast.error(e.code.replaceAll('_', ' '));
      console.log(e);
    }
  };

  return (
    <BaseContainer className="stake-page">
      <div className="body-stake">
        <div className="body-stake__left">
          <div className="item">
            <div>REALM Price</div>
            <div>
              {REALMPrice || REALMPrice?.toString() === '0' ? (
                `$${REALMPrice}`
              ) : (
                <Skeleton.Button active shape="round" size="small" style={{ width: '200px', marginTop: '20px' }} />
              )}
            </div>
          </div>

          <div className="item">
            <div>Guardianship Token Threshold</div>
            <div>Coming soon</div>
          </div>
        </div>

        <div className="form-stake">
          <img src={bgFormSmall} alt="" className="bg-form-small" />
          <div className="wrapper-form-stake">
            <img src={iconHeaderForm} alt="" className="icon-header-form" />

            <div className="body-form-stake">
              <div className="title">Stake REALM</div>

              <Form name="basic" form={form} onFinish={handleFinish} layout="vertical">
                <Form.Item
                  label={
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>Balance</div>
                      <div>{balanceApprove}</div>
                    </div>
                  }
                  name="balance"
                  rules={[{ required: true, message: 'Please input your Balance!' }]}
                >
                  <div>
                    <Input
                      value={amountApprove}
                      onChange={e =>
                        handleChangeAmount({
                          value: e.target.value,
                          maxValue: balanceApprove,
                          setValue: setAmountApprove,
                        })
                      }
                    />
                  </div>
                </Form.Item>

                <Form.Item className="item-btn">
                  {!realmAllow ? (
                    <MyButton className="btn-normal" loading={isLoadingApprove} onClick={handleApprove}>
                      Approve
                    </MyButton>
                  ) : (
                    <MyButton className="btn-normal" loading={isLoadingApprove} onClick={handleStake}>
                      Stake
                    </MyButton>
                  )}
                </Form.Item>

                <Form.Item
                  label={
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>dREALM Balance</div>
                      <div>{balanceWithdraw}</div>
                    </div>
                  }
                  name="dREALMBalance"
                  rules={[{ required: true, message: 'Please input your dREALM Balance!' }]}
                >
                  <div>
                    <Input
                      suffix={
                        <div
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setAmountWithdraw(balanceWithdraw);
                            setFieldsValue({ dREALMBalance: balanceWithdraw });
                          }}
                        >
                          MAX
                        </div>
                      }
                      value={amountWithdraw}
                      onChange={e =>
                        handleChangeAmount({
                          value: e.target.value,
                          maxValue: balanceWithdraw,
                          setValue: setAmountWithdraw,
                        })
                      }
                    />
                  </div>
                </Form.Item>

                <Form.Item className="item-btn">
                  <MyButton className="btn-normal" loading={isLoadingWithdraw} onClick={handleWithdraw}>
                    Withdraw
                  </MyButton>
                </Form.Item>

                <Form.Item name="">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>Claimable REALM</div>
                    <div>{realmClaimable}</div>
                  </div>
                </Form.Item>

                <Form.Item className="item-btn">
                  <MyButton className="btn-normal" loading={isLoadingClaim} onClick={handleFinish}>
                    Claim REALM
                  </MyButton>
                </Form.Item>
              </Form>
            </div>

            <img src={iconFooterForm} alt="" className="icon-footer-form" />
          </div>
        </div>

        <div className="body-stake__right">
          <div className="item">
            <div>
              <span>APR</span>&nbsp;
              <InfoCircleOutlined onClick={() => setIsOpenRewards(true)} />
            </div>
            <div>51.45 %</div>
          </div>

          <div className="item">
            <div>Total REALM Staked</div>
            <div>
              {totalREALM || totalREALM?.toString() === '0' ? (
                `${totalREALM}`
              ) : (
                <Skeleton.Button active shape="round" size="small" style={{ width: '200px', marginTop: '20px' }} />
              )}
            </div>
          </div>
        </div>
      </div>

      {isOpenRewards && (
        <Modal
          visible={isOpenRewards}
          onCancel={() => setIsOpenRewards(false)}
          destroyOnClose
          centered
          footer={null}
          width={400}
          className="modal-rewards"
        >
          <div className="box-note">
            <img src={bgFormSmall} alt="" className="bg-small" />
            <div className="wrapper-note">
              <img src={iconHeaderForm} alt="" className="icon-header-form" />

              <div className="body-note">
                <div className="title">Rewards</div>

                <div>
                  Please note rewards are claimable whenever CULT is sent to the dCULT contract address. This means
                  rewards will be available sporadically, and not sent daily.
                </div>
              </div>

              <img src={iconFooterForm} alt="" className="icon-footer-form" />
            </div>
          </div>
        </Modal>
      )}
    </BaseContainer>
  );
};

export default StakePage;
