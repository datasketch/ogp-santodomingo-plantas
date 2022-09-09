import { ChakraProvider } from '@chakra-ui/react'
import { Toaster } from 'react-hot-toast'
import '../styles/global.css'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Toaster />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
