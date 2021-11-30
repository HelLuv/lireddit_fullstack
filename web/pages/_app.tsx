import type {AppProps} from 'next/app'
import {ChakraProvider} from "@chakra-ui/react";
import * as React from 'react';
import customTheme from './theme';
import {Provider, createClient} from 'urql';

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include'
  }
})

const MyApp = ({Component, pageProps}: AppProps) => {
  return (
    <Provider value={client}>
      <ChakraProvider theme={customTheme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default React.memo(MyApp)
