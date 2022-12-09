import { FC, useEffect, useState } from 'react';

import { Form, Input, Slider, Select, Checkbox } from 'antd';
import MyButton from '@/components/basic/button';
import BaseContainer from '@/components/basic/container';

import bgSubmitProposals from '@/assets/bg-pending-proposals.png';
import iconHeaderForm from '@/assets/header-form.png';
import iconFooterForm from '@/assets/footer-form.png';

import { getContract } from '@/utils/getContract';
import { useWeb3Context } from '@/hooks/web3';
import { encodeParameters } from '@/utils/function';

import './index.less';
import { toast } from 'react-toastify';

const CONFIG = import.meta.env;

const { Option } = Select;

const SubmitProposalsPage: FC = () => {
  const [form] = Form.useForm();

  const { resetFields } = form;

  const { provider, connected } = useWeb3Context();

  const [isLoading, setIsLoading] = useState(false);
  const [contracts, setContracts] = useState<any>(null);

  const [rate, setRate] = useState('50');
  const [time, setTime] = useState('day');
  const [confirms, setConfirms] = useState<any>([]);
  const [isSubmit, setIsSubmit] = useState(false);

  const options = [
    {
      label: 'Confirm 50% of the REALM once swapped will be sent to our dREALM contract and 50% sent to a burn wallet.',
      value: 'checkbox1',
    },
    {
      label: 'Confirm that the anticipated IDO date is within 12 weeks of the end date of the proposal.',
      value: 'checkbox2',
    },
  ];

  const handleGetContract = async () => {
    const result: any = await getContract(provider);

    setContracts(result);
  };

  useEffect(() => {
    if (connected) handleGetContract();
  }, [connected]);

  const handleFinish = async (values: any) => {
    if (isLoading && confirms?.length !== 2) return;

    setIsLoading(true);

    try {
      const signatures = ['_setInvesteeDetails(address)'];

      const callDatas = [encodeParameters(['address'], [values.wallet])];

      let description = {
        ...values,
        rate,
        time,
        checkbox1: true,
        checkbox2: true,
      };

      description = JSON.stringify(description);

      const transaction = await contracts.governanceContract.propose(
        [CONFIG.VITE_GOVERNANCE],
        [0],
        signatures,
        callDatas,
        description,
      );

      await transaction.wait();
      setIsLoading(false);
      resetFields();
      toast.success('Submit proposal success!');
    } catch (e) {
      setIsLoading(false);
      if (e?.error?.message) toast.error(e.error.message);
      else if (e?.message) toast.error(e.message);
      else if (e?.data?.message) toast.error(e.data.message);
      else if (e?.code) toast.error(e.code.replaceAll('_', ' '));
      console.log(e);
    }
  };

  return (
    <BaseContainer className="submit-proposals-page">
      <div className="form-submit">
        <img src={bgSubmitProposals} alt="" className="bg-submit-proposals" />
        <div className="wrapper-form-submit">
          <img src={iconHeaderForm} alt="" className="icon-header-form" />

          <div className="body-form-stake">
            <div className="title">Submit a Proposal</div>

            <Form name="basic" form={form} initialValues={{ range: 3, time }} onFinish={handleFinish} layout="vertical">
              <Form.Item
                label="Name of the Guardian submitting the Proposal."
                name="guardianProposal"
                rules={[{ required: true, message: 'This field is required!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Guardian Discord or Twitter Handle."
                name="guardianDiscord"
                rules={[{ required: true, message: 'This field is required!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Guardian Wallet Address."
                name="guardianAddress"
                rules={[{ required: true, message: 'This field is required!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="What is the name of the Project?"
                name="projectName"
                rules={[{ required: true, message: 'This field is required!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Provide a short description of the Project, and why it is suitable for investment from the REALM."
                name="shortDescription"
                rules={[{ required: true, message: 'This field is required!' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item
                label="Please provide either an investment deck, a Litepaper or a whitepaper. This must include your tokenomics, will all current token owners, your projected future fund raise and all details."
                name="file"
                rules={[{ required: true, message: 'This field is required!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Provide all social channels associated with the project."
                name="socialChannel"
                rules={[{ required: true, message: 'This field is required!' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item
                label="Provide links to the audited token and contracts."
                name="links"
                rules={[{ required: true, message: 'This field is required!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Provide the percentage of the token supply being offered in return for 13 Ethereum worth of investment."
                name="range"
              >
                <Slider
                  min={0.25}
                  max={5}
                  marks={{
                    0.25: 0.25,
                    5: 5,
                  }}
                  step={0.25}
                />
              </Form.Item>

              <Form.Item
                label="Provide the rate at which the investee token will be swapped for REALM. For example X% per day, week or month, for x number of months."
                name="rate"
                rules={[{ required: true, message: 'This field is required!' }]}
              >
                <div className="number-of-per">
                  <Input suffix="%" onChange={e => setRate(e.target.value)} />
                  <div className="choose-per">
                    <span className="title-per">Per</span>
                    <Select defaultValue={time} style={{ width: 120 }} onChange={value => setTime(value)}>
                      <Option value="day">Day</Option>
                      <Option value="week">Week</Option>
                      <Option value="month">Month</Option>
                    </Select>
                  </div>
                </div>
              </Form.Item>

              <Checkbox.Group onChange={values => setConfirms(values)}>
                {options.map((e, index) => (
                  <>
                    <Checkbox key={index} value={e.value}>
                      {e.label}
                    </Checkbox>
                    <div style={{ minHeight: '24px', textAlign: 'start', color: '#ff4d4f' }}>
                      {isSubmit && !confirms.includes(e.value) && 'This field is required!'}
                    </div>
                  </>
                ))}
              </Checkbox.Group>

              <Form.Item
                label="Provide the main ethereum wallet for the project."
                name="wallet"
                rules={[{ required: true, message: 'This field is required!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item className="item-btn">
                <MyButton
                  className="btn-normal"
                  htmlType="submit"
                  loading={isLoading}
                  onClick={() => setIsSubmit(true)}
                >
                  Submit
                </MyButton>
              </Form.Item>
            </Form>
          </div>

          <img src={iconFooterForm} alt="" className="icon-footer-form" />
        </div>
      </div>
    </BaseContainer>
  );
};

export default SubmitProposalsPage;
