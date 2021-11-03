import Head from 'next/head'
import { Menu, Dropdown, Button, Layout, BackTop } from 'antd';
import React, { useCallback } from 'react';
import { ConnectButton, useWalletModal, shortenAddress, CurrentUserBadge } from '@oyster/common';
import { useWallet } from '@solana/wallet-adapter-react';
import { OWNER_WALLET } from '../../constants';
import { Link } from 'react-router-dom';
import Linkage from 'next/link';
import {
    UnorderedListOutlined,
    FileImageOutlined,
    WalletOutlined,
    DownOutlined
} from '@ant-design/icons';

export const LandingView = () => {

  const { wallet, publicKey, connect, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const open = useCallback(() => setVisible(true), [setVisible]);

  const handleChangeWallet = useCallback(
    () => (wallet ? disconnect().catch(() => {}) : open()),
    [wallet, connect, disconnect, open],
  );

  const pc_menu = (
    <Menu theme="dark">
      <Menu.Item>
        <Linkage href="/#roadmap">
            <Button type="text" size="small">Roadmap</Button>
        </Linkage>
      </Menu.Item>
      <Menu.Item>
        <Linkage href="/#origins">
            <Button type="text" size="small">Origins</Button>
        </Linkage>
      </Menu.Item>
      <Menu.Item>
        <Linkage href="/#team">
            <Button type="text" size="small">Team</Button>
        </Linkage>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item>
        <Link to="/gallery">
            <Button type="text" icon={<FileImageOutlined />}>Gallery</Button>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/mine">
            <Button type="text" icon={<WalletOutlined />}>My COTDs</Button>
        </Link>
      </Menu.Item>
    </Menu>
  );

  const sp_menu = (
    <Menu theme="dark">
      <Menu.Item>
        <Linkage href="/#artwork">
            <Button type="text" size="small">Artwork</Button>
        </Linkage>
      </Menu.Item>
      <Menu.Item>
        <Linkage href="/#factions">
            <Button type="text" size="small">Factions</Button>
        </Linkage>
      </Menu.Item>
      <Menu.Item>
        <Linkage href="/#rarity">
            <Button type="text" size="small">Rarity</Button>
        </Linkage>
      </Menu.Item>
      <Menu.Item>
        <Linkage href="/#roadmap">
            <Button type="text" size="small">Roadmap</Button>
        </Linkage>
      </Menu.Item>
      <Menu.Item>
        <Linkage href="/#origins">
            <Button type="text" size="small">Origins</Button>
        </Linkage>
      </Menu.Item>
      <Menu.Item>
        <Linkage href="/#team">
            <Button type="text" size="small">Team</Button>
        </Linkage>
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item>
        <Link to="/gallery">
            <Button type="text" size="small" icon={<FileImageOutlined />}>Gallery</Button>
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/mine">
            <Button type="text" size="small" icon={<WalletOutlined />}>My COTD</Button>
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>   
        <header className="wow fadeInDown">
            <div className="pc">
                <div className="d-flex justify-content-between container align-items-baseline py-2 mb-0">
                        
                    <a href="/" className="d-flex align-items-center mr-5">
                        <h3 className="text-white mr-3 font-weight-bold font-chiller mb-0">Child Of The</h3>
                        <img className="dice_img" src={'/images/dice.png'} alt=""/>
                    </a>
                    
                    <Linkage href="/#artwork">
                        <Button className="font-calibri font-weight-bold" type="text" size="large">Artwork</Button>
                    </Linkage>
                    <Linkage href="/#factions">
                        <Button className="font-calibri font-weight-bold" type="text" size="large">Factions</Button>
                    </Linkage>
                    <Linkage href="/#rarity">
                        <Button className="font-calibri font-weight-bold" type="text" size="large">Rarity</Button>
                    </Linkage>
                    <Dropdown overlay={pc_menu} arrow>
                        <Button className="font-calibri font-weight-bold" type="text" size="large" >Others <DownOutlined /></Button>
                    </Dropdown>

                    <Button type="default" size="middle" shape="round" onClick={handleChangeWallet}>{ connected ? shortenAddress(publicKey?.toBase58() || '', 4) : "Connect"}</Button>

                    <div className="d-flex align-items-center">
                        <a href="https://twitter.com/cotd" className="mr-3">
                            <img className="link_img" src={'/images/head_twitter.png'} alt=""/>
                        </a>
                        <a href="https://discord.com/cotd" className="mr-3">
                            <img className="link_img" src={'/images/head_discord.png'} alt=""/>
                        </a>
                        <a href="https://instagram.com/cotd" className="mr-3">
                            <img className="link_img" src={'/images/head_instagram.png'} alt=""/>
                        </a>
                    </div>
                </div>
            </div>

            <div className="sp">
                <div className="top-bar d-flex align-items-center">
                    <div className="d-flex align-items-center">
                        <a href="/" className="d-flex align-items-center mr-5">
                            <h3 className="text-white mr-3 font-weight-bold font-chiller mb-0">Child Of The</h3>
                            <img className="dice_img" src={'/images/dice.png'} alt=""/>
                        </a>
                        <Dropdown overlay={sp_menu} arrow>
                            <Button size="large" type="link">
                                <Button className="font-calibri font-weight-bold" size="large" type="text">Others <DownOutlined /></Button>
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </header>

        <main>
            <BackTop>
                <div style={{
                        height: 40,
                        width: 40,
                        lineHeight: '40px',
                        borderRadius: 4,
                        backgroundColor: '#333331',
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: 14,
                    }}>
                    UP
                </div>
            </BackTop>
            <section className="banner c-container toppadding" id="cotds">
                <div className="row align-items-center banner-image__inner wow fadeInLeft imageAnimationSection">
                    <img className="w-100 imageAnimation" src="/images/image-01.png" alt=""/>
                </div>
                
                {/* Artwork */}
                <div className="row mt-5 align-items-center" id="artwork">
                    <div className="col-md-2"></div>
                    <div className="col-md-4 wow">
                        <h4 className="text-white font-calibri">Artwork</h4>
                        <br />
                        <br />
                        <p className="text-white font-calibri text-description">
                            Child Of The Dice is an unique and original 
                            hand drawn collection created by a team of 
                            experienced artists. 
                        </p>
                        <br />
                        <p className="text-white font-calibri text-description">
                            Each draw include a storbyboard for a purpose 
                            to give something unique and original to each 
                            collector thanks to different traits.
                        </p>
                    </div>
                    <div className="col-md-4 wow">
                        <img className="w-100" src="/images/overview.png" alt=""/>
                    </div>
                    <div className="col-md-2"></div>
                </div>

                {/* Factions */}
                <div className="row mt-5 align-items-center" id="factions">
                    <div className="col-md-2"></div>
                    <div className="col-md-10">
                        <h4 className="text-white font-calibri">Factions</h4>
                        <p className="text-white font-calibri text-description mt-2">
                            Two factions who doesn't like each others.
                        </p>
                    </div>
                </div>
                <div className="row mt-5 align-items-center">
                    <div className="col-md-2"></div>
                    <div className="col-md-4 wow">
                        <img className="w-100" src="/images/gif.gif" alt=""/>
                    </div>
                    <div className="col-md-4 wow">
                        <h5 className="text-white font-calibri">Surrealist Faction</h5>
                        <br />
                        <br />
                        <p className="text-white font-calibri text-description">
                            Child Of The Dice is an unique and original 
                            hand drawn collection created by a team of 
                            experienced artists. 
                        </p>
                        <br />
                        <p className="text-white font-calibri text-description">
                            Each draw include a storbyboard for a purpose 
                            to give something unique and original to each 
                            collector thanks to different traits.
                        </p>
                    </div>
                    <div className="col-md-2"></div>
                </div>
                <div className="row mt-5 align-items-center">
                    <div className="col-md-2"></div>
                    <div className="col-md-4 wow">
                        <h5 className="text-white font-calibri">Celestial Faction</h5>
                        <br />
                        <br />
                        <p className="text-white font-calibri text-description">
                            Child Of The Dice is an unique and original 
                            hand drawn collection created by a team of 
                            experienced artists. 
                        </p>
                        <br />
                        <p className="text-white font-calibri text-description">
                            Each draw include a storbyboard for a purpose 
                            to give something unique and original to each 
                            collector thanks to different traits.
                        </p>
                    </div>
                    <div className="col-md-4 wow">
                        <img className="w-100" src="/images/gif.gif" alt=""/>
                    </div>
                    <div className="col-md-2"></div>
                </div>

                {connected &&
                <>
                    <h4 className="text-white text-center font-calibri mt-5">Explore the gallery of COTDs with their own story.</h4>
                    <div className="row align-items-center justify-content-center mt-3">
                        <CurrentUserBadge
                            showBalance={true}
                            showAddress={true}
                            iconSize={18}
                        />
                    </div>
                    <div className="row align-items-center justify-content-center mt-3">
                        <Link to="/gallery">
                            <Button type="default" shape="round" size="large" className="m-2">View Gallery</Button>
                        </Link>
                        {publicKey?.toBase58() == OWNER_WALLET &&
                            <Link to="/art/create">
                            <Button type="default" shape="round" size="large" className="m-2">Create a new COTD</Button>
                        </Link>}
                    </div>
                </>}

                {/* Rarity */}
                <div className="row align-items-center justify-content-center mt-5" id="rarity">
                    <div className="col-md-1"></div>
                    <div className="col-md-10">
                        <h4 className="text-white font-calibri mt-5">Rarity</h4>
                        <br />
                        <p className="text-white font-calibri text-description">
                            5 types of rarities will be available from "Very Rare" to "Mythical" 
                        </p>
                        <p className="text-white font-calibri text-description">
                            The rarity of each artwork depends on the time spent on the art creation and their story.
                        </p>
                    </div>
                    <div className="col-md-1"></div>
                </div>
                <div className="row mt-5 align-items-center">
                    <div className="col-md-1"></div>
                    <div className="col-md-3 wow">
                        <img className="w-100" src="/images/rarity.png" alt=""/>
                    </div>
                    <div className="col-md-2 mt-2"></div>
                    <div className="col-md-5 wow">
                        <img className="w-100" src="/images/rarity_chart.png" alt=""/>
                    </div>
                    <div className="col-md-1"></div>
                </div>

                {/* Roadmap */}
                <h4 className="text-white font-calibri mt-5 text-center" id="roadmap">Roadmap</h4>
                <div className="row">
                    <div className="col-md-2"></div>    
                    <div className="col-md-8">
                        <p className="text-white font-calibri mt-5 text-center text-description">
                            The goal behind Child Of The Dice is to create an friendly, open and inclusive community centered
                            around NFT artwork. Through charity events and the eclectic community, Child Of The Dice 
                            will be able to help children in need. The need to advocate for children's illness has become 
                            more apparent in recent years and thus, Child Of The Dice was born.                
                        </p>
                    </div>
                    <div className="col-md-2"></div>    
                </div>
                <div className="row mt-5 align-items-center">
                    <div className="col-md-2"></div>
                    <div className="col-md-2 wow">
                        <img className="w-100" src="/images/roadmap1.png" alt=""/>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-4 wow mt-2">
                        <h5 className="text-white font-calibri">Owner of an unique piece.</h5>
                        <p className="text-white font-calibri text-description">
                            You own an unique artwork with a an original story.              
                        </p>
                    </div>
                    <div className="col-md-2"></div>
                </div>
                <div className="row align-items-center">
                    <div className="col-md-2"></div>
                    <div className="col-md-4 wow mt-2">
                        <h5 className="text-white font-calibri">Charity Partners</h5>
                        <p className="text-white font-calibri text-description">
                            We’ll be donating 10% generated from sales to childrens charites.            
                        </p>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-2 wow">
                        <img className="w-100" src="/images/roadmap2.png" alt=""/>
                    </div>
                    <div className="col-md-2"></div>
                </div>
                <div className="row align-items-center">
                    <div className="col-md-2"></div>
                    <div className="col-md-2 wow">
                        <img className="w-100" src="/images/roadmap3.png" alt=""/>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-4 wow mt-2">
                        <h5 className="text-white font-calibri">Community wallet</h5>
                        <p className="text-white font-calibri text-description">
                            A community wallet will be set with 8% of the sales         
                        </p>
                    </div>
                    <div className="col-md-2"></div>
                </div>
                <p className="text-white text-center font-calibri text-description mt-5">
                    Merch airdrop, video game and much more!      
                </p>

                {/* Origins */}
                <h4 className="text-white font-calibri mt-5 text-center" id="origins">Origins</h4>

                {/* Team */}
                <h4 className="text-white font-calibri mt-5 text-center" id="team">Team</h4>
                <div className="row align-items-center mt-5">
                    <div className="col-md-2"></div>
                    <div className="col-md-2 mt-3">
                        <img className="w-100" src="/images/team1.png" alt=""/>
                        <h4 className="text-white font-calibri mt-2 text-center">Nakiwarai</h4>
                        <p className="text-white text-center font-calibri text-description mt-2">
                            Artist 
                        </p>
                        <div className="row align-items-center mt-3">
                            <div className="col d-flex align-items-center justify-content-center">
                                <a href="https://twitter.com/cotd">
                                    <img className="link_img" src="/images/head_twitter.png" alt=""/>
                                </a>
                            </div>
                            <div className="col d-flex align-items-center justify-content-center">
                                <a href="https://instagram.com/cotd">
                                    <img className="link_img" src="/images/head_instagram.png" alt=""/>
                                </a>
                            </div>
                            <div className="col d-flex align-items-center justify-content-center">
                                <a href="https://childofdice.com">
                                    <img className="link_img" src="/images/head_website.png" alt=""/>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-2 mt-3">
                        <img className="w-100" src="/images/team2.png" alt=""/>
                        <h4 className="text-white font-calibri mt-2 text-center">Owner</h4>
                        <p className="text-white text-center font-calibri text-description mt-2">
                            Founder
                        </p>
                        <div className="row align-items-center mt-3">
                            <div className="col d-flex align-items-center justify-content-center">
                                <a href="https://twitter.com/cotd">
                                    <img className="link_img" src="/images/head_twitter.png" alt=""/>
                                </a>
                            </div>
                            <div className="col d-flex align-items-center justify-content-center">
                                <a href="https://instagram.com/cotd">
                                    <img className="link_img" src="/images/head_instagram.png" alt=""/>
                                </a>
                            </div>
                            <div className="col d-flex align-items-center justify-content-center">
                                <a href="https://childofdice.com">
                                    <img className="link_img" src="/images/head_website.png" alt=""/>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-1"></div>
                    <div className="col-md-2 mt-3">
                        <img className="w-100" src="/images/team3.png" alt=""/>
                        <h4 className="text-white font-calibri mt-2 text-center">Redhotieh</h4>
                        <p className="text-white text-center font-calibri text-description mt-2">
                            Artist 
                        </p>
                        <div className="row align-items-center mt-3">
                            <div className="col d-flex align-items-center justify-content-center">
                                <a href="https://twitter.com/cotd">
                                    <img className="link_img" src="/images/head_twitter.png" alt=""/>
                                </a>
                            </div>
                            <div className="col d-flex align-items-center justify-content-center">
                                <a href="https://instagram.com/cotd">
                                    <img className="link_img" src="/images/head_instagram.png" alt=""/>
                                </a>
                            </div>
                            <div className="col d-flex align-items-center justify-content-center">
                                <a href="https://childofdice.com">
                                    <img className="link_img" src="/images/head_website.png" alt=""/>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2"></div>
                </div>
            </section>

        </main>

        <footer className="wow fadeInUp mt-5">
            <a href="" className="d-flex align-items-center justify-content-center">
                <h1 className="text-white mr-2 font-weight-bold font-chiller">Child Of the</h1>
                <img className="dice_img" src="/images/dice.png" alt=""/>
            </a>
            <h5 className="font-calibri text-white mt-2 text-center">© All Rights Reserved 2021</h5>
            <div className="d-flex align-items-center justify-content-center mt-3">
                <a href="https://twitter.com/cotd" className="px-4">
                    <img className="link_img" src="/images/head_twitter.png" alt=""/>
                </a>
                <a href="https://discord.com/cotd" className="px-4">
                    <img className="link_img" src="/images/head_discord.png" alt=""/>
                </a>
                <a href="https://discord.com/cotd" className="px-4">
                    <img className="link_img" src="/images/head_instagram.png" alt=""/>
                </a>
            </div>
        </footer>
    
    </Layout>
  );
};
