import type {AppProps} from 'next/app'
import {ChakraProvider} from "@chakra-ui/react";
import * as React from 'react';
import customTheme from './theme';
import {withUrqlClient} from "next-urql";
import createUrqlClient from "../utils/services/createUrqlClient";


const MyApp = ({Component, pageProps}: AppProps) => {
  return (
    <ChakraProvider theme={customTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

// export default withUrqlClient(createUrqlClient, {ssr: true})(MyApp)
export default withUrqlClient(createUrqlClient)(MyApp) // without ssr
