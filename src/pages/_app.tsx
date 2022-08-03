import '../styles/global.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider, createEmotionCache } from '@mantine/core';
import { UIEarthContextProvider } from '@/context/ui-earth-context-provider';

const myCache = createEmotionCache({ key: 'mantine', prepend: false });

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'dark',
          fontFamily: "Saira"
        }}
        emotionCache={myCache}
      >
        
        <UIEarthContextProvider>
          <Component {...pageProps} />
        </UIEarthContextProvider>
      </MantineProvider>
    </>
  );
}