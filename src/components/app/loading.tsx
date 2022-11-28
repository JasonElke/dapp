import React from 'react';
import './index.less';

interface Props {
  isLoading: boolean;
}

const LoadingApp = (props: Props) => {
  return (
    <React.Fragment>
      {props.isLoading
        ? props.isLoading && (
            <div className="box-loading">
              <div style={{ color: '#00D9FF' }} className="la-ball-clip-rotate-multiple la-3x">
                <div></div>
                <div></div>
              </div>
            </div>
          )
        : ''}
    </React.Fragment>
  );
};

export default LoadingApp;
