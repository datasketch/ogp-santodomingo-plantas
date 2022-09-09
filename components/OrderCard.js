import { Box, Stack, Text } from "@chakra-ui/react"
import classNames from 'classnames'

function OrderCard({ card, dragging }) {
  return (
    <Box className={classNames('react-kanban-card', {
      'react-kanban-card--dragging': dragging
    })}>
      <Text className='react-kanban-card__title'>
        {card.orderDescription}
      </Text>
      <Stack className='react-kanban-card__description' spacing={2}>
        <Box>
          <Text fontSize="xs" color="gray">Orden</Text>
          <p>{card.order}</p>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray">Fecha transplate</Text>
          <p>{card.transplantDate}</p>
        </Box>
        <Box>
          <Text fontSize="xs" color="gray">Fecha entrega</Text>
          <p>{card.deliveryDate}</p>
        </Box>
      </Stack>
    </Box>
  )
}

export default OrderCard