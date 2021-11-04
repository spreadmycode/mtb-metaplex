import { Menu, Dropdown, Button, Layout, BackTop, Row, Col, Space, Carousel, Collapse } from 'antd';
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { ConnectButton, useWalletModal, shortenAddress, CurrentUserBadge } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { OWNER_WALLET } from '../../constants';
import { Link } from 'react-router-dom';
import Linkage from 'next/link';
import useWindowDimensions from '../../utils/layout';
import {
    MenuOutlined,
    CloseOutlined
} from '@ant-design/icons';

const { Panel } = Collapse;

const [SCROLL_UP, SCROLL_DOWN] = [0, 1];

export const LandingView = () => {
  const { wallet, publicKey, connect, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [menuView, setMenuView] = useState(false);
  const open = useCallback(() => setVisible(true), [setVisible]);
  const { width } = useWindowDimensions();
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [scrollDir, setScrollDir] = useState(SCROLL_DOWN);
  const [movingImageYPos, setMovingImageYPos] = useState(width > 768 ? 28 : 50);

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

  useEffect(() => {
    const threshold = 0;
    let lastScrollY = window.pageYOffset;
    let ticking = false;
  
    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;
  
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      setScrollDir(scrollY > lastScrollY ? SCROLL_DOWN : SCROLL_UP);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };
  
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };
  
    window.addEventListener("scroll", onScroll);

    let pos = 0;
    if (scrollDir == SCROLL_UP) {
        pos = movingImageYPos + 5;
        if (pos >= 100) pos = 100;
    } else if (scrollDir == SCROLL_DOWN) {
        pos = movingImageYPos - 5;
        if (pos <= 0) pos = 0;
    }
    setMovingImageYPos(pos);

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDir]);

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
                <h6 className="text-center">BENEFITS AND ROADMAP</h6>
            </Linkage>
        </Menu.Item>
        <Menu.Item>
            <Link to="/gallery">
                <h6 className="text-center">GALLERY</h6>
            </Link>
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
                    <a href="https://instagram.com/cotd" target="_blank">
                        <Button type="ghost" style={{width: 30, height: 30, padding: 2}}>
                            <img src={'/images/head_instagram.png'} width={15} height={15} />
                        </Button>
                    </a>
                    <a href="https://twitter.com/cotd" target="_blank">
                        <Button type="ghost" style={{width: 30, height: 30, padding: 2}}>
                            <img src={'/images/head_twitter.png'} width={15} height={15} />
                        </Button>
                    </a>
                    <a href="https://discord.com/cotd" target="_blank">
                        <Button type="ghost" style={{width: 30, height: 30, padding: 2}}>
                            <img src={'/images/head_discord.png'} width={15} height={15} />
                        </Button>
                    </a>
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
        <div className="background">
            {(width > 768) && 
                <div className="moving-image" style={{transform: `translate3d(0px, ${movingImageYPos}%, 0px)`, zIndex: 1}}>
                    <img src={'/images/backgrounds/moving.png'} />
                </div>
            }
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

            <Row style={width > 768 ? {width: '70%', margin: "100px auto 80px auto", zIndex: 2, position: 'relative'} : {width: '90%', margin: "100px auto 60px auto", zIndex: 2, position: 'relative'}} id="factions">
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

            <Row style={width > 768 ? {width: '70%', margin: "100px auto 80px auto", zIndex: 2, position: 'relative'} : {width: '90%', margin: "100px auto 60px auto", zIndex: 2, position: 'relative'}} id="roadmap">
                <Col xl={12} xs={24}>
                    <h4 className="text-white">Benefits & Roadmap</h4>
                    <br />
                    <p className="text-white">The goal behind Child Of The Dice is to create an friendly, open and inclusive community centered around NFT artwork. Through Charity eveents and the eclectic community, Child Of The Dice will be able to help children in need. The need to advocate for children's illness has become more apparent in recent years and thus, Child Of The Dice was born.</p>
                </Col>
                <Col xl={12} xs={0} />
                <Row style={{margin: '100px 0 0 0', width: '100%'}}>
                    <Col span={6}>
                        <div style={{width: '80%'}}>
                            <img src={'/images/roadmap1.png'} />
                        </div>
                    </Col>
                    <Col span={18} style={{alignItems: 'center', display: 'flex'}}>
                        <div>
                            <h5 className="text-blue">Owner of an unique piece.</h5>
                            <p className="text-white">You own an unique artwork with an original story.</p>
                        </div>
                    </Col>
                </Row>
                <Row style={{margin: '100px 0 0 0', width: '100%'}}>
                    <Col span={6}>
                        <div style={{width: '80%'}}>
                            <img src={'/images/roadmap2.png'} />
                        </div>
                    </Col>
                    <Col span={18} style={{alignItems: 'center', display: 'flex'}}>
                        <div>
                            <h5 className="text-blue">Supply of the collection</h5>
                            <p className="text-white">Only 1,000 COTDs will be available.</p>
                        </div>
                    </Col>
                </Row>
                <Row style={{margin: '100px 0 0 0', width: '100%'}}>
                    <Col span={6}>
                        <div style={{width: '80%'}}>
                            <img src={'/images/roadmap3.png'} />
                        </div>
                    </Col>
                    <Col span={18} style={{alignItems: 'center', display: 'flex'}}>
                        <div>
                            <h5 className="text-blue">Charity Partners</h5>
                            <p className="text-white">We'll be donating 10% generated from sales to childrens charites.</p>
                        </div>
                    </Col>
                </Row>
                <Row style={{margin: '100px 0 0 0', width: '100%'}}>
                    <Col span={6}>
                        <div style={{width: '80%'}}>
                            <img src={'/images/roadmap4.png'} />
                        </div>
                    </Col>
                    <Col span={18} style={{alignItems: 'center', display: 'flex'}}>
                        <div>
                            <h5 className="text-blue">Child of The Dice x Artists</h5>
                            <p className="text-white">Open collaborations with other artists.</p>
                        </div>
                    </Col>
                </Row>
                <Row style={{margin: '100px 0 0 0', width: '100%'}}>
                    <Col span={6}>
                        <div style={{width: '80%'}}>
                            <img src={'/images/roadmap5.png'} />
                        </div>
                    </Col>
                    <Col span={18} style={{alignItems: 'center', display: 'flex'}}>
                        <div>
                            <h5 className="text-blue">Development of Cartoon</h5>
                            <p className="text-white">Launch of COTD Cartoon</p>
                        </div>
                    </Col>
                </Row>
                <Row style={{margin: '100px 0 0 0', width: '100%'}}>
                    <Col span={6}>
                        <div style={{width: '80%'}}>
                            <img src={'/images/roadmap6.png'} />
                        </div>
                    </Col>
                    <Col span={18} style={{alignItems: 'center', display: 'flex'}}>
                        <div>
                            <h5 className="text-blue">Community wallet</h5>
                            <p className="text-white">A community wallet will be set with 8% of the sales.</p>
                        </div>
                    </Col>
                </Row>
            </Row>

            <Row style={width > 768 ? {width: '70%', margin: "100px auto 80px auto"} : {width: '90%', margin: "100px auto 60px auto"}} id="faq">
                <Col span={24} style={{marginBottom: '20px'}}>
                    <h4 className="text-white text-center">FAQ's</h4>
                </Col>
                <Col span={24}>
                    <Collapse
                        style={{width: '100%'}}
                        expandIconPosition={'right'}>
                        <Panel header="How can I buy a COTD?" key="1">
                            <div>This is dummy text. This is dummy text. This is dummy text. This is dummy text.</div>
                        </Panel>
                        <Panel header="When the auctions are open?" key="2">
                            <div>This is dummy text. This is dummy text. This is dummy text. This is dummy text.</div>
                        </Panel>
                        <Panel header="Is there a limit?" key="3">
                            <div>This is dummy text. This is dummy text. This is dummy text. This is dummy text.</div>
                        </Panel>
                        <Panel header="How rare is my COTD?" key="4">
                            <div>This is dummy text. This is dummy text. This is dummy text. This is dummy text.</div>
                        </Panel>
                        <Panel header="Will there be a secondary marketplace?" key="5">
                            <div>This is dummy text. This is dummy text. This is dummy text. This is dummy text.</div>
                        </Panel>
                        <Panel header="Are there secondary sale royalties?" key="7">
                            <div>This is dummy text. This is dummy text. This is dummy text. This is dummy text.</div>
                        </Panel>
                        <Panel header="Do I own the COTD after purchasing?" key="8">
                            <div>This is dummy text. This is dummy text. This is dummy text. This is dummy text.</div>
                        </Panel>
                    </Collapse>
                </Col>
            </Row>

            <Row style={width > 768 ? {width: '70%', margin: "20px auto"} : {width: '90%', margin: "10px auto"}} id="cooperation">
                <Col span={24}>
                    <h4 className="text-white text-center">In Cooperation with</h4>
                </Col>
                <Col span={24}>
                    <Row style={{padding: '20px'}}>
                        <Col xl={8} xs={24} style={{marginTop: '20px'}}>
                            <img src={'/images/team1.png'} style={{padding: '10px'}} />
                            <p className="text-white text-center" style={{marginTop: '20px', marginBottom: '20px'}}>@SOLBigBrain</p>
                            <Row>
                                <Col span={24} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <a href='https://twitter.com/cotd' target="_blank">
                                        <img src={'/images/head_twitter.png'} width={20} height={20} style={{margin: '5px'}} />
                                    </a>
                                </Col>
                            </Row>
                        </Col>
                        <Col xl={8} xs={24} style={{marginTop: '20px'}}>
                            <img src={'/images/team2.png'} style={{padding: '10px'}} />
                            <p className="text-white text-center" style={{marginTop: '20px', marginBottom: '20px'}}>@SOLBigBrain</p>
                            <Row>
                                <Col span={24} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <a href='https://twitter.com/cotd' target="_blank">
                                        <img src={'/images/head_twitter.png'} width={20} height={20} style={{margin: '5px'}} />
                                    </a>
                                    <a href='https://instagram.com/cotd' target="_blank">
                                        <img src={'/images/head_instagram.png'} width={20} height={20} style={{margin: '5px'}} />
                                    </a>
                                </Col>
                            </Row>
                        </Col>
                        <Col xl={8} xs={24} style={{marginTop: '20px'}}>
                            <img src={'/images/team3.png'} style={{padding: '10px'}} />
                            <p className="text-white text-center" style={{marginTop: '20px', marginBottom: '20px'}}>@SOLBigBrain</p>
                            <Row>
                                <Col span={24} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <a href='https://instagram.com/cotd' target="_blank">
                                        <img src={'/images/head_instagram.png'} width={20} height={20} style={{margin: '5px'}} />
                                    </a>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row className="footer-bar">
                <Col style={width > 768 ? {width: '70%', margin: "60px auto 0 auto"} : {width: '90%', margin: "40px auto 0 auto"}} id="footer">
                    <Row>
                        <Col xl={8} xs={24} style={width > 768 ? {} : {display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <div>
                                <p className="text-white mb-3">JOIN US ON</p>
                                <a href="https://twitter.com/cotd" target="_blank">
                                    <Button type="default" style={{width: "200px", height: "40px", display: 'block', marginBottom: '10px'}}>
                                        TWITTER
                                    </Button>
                                </a>
                                <a href="https://discord.com/cotd" target="_blank">
                                    <Button type="default" style={{width: "200px", height: "40px", display: 'block', marginBottom: '10px'}}>
                                        DISCORD
                                    </Button>
                                </a>
                                <a href="https://instagram.com/cotd" target="_blank">
                                    <Button type="default" style={{width: "200px", height: "40px", display: 'block', marginBottom: '10px'}}>
                                        INSTAGRAM
                                    </Button>
                                </a>
                            </div>
                        </Col>
                        <Col xl={8} xs={0}>
                            <div style={{width: '100%', height: '100%', display: 'flex'}}>
                                <div style={{width: 'fit-content', margin: 'auto', textAlign: 'center'}}>
                                    <Link to="/">
                                        <img src={'/images/logo.png'} width={'70%'} />
                                    </Link>
                                </div>
                            </div>
                        </Col>
                        <Col xl={8} xs={24} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <div>
                                <br />
                                <Linkage href="/#about">
                                    <Button type="text" size="small" style={{display: 'block'}}>
                                        ABOUT
                                    </Button>
                                </Linkage>
                                <Linkage href="/#roadmap">
                                    <Button type="text" size="small" style={{display: 'block'}}>
                                        BENEFITS AND ROADMAP
                                    </Button>
                                </Linkage>
                                <Link to="/gallery">
                                    <Button type="text" size="small" style={{display: 'block'}}>
                                        GALLERY
                                    </Button>
                                </Link>
                                <Linkage href="/#marketplace">
                                    <Button type="text" size="small" style={{display: 'block'}}>
                                        MARKETPLACE
                                    </Button>
                                </Linkage>
                                <Linkage href="/#faq">
                                    <Button type="text" size="small" style={{display: 'block'}}>
                                        FAQ
                                    </Button>
                                </Linkage>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <p className="text-white text-center mt-5">© Child Of The Dice. All Rights Reserved 2021</p>
                    </Row>
                </Col>
            </Row>
        </div>
    </Layout>
  );
};
