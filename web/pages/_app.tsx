import type {AppProps} from 'next/app'
import {ChakraProvider} from "@chakra-ui/react";
import * as React from 'react';
import customTheme from './theme';
import {Provider, createClient, dedupExchange, fetchExchange} from 'urql';
import {cacheExchange, QueryInput, Cache} from '@urql/exchange-graphcache';
import {
  Current_UserDocument,
  Current_UserQuery,
  User_LoginMutation,
  User_RegisterMutation
} from "../utils/generated/graphql";

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  exchanges: [dedupExchange, cacheExchange({
    updates: {
      Mutation: {
        userLogin: (_result, args, cache, info) => {
          betterUpdateQuery<User_LoginMutation, Current_UserQuery>(
            cache,
            {query: Current_UserDocument},
            _result,
            (result, query) => {
              if (result.userLogin.errors) {
                return query
              } else {
                return {
                  currentUser: result.userLogin.user
                }
              }
            })
        },
        userRegister: (_result, args, cache, info) => {
          betterUpdateQuery<User_RegisterMutation, Current_UserQuery>(
            cache,
            {query: Current_UserDocument},
            _result,
            (result, query) => {
              if (result.userRegister.errors) {
                return query
              } else {
                return {
                  currentUser: result.userRegister.user
                }
              }
            })
        },
      }
    }
  }), fetchExchange]
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
