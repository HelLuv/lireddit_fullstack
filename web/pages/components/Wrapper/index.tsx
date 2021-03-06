import * as React from 'react';
import {Box} from "@chakra-ui/react";

interface WrapperProps {
  variant?: 'small' | 'regular';
  children?: React.ReactNode;
}

const Wrapper: React.FC<WrapperProps> = ({children, variant = 'regular'}) => {

  return (
    <Box
      mx={'auto'}
      maxW={variant === 'regular' ? '800px' : '400px'}
      w={'100%'}
      mt={10}
    >
      {children}
    </Box>
  )
};

export default React.memo(Wrapper);