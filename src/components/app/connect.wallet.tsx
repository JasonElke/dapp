import { Button, Col, Row } from 'antd';
import { css } from '@emotion/react';
import { useWeb3Context } from '@/hooks/web3';
import MyButton from '../basic/button';

const ConnectWallet = () => {
  const { connect, address, wrongNetwork, disconnect } = useWeb3Context();

  return (
    <div css={styles}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <h1 className="connect-wallet-message">Oops, your wallet is not connected.</h1>
        </Col>
      </Row>
      <Row style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        {!address && (
          <MyButton
            className="btn-warning"
            onClick={() => connect()}
            style={{ backgroundSize: '100% 40px', width: '160px' }}
          >
            Connect wallet
          </MyButton>
        )}

        {address && wrongNetwork && <Button onClick={disconnect}>Wrong network - disconnect</Button>}
      </Row>
    </div>
  );
};

export default ConnectWallet;

const styles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .connect-wallet-message {
    color: white;
  }
`;
