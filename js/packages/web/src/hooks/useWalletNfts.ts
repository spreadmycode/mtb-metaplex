import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import * as anchor from "@project-serum/anchor";
import axios from "axios";
import { Metadata } from '../libs/metaplex/index.esm';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const rpcHost = "https://rough-broken-sunset.solana-mainnet.quiknode.pro/5a7650cf3b001df949b2895baf059be1572e14bf/";
const connection = new anchor.web3.Connection(rpcHost);
const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

async function getNftsForOwner(connection: anchor.web3.Connection, ownerAddress: anchor.web3.PublicKey) {
  const allTokens: any = [];
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(ownerAddress, {
      programId: TOKEN_PROGRAM_ID
    });

    for (let index = 0; index < tokenAccounts.value.length; index++) {
      const tokenAccount = tokenAccounts.value[index];
      const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;

      if (tokenAmount.amount == "1" && tokenAmount.decimals == "0") {

        let [pda] = await anchor.web3.PublicKey.findProgramAddress([
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          (new anchor.web3.PublicKey(tokenAccount.account.data.parsed.info.mint)).toBuffer(),
        ], TOKEN_METADATA_PROGRAM_ID);
        const accountInfo: any = await connection.getParsedAccountInfo(pda);

        const metadata: any = new Metadata(ownerAddress.toString(), accountInfo.value);
        const { data }: any = await axios.get(metadata.data.data.uri);
        data.pubkey = tokenAccount.account.data.parsed.info.mint;
        
        const entireData = { ...data, id: Number(data.name.replace( /^\D+/g, '').split(' - ')[0]) };

        if (data.name.includes('COTD')) {
          console.log(entireData);
          allTokens.push({ ...entireData })
        }
      }
      allTokens.sort(function (a: any, b: any) {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      });
    }
  } catch (error) {
    console.log(error);
  }

  return allTokens;
}

const useWalletNfts = () => {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const [nfts, setNfts] = useState<Array<any>>([]);

  useEffect(() => {
    (async () => {
      if (
        !wallet ||
        !wallet.publicKey ||
        !wallet.signAllTransactions ||
        !wallet.signTransaction
      ) {
        return;
      }

      setIsLoading(true);

      const nftsForOwner = await getNftsForOwner(connection, wallet.publicKey);

      setNfts(nftsForOwner as any);
      setIsLoading(false);
    })();
  }, [wallet])

  return {isLoading, nfts};
}

export default useWalletNfts;