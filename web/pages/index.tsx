import type {NextPage} from 'next'
import * as React from 'react'
import NavBar from './components/NavBar'

const Index: NextPage = () => {
  return (
    <>
      <NavBar/>
      <div>
        Sup
      </div>
    </>
  )
}

export default React.memo(Index)
