import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apollo/client'
import React, { useState, useEffect } from 'react';
import '../styles/index.less';

export default function App({ Component, pageProps }: AppProps) {

  const apolloClient = useApollo(pageProps.initialApolloState);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
        setTimeout(() => setIsLoading(false), 12000);
    })();
  }, []);
  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Child of the Dice</title>
      </Head>
      <div id="root">
        {isLoading &&
          <div className="loading-scene">
              {/* <div className="psoload">
                  <div className="straight"></div>
                  <div className="curve"></div>
                  <div className="center"></div>
                  <div className="inner"></div>
              </div> */}
              <div className="loading-container">
                  <div className="dash uno"></div>
                  <div className="dash dos"></div>
                  <div className="dash tres"></div>
                  <div className="dash cuatro"></div>
              </div>
          </div>
        }
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </div>
    </>
  );
}
