import { Box, Text } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Kanban = dynamic(() => import('../components/Kanban'), {
  ssr: false
})

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])
  
  useEffect(() => {
    let ignore = false
    axios.get('/api/orders').then(response => {
      if (!ignore) {
        setIsLoading(false)
        setOrders(response.data.list)
        console.log(response.data.list);
      }
    }).catch(error => {
      setIsLoading(false)
      // setErrorMessage(error.response.data.data)
    })
    return () => {
      ignore = true
    }
  }, [])
  
  return (
    <Box as="div" maxW="container.xl" mx="auto">
      <Text fontSize="2xl">Estado de las órdenes</Text>
      {isLoading ?
        <Text align="center">Cargando tablero de gestión...</Text> :
        <Kanban orders={orders} />
      }
    </Box>
  )
}
