import Head from 'next/head'
import { Menu, Dropdown, Button, Layout, BackTop, Row, Col, Space } from 'antd';
import React, { useCallback, useState } from 'react';
import { ConnectButton, useWalletModal, shortenAddress, CurrentUserBadge } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { OWNER_WALLET } from '../../constants';
import { Link } from 'react-router-dom';
import Linkage from 'next/link';
import {
    UnorderedListOutlined,
    FileImageOutlined,
    WalletOutlined,
    CloseOutlined
} from '@ant-design/icons';
const { Header, Footer, Sider, Content } = Layout;

export const LandingView = () => {

  const { wallet, publicKey, connect, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [menuView, setMenuView] = useState(false);
  const open = useCallback(() => setVisible(true), [setVisible]);

  const handleChangeWallet = useCallback(
    () => (wallet ? disconnect().catch(() => {}) : open()),
    [wallet, connect, disconnect, open],
  );

  const handleMenuToggle = () => {
        const view = !menuView;
        setMenuView(view);

        if (view) {

        } else {

        }
  }

  const sp_menu = (
    <Menu style={{backgroundColor:'#08011c', width: 'fit-content', padding: 5, marginTop: 60}}>
        <Menu.Item>
            <Row>
                <Link to="/mine">
                    <div style={{border: 'solid 1px grey', borderRadius: 8, width: '100%', padding: 10}}>
                        <h6 className="text-center">MY COTD</h6>
                        <p className="text-center">COTDs can be seen from phantom wallet</p>
                    </div>
                </Link>
            </Row>
        </Menu.Item>
        <Row style={{width: '100%', height: 20}} />
        <Menu.Item>
            <Linkage href="/#about">
                <h6 className="text-center">ABOUT</h6>
            </Linkage>
        </Menu.Item>
        <Menu.Item>
            <Linkage href="/#about">
                <h6 className="text-center">BENEFITS  ROADMAP</h6>
            </Linkage>
        </Menu.Item>
        <Menu.Item>
            <Linkage href="/#about">
                <h6 className="text-center">GALLERY</h6>
            </Linkage>
        </Menu.Item>
        <Menu.Item>
            <Linkage href="/#about">
                <h6 className="text-center">MARKETPLACE</h6>
            </Linkage>
        </Menu.Item>
        <Menu.Item>
            <Linkage href="/#about">
                <h6 className="text-center">FAQ'S</h6>
            </Linkage>
        </Menu.Item>
        <Row>
            <div style={{width: 'fit-content', margin: '20px auto 10px auto'}}>
                <Space>
                    <Link to="https://instagram.com/cotd" target="_blank">
                        <Button type="ghost" style={{width: 30, height: 30, padding: 2}}>
                            <img src={'/images/head_instagram.png'} width={15} height={15} />
                        </Button>
                    </Link>
                    <Link to="https://twitter.com/cotd" target="_blank">
                        <Button type="ghost" style={{width: 30, height: 30, padding: 2}}>
                            <img src={'/images/head_twitter.png'} width={15} height={15} />
                        </Button>
                    </Link>
                    <Link to="https://discord.com/cotd" target="_blank">
                        <Button type="ghost" style={{width: 30, height: 30, padding: 2}}>
                            <img src={'/images/head_discord.png'} width={15} height={15} />
                        </Button>
                    </Link>
                </Space>
            </div>
        </Row>
        <Menu.Item>
            <Linkage href="/#terms">
                <p className="text-center">TERMS AND CONDITIONS</p>
            </Linkage>
        </Menu.Item>
    </Menu>
  );

  return (
    <Layout>   
        <Row style={{padding: '10px 10%'}}>
            <Col xl={8} xs={12}>
                <Row style={{marginTop: 15}}>
                    <Link to="/">
                        <Col span={12}><img src={'/images/logo.png'} /></Col>
                    </Link>
                    <Col span={12}></Col>
                </Row>
                
            </Col>
            <Col xl={8} xs={0}>
                <Row>
                    <Col span={6}></Col>
                    <Col span={12}><img src={'/images/brand.png'} /></Col>
                    <Col span={6}></Col>
                </Row>
            </Col>
            <Col xl={8} xs={12}>
                <Row>
                    <Col style={{margin: '10px 0 0 auto'}}>
                        <Space>
                            <Button type={connected ? "ghost" : "text"} shape="round" size="middle" onClick={handleChangeWallet}>{connected ? shortenAddress(publicKey?.toBase58() || '', 4) : 'Connect'}</Button>
                            <Dropdown overlay={sp_menu} trigger={['click']} onVisibleChange={handleMenuToggle}>
                                <Button type="text" shape="circle" size="middle" onClick={handleMenuToggle} icon={menuView ? <CloseOutlined /> : <UnorderedListOutlined />} />
                            </Dropdown>
                        </Space>
                    </Col>
                </Row>

            </Col>
        </Row>

        <Row>
            <Col span={24} style={{marginTop: 60}}>
                <h5 className="text-center">Auction start every Tuesday and Friday at 6pm UTC.</h5>
                <h6 className="text-center" style={{marginTop: "10px"}}>Launching 10 COTD per week via @holaplex</h6>
                <div style={{width: "fit-content", margin: "30px auto"}}>
                    <Button type="default" style={{borderRadius: 8, width: 280, height: 60}}><span style={{fontSize: 20}}>LIVE AUCTION</span></Button>
                </div>
                <div style={{width: "fit-content", margin: "30px auto"}}>
                    <Button type="default" style={{borderRadius: 8, width: 260, height: 50}}>
                        <Space><img src={'/images/head_discord.png'} width={20} height={15} /><span>JOIN OUR DISCORD</span></Space>
                    </Button>
                </div>
            </Col>
        </Row>
    </Layout>
  );
};
