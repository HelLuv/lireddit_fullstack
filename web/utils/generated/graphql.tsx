import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  deletePost: Scalars['Boolean'];
  updatePost?: Maybe<Post>;
  userLogin: UserResponse;
  userRegister: UserResponse;
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Float'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['Float'];
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUserLoginArgs = {
  input: UsernamePasswordInput;
};


export type MutationUserRegisterArgs = {
  input: UsernamePasswordInput;
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  title: Scalars['String'];
  updateAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  me?: Maybe<User>;
  retrieveAllPosts: Array<Post>;
  retrievePostById?: Maybe<Post>;
};


export type QueryRetrievePostByIdArgs = {
  id: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  updateAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type User_LoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type User_LoginMutation = { __typename?: 'Mutation', userLogin: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, username: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type User_RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type User_RegisterMutation = { __typename?: 'Mutation', userRegister: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, username: string } | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };


export const User_LoginDocument = gql`
    mutation USER_LOGIN($username: String!, $password: String!) {
  userLogin(input: {username: $username, password: $password}) {
    user {
      id
      username
    }
    errors {
      field
      message
    }
  }
}
    `;

export function useUser_LoginMutation() {
  return Urql.useMutation<User_LoginMutation, User_LoginMutationVariables>(User_LoginDocument);
};
export const User_RegisterDocument = gql`
    mutation USER_REGISTER($username: String!, $password: String!) {
  userRegister(input: {username: $username, password: $password}) {
    user {
      id
      username
    }
    errors {
      field
      message
    }
  }
}
    `;

export function useUser_RegisterMutation() {
  return Urql.useMutation<User_RegisterMutation, User_RegisterMutationVariables>(User_RegisterDocument);
};