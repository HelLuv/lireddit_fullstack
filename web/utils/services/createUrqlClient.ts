import {dedupExchange, fetchExchange} from "urql/core";
import {cacheExchange} from "@urql/exchange-graphcache";
import {
  Current_UserDocument,
  Current_UserQuery,
  User_LoginMutation,
  User_LogoutMutation,
  User_RegisterMutation
} from "../generated/graphql";
import betterUpdateQuery from "./betterUpdateQuery";

const createUrqlClient = (ssrExchange: any) => ({

  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [dedupExchange,
    cacheExchange({
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
          userLogout: (_result, args, cache, info) => {
            betterUpdateQuery<User_LogoutMutation, Current_UserQuery>(
              cache,
              {query: Current_UserDocument},
              _result,
              () => ({currentUser: null}))
          },
        }
      }
    }),
    ssrExchange,
    fetchExchange
  ],
  url: "http://localhost:4000/graphql",
})


export default createUrqlClient;