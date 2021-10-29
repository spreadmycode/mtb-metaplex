import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apollo/client'
import Head from 'next/head';

import '../styles/index.less';

export default function App({ Component, pageProps }: AppProps) {

  const apolloClient = useApollo(pageProps.initialApolloState);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Metaplex NFT Marketplace</title>
      </Head>
      <div id="root">
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </div>
    </>
  );
}
