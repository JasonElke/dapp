import { Col, Row } from 'antd';
import ForbiddenImage from '@/assets/403.png';
import { css } from '@emotion/react';

const ForbiddenPage = () => {
  return (
    <div css={styles} className="forbidden-page">
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <h1 className="header-message">Bạn không có quyền truy cập trang này</h1>
        </Col>
      </Row>
      <Row style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <img src={ForbiddenImage} loading="lazy" className="image-forbidden" />
      </Row>
    </div>
  );
};

export default ForbiddenPage;

const styles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  margin: 20px;
  border-radius: 10px;
  padding: 20px;
  height: 100%;
  justify-content: center;

  .header-message {
    color: var(--primary-color) !important;
    font-weight: 600;
    font-size: x-large;
  }

  .image-forbidden {
    width: 450px;
  }
`;
