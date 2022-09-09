import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Stack, Text, useDisclosure } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { createContext } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const Kanban = dynamic(() => import('../components/Kanban'), {
  ssr: false
})

export const HomeContext = createContext(null)

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [currentCard, setCurrentCard] = useState({})
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { handleSubmit, register } = useForm()

  useEffect(() => {
    let ignore = false
    axios.get('/api/orders').then(response => {
      if (!ignore) {
        setIsLoading(false)
        setOrders(response.data.list)
      }
    }).catch(error => {
      setIsLoading(false)
      // setErrorMessage(error.response.data.data)
    })
    return () => {
      ignore = true
    }
  }, [])

  const value = useMemo(() => ({
    onOpen,
    setCurrentCard
  }), [onOpen, setCurrentCard])

  const onSubmit = (data) => {
    const op = axios.post('/api/orders', data)

    toast.promise(op, {
      loading: 'Actualizando base de datos',
      success: () => {
        onClose()
        return 'Actualizado'
      },
      error: 'Se ha presentado un error'
    })
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{currentCard.orderDescription}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack as="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
              <input
                type="hidden"
                {...register('id', {
                  valueAsNumber: true
                })}
                value={currentCard.id}
              />
              <input
                type="hidden"
                {...register('Orden', {
                  valueAsNumber: true
                })}
                value={currentCard.order}
              />
              <FormControl isReadOnly isDisabled>
                <FormLabel>Orden</FormLabel>
                <Input defaultValue={currentCard.order} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Fecha trasplante</FormLabel>
                <Input
                  type="date"
                  value={currentCard.transplantDate}
                  {...register('Fecha transplante')}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Fecha entrega</FormLabel>
                <Input
                  type="date"
                  value={currentCard.deliveryDate}
                  {...register('Fecha de entrega')}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Cantidad</FormLabel>
                <Input
                  type="number"
                  value={currentCard.qty}
                  {...register('Cantidad', {
                    valueAsNumber: true
                  })}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Estado vivero</FormLabel>
                <Select
                  defaultValue={currentCard.state}
                  {...register('Estado vivero')}
                >
                  {['Trasplantada', 'Creciendo', 'Lista para entrega'].map((value) => (
                    <option value={value} key={value}>{value}</option>
                  ))}
                </Select>
              </FormControl>
              <Button colorScheme='green' mr={3} size="sm" type='submit'>Guardar</Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <HomeContext.Provider value={value}>
        <Box as="div" maxW="container.xl" mx="auto">
          <Text fontSize="2xl">Estado de las órdenes</Text>
          {isLoading ?
            <Text align="center">Cargando tablero de gestión...</Text> :
            <Kanban orders={orders} />
          }
        </Box>
      </HomeContext.Provider>
    </>
  )
}
