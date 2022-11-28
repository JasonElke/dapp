import { FC } from 'react';

import { ArrowLeftOutlined } from '@ant-design/icons';

import twitter from '@/assets/twitter.svg';
import github from '@/assets/github.svg';
import telegram from '@/assets/telegram.svg';
import discord from '@/assets/discord.svg';

const CONFIG = import.meta.env;

const Footer: FC = () => {
  return (
    <div className="box-footer">
      <div className="social-network">
        <a href="#">
          <img src={twitter} alt="" />
        </a>
        <a href="#">
          <img src={github} alt="" />
        </a>
        <a href="#">
          <img src={telegram} alt="" />
        </a>
        <a href="#">
          <img src={discord} alt="" />
        </a>
      </div>

      <div className="footer-wrapper">
        <div className="btn-back" onClick={() => window.history.back()}>
          <ArrowLeftOutlined />
          <span>Back</span>
        </div>

        <div className="donate">
          <div>Donate to our Community Marketing Wallet</div>
          <div>{CONFIG.VITE_ADDRESS_DONATE}</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
