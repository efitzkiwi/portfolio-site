import '../styles/global.css';

import type { ColorScheme } from '@mantine/core';
import {
  ColorSchemeProvider,
  createEmotionCache,
  MantineProvider,
} from '@mantine/core';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState } from 'react';

import { UIEarthContextProvider } from '@/context/ui-earth-context-provider';

const myCache = createEmotionCache({ key: 'mantine', prepend: false });

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const [colorScheme, setColorScheme] = useState<ColorScheme>('dark');
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            /** Put your mantine theme override here */
            colorScheme,
            fontFamily: 'Saira',
          }}
          emotionCache={myCache}
        >
          <UIEarthContextProvider>
            <Component {...pageProps} />
          </UIEarthContextProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
