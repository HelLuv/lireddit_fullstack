import * as React from 'react';
import {Box, Button, Flex, Link} from "@chakra-ui/react";
import NextLink from 'next/link'
import {useCurrent_UserQuery} from "../../../utils/generated/graphql";

interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{data, fetching}] = useCurrent_UserQuery();
  let body = null;

  // loading
  if (fetching) {

    //user is not logged in
  } else if (!data?.currentUser) {

    body = (
      <>
        <NextLink href={'/login'}>
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href={'/register'}>
          <Link mr={2}>Register</Link>
        </NextLink>
      </>
    )
    // user is logged in
  } else {
    body = (
      <Flex>
        <Box mr={3} fontWeight={600}>{data.currentUser.username}</Box>
        <Button variant={'link'}>Logout</Button>
      </Flex>

    )
  }

  return (
    <Flex
      bg={'linear-gradient(90deg, rgba(0,255,226,0.7763480392156863) 12%, rgba(41,49,196,0.7875525210084033) 65%, rgba(0,255,226,1) 100%)'}
      p={4}>
      <Box ml={"auto"}>
        {body}
      </Box>
    </Flex>
  )
};

export default React.memo(NavBar);