import type {NextPage} from 'next'
import loadable from '@loadable/component';
import * as React from 'react'

import {useRetrieve_All_PostsQuery} from "../utils/generated/graphql";

const NavBar = loadable(() => import ('./components/NavBar'))
const Index: NextPage = () => {
  const [{data}] = useRetrieve_All_PostsQuery();
  return (
    <>
      <NavBar pageProps={undefined}/>
      <div>
        Sup
      </div>
      <br/>
      {data ? data.retrieveAllPosts.map(post => <div key={post.id}>{post.title}</div>) : null}
    </>
  )
}
export default React.memo(Index);
