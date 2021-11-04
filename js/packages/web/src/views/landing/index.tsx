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

        <Row style={width > 768 ? {width: '60%', margin: "80px auto"} : {width: '80%', margin: "30px auto"}} id="about">
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
                slidesToShow={width > 768 ? 3 : 1}
                centerMode={true}
                draggable={true}
                swipeToSlide={true}
                touchThreshold={50}
                focusOnSelect={true}
                dots={{className: "dots"}}
                autoplay={true}
                beforeChange={onCarouselChanged}
                adaptiveHeight={true}>
                <div>
                    <img src={'/images/carousel/1.jpg'} style={carouselIndex == 0 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/2.jpg'} style={carouselIndex == 1 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/3.jpg'} style={carouselIndex == 2 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/4.jpg'} style={carouselIndex == 3 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/5.jpg'} style={carouselIndex == 4 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/6.jpg'} style={carouselIndex == 5 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/7.jpg'} style={carouselIndex == 6 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/8.jpg'} style={carouselIndex == 7 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                </div>
                <div>
                    <img src={'/images/carousel/9.jpg'} style={carouselIndex == 8 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                </div>
            </Carousel>
        </div>

        <Row style={width > 768 ? {width: '70%', margin: "100px auto 80px auto"} : {width: '90%', margin: "100px auto 60px auto"}} id="factions">
            <Col span={6}>
                <h4 className="text-white text-center">Factions</h4>
            </Col>
            <Col span={18} />
            <Col span={6}>
                <div style={{margin: '20px'}}>
                    <img src={'/images/faction1.png'} />
                </div>
            </Col>
            <Col span={18}>
                <h5 className="text-white" style={{marginTop: '20px'}}>SURREALIST</h5>
                <br />
                <p className="text-white">As great power implies great responsibility, and with the knowledge of the existence of terrifying forces of evil, they have decided to use their power to spread goodwill well-being, and to erase the evil and its atrocities. They have decided to use their most powerful children to form a special faction, called Surrealist. This faction is made up of the most powerful and combat capable childs needed to keep the peace and drive out the bad guys, colonizing and murderous, dangerous and destructive species across the galaxy and the universe and its borders. As the name suggests, this faction is composed of childs, with the most extraordinary and amazing powers. They will fight battles in the farthest reaches of the universe and return victorious, or never return.</p>
            </Col>
            <Col span={24}><br /></Col>
            <Col span={24}><br /></Col>
            <Col span={6}>
                <div style={{margin: '20px'}}>
                    <img src={'/images/faction2.png'} />
                </div>
            </Col>
            <Col span={18}>
                <h5 className="text-white" style={{marginTop: '20px'}}>CELESTIAL</h5>
                <br />
                <p className="text-white">Specifics childs with extraordinary wisdom and intelligence is in charge of the most important decisions of the childs planet. They decide on goals and priorities. They have uncommon insight and experience, and make the most crucial and difficult decisions. They decide when and if the children should intervene in any event. Their decisions are so complex that they are sometimes understood centruies later. For example, allowing a malevolent species to cononise a planet with a benevolent and harmless native species. It was carnage at first but it turned out that over time this harmless species, has successfully adaptedand developed a defence system that repels the colonising species and offers them protection for the future, allowing them to evolve and prosper in peace.</p>
            </Col>
        </Row>
    </Layout>
  );
};
