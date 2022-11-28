import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Not found"
      // extra={
      //   <Button type="primary" onClick={() => navigate(-1)}>
      //     BackHome
      //   </Button>
      // }
    />
  );
};

export default NotFoundPage;
