import { FC, useEffect, useState } from 'react';
import { Button, Layout, Modal, Table } from 'antd';

const { Header } = Layout;

import bgConnect from '@/assets/connect.png';
import logo from '@/assets/logo.svg';
import { Link } from 'react-router-dom';
import { useWeb3Context } from '@/hooks/web3';
import { formatAddress, parseBalance } from '@/utils/function';
import { getContract } from '@/utils/getContract';
import { MAX_GUARDIANS, TITLE_USER } from '@/constans';
import { useDispatch, useSelector } from 'react-redux';
import { setListTopStake } from '@/stores/global.store';
import bgFormSmall from '@/assets/bg-form-small.png';
import iconHeaderForm from '@/assets/header-form.png';
import iconFooterForm from '@/assets/footer-form.png';

interface HeaderProps {
  collapsed: string;
  toggle?: () => void;
  className?: string;
}

const HeaderComponent: FC<HeaderProps> = props => {
  const { connect, address, connected, disconnect, provider } = useWeb3Context();

  const dispatch = useDispatch();

  const { listTopStake, isReloadData } = useSelector(state => state.global);

  const [contracts, setContracts] = useState<any>(null);
  const [titleUser, setTitleUser] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleGetContract = async () => {
    const result: any = await getContract(provider);

    setContracts(result);
  };

  useEffect(() => {
    if (connected) handleGetContract();
  }, [connected]);

  const loadData = async () => {
    const arr = [];

    for (let i = 0; i < MAX_GUARDIANS; i++) {
      const result = await contracts.dRealmContract.highestStakerInPool(0, i);
      if (result) {
        const amount = parseBalance(result.deposited?.toString());
        arr.push({
          amount,
          address: result.addr,
        });
      }
    }
    const item = arr.find(e => e.address === address);
    if (item) setTitleUser(TITLE_USER.GUARDIAN);
    else setTitleUser(TITLE_USER.VOTER);
    dispatch(setListTopStake(arr.sort((a, b) => +b.amount - +a.amount)));
  };

  useEffect(() => {
    if (contracts) loadData();

    }, [contracts, isReloadData, connected]);

  const columns = [
    {
      title: 'No',
      dataIndex: 'index',
      key: 'index',
      render: (text: any, record: any, index: any) => <div>{index + 1}</div>,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  return (
    <Header {...props}>
      <div className="layout-page__header__top">
        <Link to="/" className="logo">
          <img src={logo} alt="" />
        </Link>

        {connected ? (
          <div className="box-connected">
            <div className="show-info">
              <a
                style={{ marginRight: '20px', display: 'flex', whiteSpace: 'nowrap' }}
                onClick={() => setIsOpenModal(true)}
              >
                Top Staker
              </a>

              <div className="address">
                <span>{formatAddress(address)}</span>&nbsp;
                {titleUser && <span style={{ fontStyle: 'italic' }}>({titleUser})</span>}
              </div>
            </div>

            <Button className="btn-connect" onClick={disconnect}>
              <img src={bgConnect} alt="" />
              <span>Disconnect</span>
            </Button>
          </div>
        ) : (
          <Button className="btn-connect" onClick={connect}>
            <img src={bgConnect} alt="" />
            <span>Connect</span>
          </Button>
        )}
      </div>

      <div className="layout-page__header__bottom">
        <Link to="/stake" className="btn-primary">
          Stake REALM
        </Link>

        <Link to="/" className="logo">
          <img src={logo} alt="" />
        </Link>

        <Link to="/proposals" className="btn-primary">
          Proposals
        </Link>
      </div>

      {isOpenModal && (
        <Modal
          visible={isOpenModal}
          onCancel={() => setIsOpenModal(false)}
          destroyOnClose
          centered
          footer={null}
          width={600}
          className="modal-list-stake"
        >
          <div className="box-list-stake">
            <img src={bgFormSmall} alt="" className="bg-small" />
            <div className="wrapper-list-stake">
              <img src={iconHeaderForm} alt="" className="icon-header-form" />

              <div className="body-list-stake">
                <div className="title">TOP STAKER</div>

                <Table
                  dataSource={listTopStake}
                  columns={columns}
                  pagination={false}
                  scroll={{ y: 'auto', x: 'auto' }}
                />
              </div>

              <img src={iconFooterForm} alt="" className="icon-footer-form" />
            </div>
          </div>
        </Modal>
      )}
    </Header>
  );
};

export default HeaderComponent;
