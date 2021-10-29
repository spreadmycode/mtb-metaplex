import { Button, Layout, Spin, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { mintNFT } from './actions';
import { useWallet } from '@solana/wallet-adapter-react';
import { ConnectButton, CurrentUserBadge } from '../../common';
import * as anchor from "@project-serum/anchor";
import { LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";
import { 
    CONTRACTOR_ADDRESS, 
    CONTRACTOR_ACCOUNT, 
    CONTRACTOR_WALLET, 
    CONTRACTOR_PIVATE, 
    OWNERS, 
    PRESALERS,
    ROYALTY_LIMIT,
} from "./constants";
import { PublicKey, Transaction } from '@solana/web3.js';
import BN from 'bn.js';
import {
    useConnection,
    IMetadataExtension,
    MetadataCategory,
    useConnectionConfig,
    Creator,
    notify,
  } from '@oyster/common';
import { empty, gql } from '@apollo/client'
import { useMutation, useApolloClient } from '@apollo/client'

const InsertMinterMutation = gql`
  mutation InsertMinterMutation($pubKey: String!) {
    insertMinter(input: { pubKey: $pubKey }) {
        minter {
            id
            pubkey
            royalty
        }
    }
  }
`;

const FindMintersMutation = gql`
  mutation FindMintersMutation($pubKey: String!) {
    findMinters(input: { pubKey: $pubKey }) {
        minters {
            id
            pubkey
            royalty
        }
    }
  }
`;

const GetMintersCountMutation = gql`
  mutation GetMintersCountMutation {
    getMintersCount {
        count
    }
  }
`;

const AddRoyaltyAllMintersMutation = gql`
mutation AddRoyaltyAllMintersMutation($distribution: Int!) {
    addRoyaltyAllMinters(input: { distribution: $distribution })
}
`;

const GetMinterRoyaltyMutation = gql`
mutation GetMinterRoyaltyMutation($pubKey: String!) {
    getMinterRoyalty(input: { pubKey: $pubKey }) {
        royalty
    }
}
`;

const ClearMinterRoyaltyMutation = gql`
mutation ClearMinterRoyaltyMutation($pubKey: String!) {
    clearMinterRoyalty(input: { pubKey: $pubKey })
}
`;

export interface Contractor {
    address: anchor.web3.PublicKey;
    wallet: anchor.web3.PublicKey;
    program: anchor.Program;
}

export interface Wallet {
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
    publicKey: PublicKey;
}

export function loadWalletKey(): Keypair {
    const loaded = Keypair.fromSecretKey(
        new Uint8Array(JSON.parse(CONTRACTOR_PIVATE)),
    );
    return loaded;
}

export const Home = () => {

    let _interval:any = undefined;

    const [balance, setBalance] = useState<number>();
    const [isMinting, setIsMinting] = useState(false);
    const [isSoldout, setIsSoldOut] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [remainCount, setRemainCount] = useState<number>();
    const [redeemCount, setRedeemCount] = useState<number>();
    const [totalCount, setTotalCount] = useState<number>();
    const [presaleCount, setPresaleCount] = useState<number>();
    const [contractor, setContractor] = useState<Contractor>();
    const [presaleMinters, setPresaleMinters] = useState<Array<number>>();
    const [presaleMillis, setPresaleMilis] = useState<number>();
    const [isPresalePeriod, setIsPresalePeriod] = useState(false);
    const [presaleRemainTime, setPresaleRemainTime] = useState<string>();
    const [lastPossesion, setLastPossesion] = useState<number>();
    const [attributes, setAttributes] = useState<IMetadataExtension>({
        name: '',
        symbol: '',
        description: '',
        external_url: '',
        image: '',
        animation_url: undefined,
        attributes: undefined,
        seller_fee_basis_points: 0,
        creators: [],
        properties: {
          files: [],
          category: MetadataCategory.Image,
        },
      });

    const wallet = useWallet();
    const connected = wallet.connected;
    const connection = useConnection();
    const { env } = useConnectionConfig();

    const client = useApolloClient();
    const [insertMinter] = useMutation(InsertMinterMutation);
    const [findMinters] = useMutation(FindMintersMutation);
    const [getMintersCount] = useMutation(GetMintersCountMutation);
    const [addRoyaltyAllMinters] = useMutation(AddRoyaltyAllMintersMutation);
    const [getMinterRoyalty] = useMutation(GetMinterRoyaltyMutation);
    const [clearMinterRoyalty] = useMutation(ClearMinterRoyaltyMutation);

    async function loadOwnerAnchorProgram(env: string) {
        const solConnection = new anchor.web3.Connection(
          `https://api.${env}.solana.com/`,
        );

        const walletKeyPair = loadWalletKey();
        const walletWrapper = new anchor.Wallet(walletKeyPair);

        const provider = new anchor.Provider(solConnection, walletWrapper, {
          preflightCommitment: 'recent',
        });
        const idl = await anchor.Program.fetchIdl(CONTRACTOR_ADDRESS, provider);
    
        return new anchor.Program(idl, CONTRACTOR_ADDRESS, provider);
    }

    async function loadUserAnchorProgram(env: string) {
        const solConnection = new anchor.web3.Connection(
          `https://api.${env}.solana.com/`,
        );

        const anchorWallet = {
            publicKey: wallet.publicKey,
            signAllTransactions: wallet.signAllTransactions,
            signTransaction: wallet.signTransaction,
        } as Wallet;

        const provider = new anchor.Provider(solConnection, anchorWallet, {
          preflightCommitment: 'recent',
        });
        const idl = await anchor.Program.fetchIdl(CONTRACTOR_ADDRESS, provider);
    
        return new anchor.Program(idl, CONTRACTOR_ADDRESS, provider);
    }

    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function notifyStatus(message: string, description: string, type: string) {
        notify({
            message: message,
            description: (
              description
            ),
            type: type,
        });
    }
    
    const withdraw = async () => {
        if (!connected) return;

        const currentWallet = wallet.publicKey?.toBase58();
        const currentAddress = currentWallet ? currentWallet : '';

        // Check current wallet has minted already
        const mintersMut = await findMinters({
            variables: {
                pubKey: currentAddress
            },
        });
        const minters = mintersMut.data.findMinters.minters;

        if (minters == null || (minters != undefined && minters.length == 0)) {
            notifyStatus('Withdraw failed', 'You are not minter of solpups.', 'info');
            return;
        }

        // Check distribution possible
        const ownerWalletKeyPair = loadWalletKey();
        const ownerWalletWrapper = new anchor.Wallet(ownerWalletKeyPair);
        let possesion = 0;
        if (ownerWalletWrapper?.publicKey) {
            possesion = await connection.getBalance(ownerWalletWrapper?.publicKey);
            const baseLamports = lastPossesion ? lastPossesion : 0;
            if (possesion > baseLamports) {
                // It is possible to distribution
                const mintersCountMut = await getMintersCount();
                const mintersCount = mintersCountMut.data.getMintersCount.count;

                if (mintersCount > 0) {
                    const distribution = Math.floor((possesion - baseLamports) / (mintersCount + 1)); // For gas fee, plus one count
                    await addRoyaltyAllMinters({
                        variables: {
                            distribution
                        },
                    });
                }
            }
        }

        // Get current wallet's royalty
        const royaltyMut = await getMinterRoyalty({
            variables: {
                pubKey: currentAddress
            },
        });
        const royalty = royaltyMut.data.getMinterRoyalty.royalty;

        // Check royalty over the limit
        if (royalty < ROYALTY_LIMIT) {
            notifyStatus('Withdraw failed', `Your royalty does not meet limit ${ROYALTY_LIMIT / LAMPORTS_PER_SOL} SOL. Please wait for a while.`, 'info');
            return;
        }

        // Check contract possesion enough
        if (possesion < royalty) {
            notifyStatus('Withdraw failed', 'Solpups does not have enough funds.', 'info');
            return;
        }

        let oldBalance = 0;
        if (wallet?.publicKey) {
            oldBalance = await connection.getBalance(wallet?.publicKey);
        }
        const ownerProgram = await loadOwnerAnchorProgram('devnet');

        setIsWithdrawing(true);

        await ownerProgram.rpc.withdrawRoyalty(
            new BN(royalty),
            {
              accounts: {
                data: contractor?.address,
                wallet: contractor?.wallet,
                gainer: wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
              },
            },
        );

        setIsWithdrawing(false);

        if (wallet?.publicKey) {
            const balance = await connection.getBalance(wallet?.publicKey);
            setBalance(balance / LAMPORTS_PER_SOL);

            const gainedRoyalty = (balance - oldBalance) / LAMPORTS_PER_SOL;
            if (gainedRoyalty > 0) {
                // Set royalty 0
                await clearMinterRoyalty({
                    variables: {
                        pubKey: currentAddress
                    },
                });

                notifyStatus('Withdraw success', `You gained ${gainedRoyalty} SOL.`, 'success');
            } else {
                notifyStatus('Withdraw failed', 'Something went wrong.', 'error');
            }
        }
    };

    const mint = async () => {
        if (!connected) return;

        const creatorWallet = wallet.publicKey?.toBase58();
        const creatorAddress = creatorWallet ? creatorWallet : '';
        const presalerIndex = PRESALERS.indexOf(creatorAddress);

        if (isPresalePeriod) {
            if (presaleCount && presaleCount > 0) {     // Case presale available
                if (presalerIndex == -1) {                  // Case not presale wallet
                    notifyStatus('MINT Failed', 'Your wallet is not in whitelist.', 'info');
                    return;
                } else {                                    // Case presale wallet
                    const presalerMinterIndex = presaleMinters?.indexOf(presalerIndex);
                    if (presalerMinterIndex != -1) {            // Case already presale
                        notifyStatus('MINT Failed', 'You have already got presale.', 'info');
                        return;
                    }
                }
            } else {                                    // Case presale unavailable
                notifyStatus('MINT Failed', 'Presale is unavailable.', 'info');
                return;
            }
        }
        
        setIsMinting(true);

        // Animation video loading
        let cardType = randomIntFromInterval(1, 3);
        let imageUrl = '';
        switch (cardType) {
            case 1:
                imageUrl = 'https://ucarecdn.com/c51194d0-d686-42b6-a526-34b4c8748492/gold.gif';
                break;
            case 2:
                imageUrl = 'https://ucarecdn.com/aba02261-e9c9-4ab7-8a63-fb4e55b90447/silver.gif';
                break;
            case 3:
                imageUrl = 'https://ucarecdn.com/52d019a1-e05b-4607-912c-add31b1cb471/bronze.gif';
                break;
        }

        // Royalty gainers
        const originalMinter = new Creator({
                address: creatorAddress,
                verified: true, 
                share: 0
            }
        );
        const creators: Array<Creator> = [];
        OWNERS.forEach((owner: Creator) => {
            if (originalMinter.address == owner.address) {
                originalMinter.share += owner.share;
            } else {
                creators.push(owner);
            }
        });
        creators.push(originalMinter);

        // Final metadata for NFT
        const metadata = {
            name: cardType == 1 ? 'Gold Card' : cardType == 2 ? 'Silver Card' : 'Bronze Card',
            symbol: 'Branden',
            creators,
            description: 'This NFT is very important for your life. Best regards. Branden G.',
            sellerFeeBasisPoints: 1000,
            image: imageUrl,
            animation_url: undefined,
            attributes: undefined,
            external_url: 'https://solanart.io/',
            properties: {
                files: [],
                category: 'image',
            },
        };

        // Update progress inside mintNFT
        const _nft = await mintNFT(
            connection,
            wallet,
            env,
            [],
            metadata,
            attributes.properties?.maxSupply,
        );

        // After minting
        if (_nft) {
            // Decrease remain count
            if (isPresalePeriod) {                  // Case presale period
                await contractor?.program.rpc.decreasePresaleCount(
                    new BN(presalerIndex),
                    {
                      accounts: {
                        data: contractor.address,
                        minter: wallet.publicKey,
                      }
                    },
                );
            } else {                                // Case freesale period
                await contractor?.program.rpc.decreaseRemainCount(
                    {
                      accounts: {
                        data: contractor.address,
                        minter: wallet.publicKey,
                      }
                    },
                );
            }

            // Insert minter into db
            await insertMinter({
                variables: {
                    pubKey: creatorAddress
                },
            });
        }

        setIsMinting(false);

        if (wallet?.publicKey) {
            const balance = await connection.getBalance(wallet?.publicKey);
            setBalance(balance / LAMPORTS_PER_SOL);
        }
    };

    useEffect(() => {
        (async () => {
            const address = new PublicKey(CONTRACTOR_ACCOUNT);
            const walletKey = new PublicKey(CONTRACTOR_WALLET);
            const anchorProgram = await loadUserAnchorProgram('devnet');
            setContractor({address: address, wallet: walletKey, program: anchorProgram});

            if (wallet?.publicKey) {
                const balance = await connection.getBalance(wallet?.publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
            }

            const data: any = await anchorProgram.account.data.fetch(address);
            const totalCount = data.totalCount.toNumber();
            const remainCount = data.remainCount.toNumber();
            const presaleCount = data.presaleCount.toNumber();
            const presaleMinters = data.presaleMinters;
            const redeemedCount = totalCount - remainCount;
            const presaleMillis = data.presaleDate.toNumber();
            const lastPossesion = data.lastLamports.toNumber();

            setTotalCount(totalCount);
            setRemainCount(remainCount);
            setPresaleCount(presaleCount);
            setRedeemCount(redeemedCount);
            setPresaleMinters(presaleMinters);
            setPresaleMilis(presaleMillis);
            setLastPossesion(lastPossesion);
            setIsSoldOut(remainCount == 0);

            const currentMillis = Date.now();
            if (
                presaleMillis && 
                presaleMillis <= currentMillis && 
                presaleMillis + 24 * 3600 * 1000 >= currentMillis
            ) {                                                     // Case presale period
                setIsPresalePeriod(true);

                const interval = setInterval(() => {
                    const currentMillis = Date.now();
                    const limitTime = presaleMillis + 24 * 3600 * 1000;
                    const remainTime = limitTime - currentMillis;
                    const hours = Math.floor((remainTime / 1000) / 3600);
                    const minutes = Math.floor(((remainTime - hours * 3600 * 1000) / 1000) / 60);
                    const seconds = Math.floor(remainTime / 1000) % 60;
                    setPresaleRemainTime(`${hours}h ${minutes}m ${seconds}s`);
                }, 1000);

                if (_interval) {
                    clearInterval(_interval);
                }
                _interval = interval;
            } else {                                                // Case freesale period
                setIsPresalePeriod(false);

                if (_interval) {
                    clearInterval(_interval);
                }
            }
        })();
    }, [wallet, connection, balance]);

    return (
        <Layout>
            {connected ? (
                <div className="app-right app-bar-box">
                <CurrentUserBadge
                    showBalance={false}
                    showAddress={false}
                    iconSize={24}
                />
                </div>
            ) : (
                <ConnectButton type="primary" allowWalletChange />
            )}

            <h2>{isPresalePeriod ? 'Presale Period' : 'Freesale Period'}</h2>
            
            <pre>Balance       : {balance}</pre>
            <pre>Total Count   : {totalCount}</pre>
            <pre>Remain Count  : {remainCount}</pre>
            <pre>Redeem Count  : {redeemCount}</pre>
            {
                isPresalePeriod ? 
                    <div>
                        <pre>Presale Count : {presaleCount}</pre>
                        <pre>Remain time   : {presaleRemainTime}</pre>
                    </div>
                : 
                    null
            }

            <Button 
                disabled={isSoldout || isMinting || isWithdrawing}
                onClick={mint} >
                    {isMinting ? (
                        <Space size="middle">
                            <Spin />
                        </Space>    
                    ) : ("MINT")}
            </Button>
            <Button 
                disabled={
					//!isSoldout || 
					isMinting || isWithdrawing}
                onClick={withdraw} >
                    {isWithdrawing ? (
                        <Space size="middle">
                            <Spin />
                        </Space>    
                    ) : ("WITHDRAW")}
            </Button>
        </Layout>
    );
};
