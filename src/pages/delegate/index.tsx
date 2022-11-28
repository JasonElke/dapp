import { FC } from 'react';

import { toast } from 'react-toastify';
import BaseContainer from '@/components/basic/container';
import bgPendingProposals from '@/assets/bg-pending-proposals.png';
import iconHeaderForm from '@/assets/header-form.png';
import { Form, Input } from 'antd';
import MyButton from '@/components/basic/button';
import iconFooterForm from '@/assets/footer-form.png';

import { dCultBalance, delegate, highestStaker } from '@/common/cultDaoFunctions';
import { useWeb3Context } from '@/hooks/web3';

import './index.less';

const DelegatePage: FC = () => {
  const { address, provider } = useWeb3Context();
  const [form] = Form.useForm();

  const handleDelegate = async ({ toAddress }: { toAddress: string }) => {
    const dCbalance = await dCultBalance(address, provider);

    if (dCbalance) {
      const checkHighestStaker = await highestStaker(address, provider);

      if (!checkHighestStaker) {
        const res = await delegate(toAddress, provider);

        if (res?.code === 4001) {
          toast.warn('Transaction Rejected');
        } else if (res?.code === 4002) {
          toast.warn('Invalid Address');
        } else {
          toast.warn('Transaction Confirmed');
        }

        return '';
      } else {
        toast.warn('Guardians cannot Delegate');
      }
    } else {
      toast.warn("You don't have dREALM token to delegate");
    }
  };

  return (
    <BaseContainer className="delegate-page">
      <div className="form-delegate">
        <img src={bgPendingProposals} alt="" className="bg-pending-proposals" />
        <div className="wrapper-form-delegate">
          <img src={iconHeaderForm} alt="" className="icon-header-form" />

          <div className="body-form-delegate">
            <div className="title">Delegate Vote</div>

            <div style={{ margin: '20px 0', textAlign: 'start' }}>
              Before you can vote, you must assign your voting rights to either yourself, or you can assign it to a
              third party.
            </div>

            <Form form={form} name="basic" onFinish={handleDelegate} layout="vertical">
              <Form.Item
                label="Enter the Ethereum address of wallet to receive the voting rights."
                name="toAddress"
                rules={[{ required: true, message: 'This field is required!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item className="item-btn">
                <MyButton className="btn-normal" onClick={form.submit}>
                  Delegate
                </MyButton>
              </Form.Item>
            </Form>

            <div>
              By delegating your voting rights, you allow the recipient user to vote any decision on a proposal without
              your consent, however you can take back your rights by entering your address above and delegating back to
              yourself. The recipient does not take any ownership of your dCULT tokens.
            </div>
          </div>

          <img src={iconFooterForm} alt="" className="icon-footer-form" />
        </div>
      </div>
    </BaseContainer>
  );
};

export default DelegatePage;
