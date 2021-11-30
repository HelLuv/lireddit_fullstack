import type {AppProps} from 'next/app'
import {ChakraProvider} from "@chakra-ui/react";
import * as React from 'react';
import customTheme from './theme';


const MyApp = ({Component, pageProps}: AppProps) => {
  return (
    <ChakraProvider theme={customTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default React.memo(MyApp)
