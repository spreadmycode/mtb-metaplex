import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios from 'axios';
import { Metadata } from '../libs/metaplex/index.esm';
import { OWNER_WALLET } from '../constants';
import { toPublicKey, useConnection } from '@oyster/common';
import { Connection, PublicKey } from '@solana/web3.js';

const TOKEN_METADATA_PROGRAM_ID = toPublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
);

export async function getNftsForOwner(
  connection: Connection,
  ownerAddress: PublicKey,
) {
  const allTokens: any = [];
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
    ownerAddress,
    {
      programId: TOKEN_PROGRAM_ID,
    },
  );

  for (let index = 0; index < tokenAccounts.value.length; index++) {
    const tokenAccount = tokenAccounts.value[index];
    const tokenAmount = tokenAccount.account.data.parsed.info.tokenAmount;

    if (tokenAmount.amount == '1' && tokenAmount.decimals == '0') {
      const [pda] = await PublicKey.findProgramAddress(
        [
          Buffer.from('metadata'),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          new PublicKey(tokenAccount.account.data.parsed.info.mint).toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID,
      );
      const accountInfo: any = await connection.getParsedAccountInfo(pda);

      const metadata: any = new Metadata(
        ownerAddress.toString(),
        accountInfo.value,
      );
      const { data }: any = await axios.get(metadata.data.data.uri);
      console.log(data);
      const entireData = {
        ...data,
        id: Number(data.name.replace(/^\D+/g, '').split(' - ')[0]),
      };

      allTokens.push({ ...entireData });
    }
    allTokens.sort(function (a: any, b: any) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  return allTokens;
}

const useWalletNfts = () => {
  const wallet = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const connection = useConnection();

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

      const ownerWalletPubKey = new PublicKey(OWNER_WALLET);
      const nftsForOwner = await getNftsForOwner(connection, ownerWalletPubKey);

      setNfts(nftsForOwner as any);

      setIsLoading(false);
    })();
  }, [wallet]);

  return [isLoading, nfts];
};

export default useWalletNfts;
