import {extendTheme, ThemeConfig} from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const customTheme = extendTheme({config})

export default customTheme