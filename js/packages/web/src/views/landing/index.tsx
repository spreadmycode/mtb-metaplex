import Head from 'next/head'
import { Menu, Dropdown, Button, Layout, BackTop, Row, Col, Space, Carousel } from 'antd';
import React, { useCallback, useState } from 'react';
import { ConnectButton, useWalletModal, shortenAddress, CurrentUserBadge } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { OWNER_WALLET } from '../../constants';
import { Link } from 'react-router-dom';
import Linkage from 'next/link';
import useWindowDimensions from '../../utils/layout';
import {
    MenuOutlined,
    FileImageOutlined,
    WalletOutlined,
    CloseOutlined
} from '@ant-design/icons';

export const LandingView = () => {

  const { wallet, publicKey, connect, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [menuView, setMenuView] = useState(false);
  const open = useCallback(() => setVisible(true), [setVisible]);
  const { width } = useWindowDimensions();
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  const handleChangeWallet = useCallback(
    () => (wallet ? disconnect().catch(() => {}) : open()),
    [wallet, connect, disconnect, open],
  );

  const handleMenuToggle = () => {
        const view = !menuView;
        setMenuView(view);
  }

  const onCarouselChanged = (prev: number, next: number) => {
    setCarouselIndex(next);
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
            <Linkage href="/#roadmap">
                <h6 className="text-center">BENEFITS  ROADMAP</h6>
            </Linkage>
        </Menu.Item>
        <Menu.Item>
            <Linkage href="/#gallery">
                <h6 className="text-center">GALLERY</h6>
            </Linkage>
        </Menu.Item>
        <Menu.Item>
            <Linkage href="/#marketplace">
                <h6 className="text-center">MARKETPLACE</h6>
            </Linkage>
        </Menu.Item>
        <Menu.Item>
            <Linkage href="/#faq">
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
            <Col span={8}>
                <Row style={{marginTop: 10}}>
                    <Link to="/">
                        <Col xl={16} xs={24}><img src={'/images/logo.png'} /></Col>
                    </Link>
                    <Col xl={8} xs={0}></Col>
                </Row>
            </Col>
            <Col span={8}>
                <Row>
                    <Col xl={7} xs={5}></Col>
                    <Col xl={10} xs={14}><img src={'/images/brand.png'} /></Col>
                    <Col xl={7} xs={5}></Col>
                </Row>
            </Col>
            <Col span={8}>
                <Row>
                    <Col style={{margin: '10px 0 0 auto'}}>
                        <Space>
                            <Button type={connected ? "ghost" : "text"} shape="round" size="middle" onClick={handleChangeWallet}>{connected ? shortenAddress(publicKey?.toBase58() || '', 4) : 'Connect'}</Button>
                            <Dropdown overlay={sp_menu} trigger={['click']} onVisibleChange={handleMenuToggle}>
                                <Button type="text" shape="circle" size="middle" onClick={handleMenuToggle} icon={menuView ? <CloseOutlined /> : <MenuOutlined />} />
                            </Dropdown>
                        </Space>
                    </Col>
                </Row>

            </Col>
        </Row>

        <Row>
            <Col span={24} style={{marginTop: 60}}>
                <h4 className="text-center" style={width > 768 ? {fontSize: 20} : {padding: '5px 20px', fontSize: 14}}>Auction start every Tuesday and Friday at 6pm UTC.</h4>
                <h5 className="text-center" style={width > 768 ? {fontSize: 18, marginTop: "10px"} : {fontSize: 12, marginTop: "10px", padding: '5px 20px'}}>Launching 10 COTD per week via @holaplex</h5>
                <div style={{width: "fit-content", margin: "30px auto"}}>
                    <Button type="default" style={width > 768 ? {borderRadius: 8, width: 280, height: 60, fontSize: 20} : {borderRadius: 8, width: 200, height: 40, fontSize: 14}}>
                        <span>LIVE AUCTION</span>
                    </Button>
                </div>
                <div style={{width: "fit-content", margin: "30px auto"}}>
                    <Button type="default" style={width > 768 ? {borderRadius: 8, width: 260, height: 50, fontSize: 18} : {borderRadius: 8, width: 180, height: 30, fontSize: 12}}>
                        <Space>
                            <img src={'/images/head_discord.png'} width={width > 768 ? 20 : 15} height={width > 768 ? 15 : 10} />
                            <span>JOIN OUR DISCORD</span>
                        </Space>
                    </Button>
                </div>
            </Col>
        </Row>

        <Row style={width > 768 ? {width: '60%', margin: "80px auto"} : {width: '80%', margin: "30px auto"}}>
            <Col xl={12} xs={24}>
                <h3 className="text-blue">1,000 unique Childs</h3>
                <h4 className="text-white">who need a family.</h4>
                <br />
                <p className="text-white">Child Of The Dice is an unique and original hand drawn collection created by a team of experienced artists.</p>
                <br />
                <p className="text-white">Each artwork is full drawn manually, our purpose is to give something unique and original with a story behind each child created.</p>
                <br />
                <p className="text-white">Take care of the child that you own because the supply is limited to 1,000 NFTs</p>
            </Col>
            <Col xl={12} xs={24}>
                <div style={width > 768 ? {width: '70%', margin: '0 auto'} : {width: '50%', margin: '10px auto'}}>
                    <img src={'/images/overview.png'} />
                </div>
            </Col>
        </Row>

        <div>
            <Carousel
                slidesToShow={width > 1024 ? 5 : 3}
                centerMode={true}
                centerPadding={'20px'}
                draggable={true}
                swipeToSlide={true}
                touchThreshold={50}
                focusOnSelect={true}
                dotPosition={'bottom'}
                autoplay={true}
                beforeChange={onCarouselChanged}
                adaptiveHeight={true}
            >
                <div>
                    <img src={'/images/carousel/1.png'} style={carouselIndex == 0 ? {width: `${width/3}px`} : {padding: '10px', width: `${(width/3) * 0.9}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/2.png'} style={carouselIndex == 1 ? {width: `${width/3}px`} : {padding: '10px', width: `${(width/3) * 0.9}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/3.png'} style={carouselIndex == 2 ? {width: `${width/3}px`} : {padding: '10px', width: `${(width/3) * 0.9}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/4.png'} style={carouselIndex == 3 ? {width: `${width/3}px`} : {padding: '10px', width: `${(width/3) * 0.9}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/5.png'} style={carouselIndex == 4 ? {width: `${width/3}px`} : {padding: '10px', width: `${(width/3) * 0.9}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/6.png'} style={carouselIndex == 5 ? {width: `${width/3}px`} : {padding: '10px', width: `${(width/3) * 0.9}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/7.png'} style={carouselIndex == 6 ? {width: `${width/3}px`} : {padding: '10px', width: `${(width/3) * 0.9}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/8.png'} style={carouselIndex == 7 ? {width: `${width/3}px`} : {padding: '10px', width: `${(width/3) * 0.9}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/9.png'} style={carouselIndex == 8 ? {width: `${width/3}px`} : {padding: '10px', width: `${(width/3) * 0.9}px`}} />
                </div>
            </Carousel>
        </div>
    </Layout>
  );
};
