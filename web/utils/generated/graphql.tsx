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
  changePassword: UserResponse;
  createPost: Post;
  deletePost: Scalars['Boolean'];
  forgotPassword: UserForgotPasswordResponse;
  updatePost?: Maybe<Post>;
  userLogin: UserResponse;
  userLogout: Scalars['Boolean'];
  userRegister: UserResponse;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Float'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationUpdatePostArgs = {
  id: Scalars['Float'];
  title?: InputMaybe<Scalars['String']>;
};


export type MutationUserLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationUserRegisterArgs = {
  inputs: UsernamePasswordInput;
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
  currentUser?: Maybe<User>;
  hello: Scalars['String'];
  retrieveAllPosts: Array<Post>;
  retrievePostById?: Maybe<Post>;
};


export type QueryRetrievePostByIdArgs = {
  id: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  forgotPassToken: Scalars['String'];
  id: Scalars['Int'];
  updateAt: Scalars['String'];
  username: Scalars['String'];
};

export type UserForgotPasswordResponse = {
  __typename?: 'UserForgotPasswordResponse';
  errors?: Maybe<Array<FieldError>>;
  msg?: Maybe<Scalars['String']>;
  res?: Maybe<Scalars['Boolean']>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularUserFragment = { __typename?: 'User', id: number, username: string };

export type RegularUserResponseFragment = { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string } | null | undefined };

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: { __typename?: 'UserForgotPasswordResponse', res?: boolean | null | undefined, msg?: string | null | undefined, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined } };

export type User_LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type User_LoginMutation = { __typename?: 'Mutation', userLogin: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type User_LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type User_LogoutMutation = { __typename?: 'Mutation', userLogout: boolean };

export type User_RegisterMutationVariables = Exact<{
  inputs: UsernamePasswordInput;
}>;


export type User_RegisterMutation = { __typename?: 'Mutation', userRegister: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string } | null | undefined } };

export type Current_UserQueryVariables = Exact<{ [key: string]: never; }>;


export type Current_UserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', id: number, username: string } | null | undefined };

export type Retrieve_All_PostsQueryVariables = Exact<{ [key: string]: never; }>;


export type Retrieve_All_PostsQuery = { __typename?: 'Query', retrieveAllPosts: Array<{ __typename?: 'Post', id: number, title: string, createdAt: string, updateAt: string }> };

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    errors {
      ...RegularError
    }
    res
    msg
  }
}
    ${RegularErrorFragmentDoc}`;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const User_LoginDocument = gql`
    mutation USER_LOGIN($usernameOrEmail: String!, $password: String!) {
  userLogin(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useUser_LoginMutation() {
  return Urql.useMutation<User_LoginMutation, User_LoginMutationVariables>(User_LoginDocument);
};
export const User_LogoutDocument = gql`
    mutation USER_LOGOUT {
  userLogout
}
    `;

export function useUser_LogoutMutation() {
  return Urql.useMutation<User_LogoutMutation, User_LogoutMutationVariables>(User_LogoutDocument);
};
export const User_RegisterDocument = gql`
    mutation USER_REGISTER($inputs: UsernamePasswordInput!) {
  userRegister(inputs: $inputs) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useUser_RegisterMutation() {
  return Urql.useMutation<User_RegisterMutation, User_RegisterMutationVariables>(User_RegisterDocument);
};
export const Current_UserDocument = gql`
    query CURRENT_USER {
  currentUser {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useCurrent_UserQuery(options: Omit<Urql.UseQueryArgs<Current_UserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<Current_UserQuery>({ query: Current_UserDocument, ...options });
};
export const Retrieve_All_PostsDocument = gql`
    query RETRIEVE_ALL_POSTS {
  retrieveAllPosts {
    id
    title
    createdAt
    updateAt
  }
}
    `;

export function useRetrieve_All_PostsQuery(options: Omit<Urql.UseQueryArgs<Retrieve_All_PostsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<Retrieve_All_PostsQuery>({ query: Retrieve_All_PostsDocument, ...options });
};