import * as React from 'react';
import {Box, Flex, Link} from "@chakra-ui/react";
import NextLink from 'next/link'

interface NavBarProps {

}

const NavBar: React.FC<NavBarProps> = ({}) => {

  return (
    <Flex bg={'rebeccapurple'} p={4}>
      <Box ml={"auto"}>
        <NextLink href={'/login'}>
          <Link color={"white"} mr={2}>Login</Link>
        </NextLink>
        <NextLink href={'/register'}>
          <Link color={"white"} mr={2}>Register</Link>
        </NextLink>
      </Box>
    </Flex>
  )
};

export default React.memo(NavBar);