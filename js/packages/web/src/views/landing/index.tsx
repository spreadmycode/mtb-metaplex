import { Menu, Dropdown, Button, Layout, BackTop, Row, Col, Space, Carousel } from 'antd';
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { ConnectButton, useWalletModal, shortenAddress, CurrentUserBadge, notify } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { OWNER_WALLET } from '../../constants';
import { Link, useHistory } from 'react-router-dom';
import useWindowDimensions from '../../utils/layout';
import {
    MenuOutlined,
    CloseOutlined,
    MinusOutlined,
    PlusOutlined,
    CaretUpOutlined
} from '@ant-design/icons';

const [SCROLL_UP, SCROLL_DOWN] = [0, 1];

export const LandingView = () => {
  const aboutRef = useRef(null);
  const roadmapRef = useRef(null);
  const faqRef = useRef(null);
  const { wallet, publicKey, connect, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const history = useHistory();
  const [menuView, setMenuView] = useState(false);
  const open = useCallback(() => setVisible(true), [setVisible]);
  const { width } = useWindowDimensions();
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [scrollDir, setScrollDir] = useState(SCROLL_DOWN);
  const [movingImageYPos, setMovingImageYPos] = useState(30);
  const [activeFaqIndex, setActiveFaqIndex] = useState(-1);

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

  const handleFaq = (index: number) => {
    if (index == activeFaqIndex) {
        setActiveFaqIndex(-1);
    } else {
        setActiveFaqIndex(index);
    }
  }

  const handleMine = () => {
      if (connected) {
            history.push('/mine');
      } else {
            notify({
                message: 'Please connect wallet.',
                type: 'info',
            });
            handleChangeWallet();
            history.push('/');
      }
      handleMenuToggle();
  }

  const scrollTo = (ref) => {
    window.scroll(
      {
        top: ref.current.offsetTop,
        behavior: "smooth",
      }
    );
    handleMenuToggle();
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
    <Menu style={{backgroundColor:'#08011c', width: 'fit-content', padding: 5, marginTop: 60, color: 'white'}}>
        <Menu.Item>
            <Row style={{width: '100%'}}>
                <div style={{border: 'solid 1px grey', borderRadius: 8, width: '100%', padding: 10}} onClick={handleMine}>
                    <Link to="/mine">
                        <h6 className="text-center text-white">MY COTD</h6>
                        <p className="text-center text-white text-light">COTDs can be seen from phantom wallet.</p>
                    </Link>
                </div>
            </Row>
        </Menu.Item>
        {(publicKey?.toBase58() == OWNER_WALLET) &&
            <Menu.Item>
                <Row style={{width: '100%'}}>
                    <div style={{border: 'solid 1px grey', borderRadius: 8, width: '100%', padding: 10}}>
                        <Link to="/art/create">
                            <h6 className="text-center text-white">Create COTD</h6>
                            <p className="text-center text-white text-light">You are admin of COTD.</p>
                        </Link>
                    </div>
                </Row>
            </Menu.Item>
        }
        <Row style={{width: '100%', height: 20}} />
        <Menu.Item>
          <h6 className="text-center text-white" onClick={() => scrollTo(aboutRef)}>ABOUT</h6>
        </Menu.Item>
        <Menu.Item>
          <h6 className="text-center text-white" onClick={() => scrollTo(roadmapRef)}>BENEFITS AND ROADMAP</h6>
        </Menu.Item>
        <Menu.Item>
          <Link to="/gallery">
            <h6 className="text-center text-white">GALLERY</h6>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/marketplace">
            <h6 className="text-center text-white">MARKETPLACE</h6>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <h6 className="text-center text-white" onClick={() => scrollTo(faqRef)}>FAQ'S</h6>
        </Menu.Item>
        <Row>
            <div style={{width: 'fit-content', margin: '20px auto 10px auto'}}>
                <Space>
                    <a href="https://instagram.com/cotd" target="_blank">
                        <Button type="ghost" style={{width: 35, height: 35, padding: 2, borderRadius: 0}}>
                            <img src={'/images/head_instagram.png'} width={20} height={20} />
                        </Button>
                    </a>
                    <a href="https://twitter.com/ChildOfTheDice" target="_blank">
                        <Button type="ghost" style={{width: 35, height: 35, padding: 2, borderRadius: 0}}>
                            <img src={'/images/head_twitter.png'} width={20} height={20} />
                        </Button>
                    </a>
                    <a href="https://discord.com/invite/cotd" target="_blank">
                        <Button type="ghost" style={{width: 35, height: 35, padding: 2, borderRadius: 0}}>
                            <img src={'/images/head_discord.png'} width={20} height={20} />
                        </Button>
                    </a>
                </Space>
            </div>
        </Row>
        <Menu.Item>
          <p className="text-center text-white" onClick={() => scrollTo(aboutRef)}>TERMS AND CONDITIONS</p>
        </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
        <div className="landing-container">
            <div className="background">
                <Row style={{padding: (width > 768) ? '10px 10%' : '10px 20px 10px 5px'}}>
                    <Col span={8}>
                        <Row style={{marginTop: '10px'}}>
                            <Link to="/">
                                <Col xl={16} xs={24} >
                                    <img src={'/images/logo.png'} />
                                </Col>
                            </Link>
                            <Col xl={8} xs={0}></Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Row>
                            <Col xl={7} xs={5}></Col>
                            <Col xl={10} xs={14}>
                                <div style={{width: '100%', textAlign: 'center'}}>
                                    <img src={'/images/brand.png'} />
                                </div>
                            </Col>
                            <Col xl={7} xs={5}></Col>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Row>
                            <Col style={{margin: '10px 0 0 auto'}}>
                                <Space size={(width > 768) ? 'middle' : 'small'}>
                                    <button className="connect-button" onClick={handleChangeWallet} style={width > 768 ? {fontSize: '16px'} : {fontSize: '12px'}}>{connected ? shortenAddress(publicKey?.toBase58() || '', width > 768 ? 4 : 2) : width > 768 ? 'CONNECT WALLET' : 'CONNECT'}</button>
                                    <Dropdown overlay={sp_menu} trigger={['click']} onVisibleChange={handleMenuToggle}>
                                        <Button type="text" shape="circle" size={(width > 768) ? 'large' : 'small'} onClick={handleMenuToggle} icon={menuView ? <CloseOutlined /> : <MenuOutlined />} />
                                    </Dropdown>
                                </Space>
                            </Col>
                        </Row>
                        {connected && 
                            <Row>
                                <div style={{width: 'fit-content', margin: '10px 0 0 auto', color: "grey", fontSize: '10px'}}>
                                    <CurrentUserBadge
                                        showBalance={true}
                                        showAddress={false}
                                        iconSize={14}
                                    />
                                </div>
                            </Row>
                        }
                    </Col>
                </Row>

                <Row>
                    <Col span={24} style={{marginTop: 60}}>
                        <h4 className="text-center" style={width > 768 ? {fontSize: 20} : {padding: '5px 20px', fontSize: 14}}>Open auction every Tuesday and Friday at 6pm UTC</h4>
                        <h5 className="text-center" style={width > 768 ? {fontSize: 18, marginTop: "10px"} : {fontSize: 12, marginTop: "10px", padding: '5px 20px'}}>Launching 5 COTD every open auction</h5>
                        <div style={{width: "fit-content", margin: "30px auto"}}>
                            <a href="https://cotdnft.holaplex.com/#/" target="_blank">
                                <Button type="default" style={width > 768 ? {borderRadius: 8, width: 280, height: 60, fontSize: 20} : {borderRadius: 8, width: 200, height: 40, fontSize: 14}}>
                                    <span>LIVE AUCTION</span>
                                </Button>
                            </a>
                        </div>
                        <div style={{width: "fit-content", margin: "30px auto"}}>
                            <a href="https://discord.com/invite/cotd" target="_blank">
                                <Button type="default" style={width > 768 ? {borderRadius: 8, width: 260, height: 50, fontSize: 18} : {borderRadius: 8, width: 180, height: 30, fontSize: 12}}>
                                    <Space>
                                        <img src={'/images/head_discord.png'} width={width > 768 ? 25 : 20} height={width > 768 ? 25 : 20} />
                                        <span>JOIN OUR DISCORD</span>
                                    </Space>
                                </Button>
                            </a>
                        </div>
                    </Col>
                </Row>
            
                <Row ref={aboutRef} style={width > 768 ? {width: '70%', margin: "80px auto"} : {width: '90%', margin: "30px auto"}} id="about">
                    <Col xl={12} xs={24} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <div style={{width: '100%'}}>
                            <h3 className="text-blue">1,000 unique Children</h3>
                            <h4 className="text-white">who need a family.</h4>
                            <br />
                            <p className="text-white">Child Of The Dice is a unique and original hand drawn collection created by a team of experienced artists.</p>
                            <br />
                            <p className="text-white">Each artwork is completely drawn manually. Our purpose is to give something unique and original, and to tell a story behind each child created.</p>
                            <br />
                            <p className="text-white">Take care of the child that you own because the supply is limited to 1000 NFTs.</p>
                        </div>
                    </Col>
                    <Col xl={12} xs={24}>
                        <div style={{width: '100%', textAlign: 'center'}}>
                            <img src={'/images/overview.png'} width={(width > 768) ? '70%' : '50%'} />
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
                            <img className="hand-cursor" src={'/images/carousel/1.jpg'} style={carouselIndex == 0 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                        </div>
                        <div>
                            <img className="hand-cursor" src={'/images/carousel/2.jpg'} style={carouselIndex == 1 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                        </div>
                        <div>
                            <img className="hand-cursor" src={'/images/carousel/3.jpg'} style={carouselIndex == 2 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                        </div>
                        <div>
                            <img className="hand-cursor" src={'/images/carousel/4.jpg'} style={carouselIndex == 3 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                        </div>
                        <div>
                            <img className="hand-cursor" src={'/images/carousel/5.jpg'} style={carouselIndex == 4 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                        </div>
                        <div>
                            <img className="hand-cursor" src={'/images/carousel/6.jpg'} style={carouselIndex == 5 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                        </div>
                        <div>
                            <img className="hand-cursor" src={'/images/carousel/7.jpg'} style={carouselIndex == 6 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                        </div>
                        <div>
                            <img className="hand-cursor" src={'/images/carousel/8.jpg'} style={carouselIndex == 7 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                        </div>
                        <div>
                            <img className="hand-cursor" src={'/images/carousel/9.jpg'} style={carouselIndex == 8 ? {padding: `${(width/3) * 0.05}px`} : {padding: `${(width/3) * 0.1}px`}} />
                        </div>
                    </Carousel>
                </div>

                <Row style={width > 768 ? {width: '70%', margin: "100px auto 80px auto", zIndex: 2, position: 'relative'} : {width: '90%', margin: "100px auto 60px auto", zIndex: 2, position: 'relative'}} id="factions">
                    <Col span={6}>
                        <h4 className="text-white text-center">Factions</h4>
                    </Col>
                    <Col span={18} />
                    <Col span={6}>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                            <div style={{width: '80%', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRadius: '50%'}}>
                                <img src={'/images/faction1.jpg'} style={{transform: 'scale(1.05)'}} />
                            </div>
                        </div>
                    </Col>
                    <Col span={18}>
                        <h5 className="text-blue" style={{marginTop: '20px'}}>Surrealist:</h5>
                        <br />
                        <p className="text-white">As great power implies great responsibility, and with the knowledge of the existence of terrifying forces of evil, they have decided to use their power to spread goodwill, well-being, and to erase the evil and its atrocities. They have decided to use their most powerful children to form a special faction, called Surrealist. This faction is made up of the most powerful and combat-capable children needed to keep the peace and drive out the bad guys. They fight tirelessly against the colonizing, murderous, dangerous and destructive species across the galaxy and it's borders. As the name suggests, this faction is composed of children with the most extraordinary and amazing powers. They will fight battles in the farthest reaches of the universe and return victorious, or never return.</p>
                    </Col>
                    <Col span={24}><br /></Col>
                    <Col span={24}><br /></Col>
                    <Col span={6}>
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                            <div style={{width: '80%', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRadius: '50%'}}>
                                <img src={'/images/faction2.jpg'} style={{transform: 'scale(1.05)'}} />
                            </div>
                        </div>
                    </Col>
                    <Col span={18}>
                        <h5 className="text-blue" style={{marginTop: '20px'}}>Celestial:</h5>
                        <br />
                        <p className="text-white">Specifics children with extraordinary wisdom and intelligence are in charge of the most important decisions of the children's planet. They decide on goals and priorities. They have rare insights and experience, and make the most crucial and difficult decisions. They decide when and if the children should intervene in any event. Their decisions are so complex that they are sometimes not understood until centuries later... For example, allowing a malevolent species to colonize a planet and destory a benevolent and harmless native species. It was carnage at first, but it turned out that over time this harmless species has successfully adapted and developed a defense system that repels the colonizing species and offers them protection for the future, allowing them to evolve and prosper in peace.</p>
                    </Col>
                </Row>

                <Row ref={roadmapRef} style={width > 768 ? {width: '70%', margin: "100px auto 80px auto", zIndex: 2, position: 'relative'} : {width: '90%', margin: "100px auto 60px auto", zIndex: 2, position: 'relative'}} id="roadmap">
                    <Col xl={12} xs={24}>
                        <h4 className="text-white">Benefits & Roadmap:</h4>
                        <br />
                        <p className="text-white">The goal behind Child Of The Dice is to create a friendly, open, and inclusive community centered around NFT artwork. Through Charity events and the eclectic community, Child Of The Dice will be able to help children in need. The need to advocate for children's illness has become more apparent in recent years and thus, Child Of The Dice was born.</p>
                    </Col>
                    <Col xl={12} xs={0} />
                    <Row style={{margin: '100px 0 0 0', width: '100%'}}>
                        <Col span={6}>
                            <div style={{width: '100%', textAlign: 'left'}}>
                                <img src={'/images/roadmap1.png'} width={'70%'} />
                            </div>
                        </Col>
                        <Col span={18} style={{alignItems: 'center', display: 'flex'}}>
                            <div>
                                <h5 className="text-blue">Owner of an unique piece.</h5>
                                <p className="text-white">You own a unique artwork with an original story.</p>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{margin: '100px 0 0 0', width: '100%'}}>
                        <Col span={6}>
                            <div style={{width: '100%', textAlign: 'left'}}>
                                <img src={'/images/roadmap2.png'} width={'70%'} />
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
                            <div style={{width: '100%', textAlign: 'left'}}>
                                <img src={'/images/roadmap3.png'} width={'70%'} />
                            </div>
                        </Col>
                        <Col span={18} style={{alignItems: 'center', display: 'flex'}}>
                            <div>
                                <h5 className="text-blue">Charity Partners</h5>
                                <p className="text-white">We'll be donating 10% of the revenue generated from sales to children's charities.</p>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{margin: '100px 0 0 0', width: '100%'}}>
                        <Col span={6}>
                            <div style={{width: '100%', textAlign: 'left'}}>
                                <img src={'/images/roadmap4.png'} width={'70%'} />
                            </div>
                        </Col>
                        <Col span={18} style={{alignItems: 'center', display: 'flex'}}>
                            <div>
                                <h5 className="text-blue">Child of The Dice x Artists</h5>
                                <p className="text-white">Open collaborations with other artists.c</p>
                            </div>
                        </Col>
                    </Row>
                    <Row style={{margin: '100px 0 0 0', width: '100%'}}>
                        <Col span={6}>
                            <div style={{width: '100%', textAlign: 'left'}}>
                                <img src={'/images/roadmap5.png'} width={'70%'} />
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
                            <div style={{width: '100%', textAlign: 'left'}}>
                                <img src={'/images/roadmap6.png'} width={'70%'} />
                            </div>
                        </Col>
                        <Col span={18} style={{alignItems: 'center', display: 'flex'}}>
                            <div>
                                <h5 className="text-blue">Community wallet</h5>
                                <p className="text-white">A community wallet will be set with 8% of the total sales.</p>
                            </div>
                        </Col>
                    </Row>
                </Row>

                <Row ref={faqRef} style={width > 768 ? {width: '70%', margin: "100px auto 80px auto"} : {width: '90%', margin: "100px auto 60px auto"}} id="faq">
                    <Col span={24} style={{marginBottom: '20px'}}>
                        <h4 className="text-white text-center">FAQ's</h4>
                    </Col>
                    <Col span={24}>
                        <div className={activeFaqIndex == 0 ? 'faq active-faq' : 'faq'}>
                            <div className='faq-header' onClick={() => handleFaq(0)}>
                                <div>How can I buy a COTD?</div>
                                <div className='faq-icon'>{activeFaqIndex == 0 ? <MinusOutlined /> : <PlusOutlined />}</div>
                            </div>
                            <div className={activeFaqIndex == 0 ? 'active-faq-content' : 'faq-content'}>COTD purchasing happens through our ‘Live Auction’ which can be found at the top of the website. After purchasing you can check your COTD on 'MY COTD' section.</div>
                        </div>
                        <div className={activeFaqIndex == 1 ? 'faq active-faq' : 'faq'}>
                            <div className='faq-header' onClick={() => handleFaq(1)}>
                                <div>When the auctions are open?</div>
                                <div className='faq-icon'>{activeFaqIndex == 1 ? <MinusOutlined /> : <PlusOutlined />}</div>
                            </div>
                            <div className={activeFaqIndex == 1 ? 'active-faq-content' : 'faq-content'}>The auction is open at November 23rd (6PM UTC). Auction will last for 24h at the starting bid of 0.5 SOL.</div>
                        </div>
                        <div className={activeFaqIndex == 2 ? 'faq active-faq' : 'faq'}>
                            <div className='faq-header' onClick={() => handleFaq(2)}>
                                <div>Is there a limit?</div>
                                <div className='faq-icon'>{activeFaqIndex == 2 ? <MinusOutlined /> : <PlusOutlined />}</div>
                            </div>
                            <div className={activeFaqIndex == 2 ? 'active-faq-content' : 'faq-content'}>The supply of the collection is limited to 1000 COTD. No limit is applied to own multiple COTD.</div>
                        </div>
                        <div className={activeFaqIndex == 3 ? 'faq active-faq' : 'faq'}>
                            <div className='faq-header' onClick={() => handleFaq(3)}>
                                <div>How rare is my COTD?</div>
                                <div className='faq-icon'>{activeFaqIndex == 3 ? <MinusOutlined /> : <PlusOutlined />}</div>
                            </div>
                            <div className={activeFaqIndex == 3 ? 'active-faq-content' : 'faq-content'}>Every COTD is special and unique with an original story.</div>
                        </div>
                        <div className={activeFaqIndex == 4 ? 'faq active-faq' : 'faq'}>
                            <div className='faq-header' onClick={() => handleFaq(4)}>
                                <div>Will there be a secondary marketplace?</div>
                                <div className='faq-icon'>{activeFaqIndex == 4 ? <MinusOutlined /> : <PlusOutlined />}</div>
                            </div>
                            <div className={activeFaqIndex == 4 ? 'active-faq-content' : 'faq-content'}>Yes, we will apply on MagicEden and ExchangeArt.</div>
                        </div>
                        <div className={activeFaqIndex == 5 ? 'faq active-faq' : 'faq'}>
                            <div className='faq-header' onClick={() => handleFaq(5)}>
                                <div>Are there secondary sale royalties?</div>
                                <div className='faq-icon'>{activeFaqIndex == 5 ? <MinusOutlined /> : <PlusOutlined />}</div>
                            </div>
                            <div className={activeFaqIndex == 5 ? 'active-faq-content' : 'faq-content'}>Yes, royalties are set at 10% for future project expansion.</div>
                        </div>
                        <div className={activeFaqIndex == 6 ? 'faq active-faq' : 'faq'}>
                            <div className='faq-header' onClick={() => handleFaq(6)}>
                                <div>Do I own the COTD after purchasing?</div>
                                <div className='faq-icon'>{activeFaqIndex == 6 ? <MinusOutlined /> : <PlusOutlined />}</div>
                            </div>
                            <div className={activeFaqIndex == 6 ? 'active-faq-content' : 'faq-content'}>Yes, full intellectual properties are given to the buyer. You can learn more on our terms section.</div>
                        </div>
                    </Col>
                </Row>

                <Row style={width > 768 ? {width: '70%', margin: "20px auto"} : {width: '90%', margin: "10px auto"}} id="cooperation">
                    <Col span={24}>
                        <h4 className="text-white text-center">In Cooperation with</h4>
                    </Col>
                    <Col span={24}>
                        <Row style={{padding: '20px'}}>
                            <Col xl={6} xs={24} style={{marginTop: '20px', textAlign: 'center'}}>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'center', padding: '10px'}}>
                                    <div style={{width: (width > 768) ? '90%' : '70%', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRadius: '50%'}}>
                                        <img src={'/images/team1.jpg'} style={{transform: 'scale(1.05)'}} />
                                    </div>
                                </div>
                                <p className="text-white text-center" style={{marginTop: '20px', marginBottom: '20px'}}>@SOLBigBrain</p>
                                <Row>
                                    <Col span={24} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <a href='https://twitter.com/SOLBigBrain' target="_blank">
                                            <img src={'/images/head_twitter.png'} width={20} height={20} style={{margin: '5px'}} />
                                        </a>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xl={6} xs={24} style={{marginTop: '20px', textAlign: 'center'}}>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'center', padding: '10px'}}>
                                    <div style={{width: (width > 768) ? '90%' : '70%', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRadius: '50%'}}>
                                        <img src={'/images/team2.jpg'} style={{transform: 'scale(1.05)'}} />
                                    </div>
                                </div>                            
                                <p className="text-white text-center" style={{marginTop: '20px', marginBottom: '20px'}}>@Nakiwarai</p>
                                <Row>
                                    <Col span={24} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <a href='https://twitter.com/Kamidzukuri' target="_blank">
                                            <img src={'/images/head_twitter.png'} width={20} height={20} style={{margin: '5px'}} />
                                        </a>
                                        <a href='https://artstation.com/nakiwarai' target="_blank">
                                            <img src={'/images/head_web.png'} width={20} height={20} style={{margin: '5px'}} />
                                        </a>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xl={6} xs={24} style={{marginTop: '20px', textAlign: 'center'}}>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'center', padding: '10px'}}>
                                    <div style={{width: (width > 768) ? '90%' : '70%', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRadius: '50%'}}>
                                        <img src={'/images/team3.jpg'} style={{transform: 'scale(1.05)'}} />
                                    </div>
                                </div>                            
                                <p className="text-white text-center" style={{marginTop: '20px', marginBottom: '20px'}}>@itsthealygator</p>
                                <Row>
                                    <Col span={24} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <a href='https://twitter.com/itsthealygator' target="_blank">
                                            <img src={'/images/head_twitter.png'} width={20} height={20} style={{margin: '5px'}} />
                                        </a>
                                        <a href='https://www.instagram.com/thealygator' target="_blank">
                                            <img src={'/images/head_instagram.png'} width={20} height={20} style={{margin: '5px'}} />
                                        </a>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xl={6} xs={24} style={{marginTop: '20px', textAlign: 'center'}}>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'center', padding: '10px'}}>
                                    <div style={{width: (width > 768) ? '90%' : '70%', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRadius: '50%'}}>
                                        <img src={'/images/team4.jpg'} style={{transform: 'scale(1.05)'}} />
                                    </div>
                                </div>                            
                                <p className="text-white text-center" style={{marginTop: '20px', marginBottom: '20px'}}>@Redhotieh</p>
                                <Row>
                                    <Col span={24} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <a href='https://www.instagram.com/redhotieh' target="_blank">
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
                                    <a href="https://twitter.com/ChildOfTheDice" target="_blank">
                                        <Button type="default" style={{width: "200px", height: "40px", display: 'block', marginBottom: '10px', borderRadius: 0}}>
                                            TWITTER
                                        </Button>
                                    </a>
                                    <a href="https://discord.com/invite/cotd" target="_blank">
                                        <Button type="default" style={{width: "200px", height: "40px", display: 'block', marginBottom: '10px', borderRadius: 0}}>
                                            DISCORD
                                        </Button>
                                    </a>
                                    <a href="https://instagram.com/cotd" target="_blank">
                                        <Button type="default" style={{width: "200px", height: "40px", display: 'block', marginBottom: '10px', borderRadius: 0}}>
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
                                    <Button type="text" size="small" style={{display: 'block'}} onClick={() => scrollTo(aboutRef)}>
                                        ABOUT
                                    </Button>
                                    <Button type="text" size="small" style={{display: 'block'}} onClick={() => scrollTo(roadmapRef)}>
                                        BENEFITS AND ROADMAP
                                    </Button>
                                    <Link to="/gallery">
                                        <Button type="text" size="small" style={{display: 'block'}}>
                                            GALLERY
                                        </Button>
                                    </Link>
                                    <Link to="/marketplace">
                                      <Button type="text" size="small" style={{display: 'block'}}>
                                          MARKETPLACE
                                      </Button>
                                    </Link>
                                    <Button type="text" size="small" style={{display: 'block'}} onClick={() => scrollTo(faqRef)}>
                                        FAQ
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <p className="text-white text-center mt-5" onClick={() => scrollTo(aboutRef)}>© Child Of The Dice. All Rights Reserved 2021</p>
                        </Row>
                    </Col>
                </Row>

                {(width > 768) && 
                    <div className="moving-image" style={{transform: `translate3d(0px, ${movingImageYPos}%, 0px)`, zIndex: 1}}>
                        <img src={'/images/backgrounds/moving.png'} />
                    </div>
                }
                <BackTop>
                    <div className="back-top-button"><CaretUpOutlined /></div>
                </BackTop>
            </div>
        </div>
    </Layout>
  );
};
