import { Layout } from 'antd';
import { useWallet } from "@solana/wallet-adapter-react";
import useWalletNfts from '../../actions/use-wallet-nfts';

export const GalleryView = () => {

    const wallet = useWallet();

    const [isLoading, nfts]: any = useWalletNfts();

    return (
        <Layout>
            <div className="flex flex-col justify-center items-center flex-1 space-y-10 mt-20 divide-y-4 divide-purple-400">
                {isLoading && <h1 className="text-lg text-black font-bold animate-pulse">Loading your NFT&apos;s, please wait...</h1>}
                {!isLoading && !wallet.connected && <h1 className="text-lg text-black font-bold">Please connect your wallet.</h1>}
                {!isLoading && wallet.connected && nfts.length === 0 && <h1 className="text-lg text-black font-bold">
                    You do not have &quot;NFTs&quot;
                </h1>}

                {nfts.map((nft: any) => 
                    <div key={nft.name} className="flex pt-10 flex-col items-center justify-center text-gray-800 font-bold uppercase space-y-5">
                    <div className="frame flex-grow-0" style={{ padding: 5 }}>
                        <img src={nft.image} alt="NFT" />
                    </div>
                    <div className="flex flex-col text-xl space-x-3 items-center">
                        <a target="_blank" href={`${nft.external_url}/${nft.id}`}
                            className="flex space-x-3 text-black hover:text-purple-500" rel="noreferrer">
                            <span>{nft.name}</span>
                        </a>
                    </div>
                </div>)}
            </div>
        </Layout>
    );

};