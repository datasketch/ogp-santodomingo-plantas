import Board from '@asseinfo/react-kanban'
import PropTypes from 'prop-types'
import '@asseinfo/react-kanban/dist/styles.css'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useState } from 'react'
import OrderCard from './OrderCard'

function mapOrderToCard(list) {
  return list.map(item => {
    return {
      id: item.id,
      qty: item.Cantidad,
      order: item.Orden,
      orderDescription: `${item["Fecha de entrega"].substr(0, 4)}-${item.plantas.Planta}-#${item.Orden}`,
      transplantDate: item['Fecha transplante'],
      deliveryDate: item['Fecha de entrega']
    }
  })
}

function Kanban ({ orders }) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleCardDragEnd = async (board, card, source, destination) => {
    const { fromColumnId } = source
    const { toColumnId } = destination
    const body = { 'Estado vivero': '' }
    if (fromColumnId === toColumnId) return

    setIsUpdating(true)

    switch (toColumnId) {
      case 2:
        body['Estado vivero'] = 'Trasplantada'
        break
      case 3:
        body['Estado vivero'] = 'Creciendo'
        break
      case 4:
        body['Estado vivero'] = 'Lista para entrega'
        break
      default:
        body['Estado vivero'] = null
        break
    }

    const op = axios.post('/api/orders', {
      id: card.id,
      ...body
    })

    toast.promise(op, {
      loading: 'Actualizando base de datos',
      success: () => {
        setIsUpdating(false)
        return 'Actualizado'
      },
      error: 'Se ha presentado un error'
    })
  }

  const getCardsWithState = (state) => {
    return mapOrderToCard(orders.filter(order => order['Estado vivero'] === state))
  }

  const board = {
    columns: [
      {
        id: 1,
        title: 'Vivero',
        cards: mapOrderToCard(orders.filter(order => !order['Estado vivero']))
      },
      {
        id: 2,
        title: 'Trasplantada',
        cards: getCardsWithState('Trasplantada')
      },
      {
        id: 3,
        title: 'Creciendo',
        cards: getCardsWithState('Creciendo')
      },
      {
        id: 4,
        title: 'Lista para entrega',
        cards: getCardsWithState('Lista para entrega')
      }
    ]
  }
  return (
    <Board
      initialBoard={board}
      onCardDragEnd={handleCardDragEnd}
      allowAddCard={false}
      disableCardDrag={isUpdating}
      renderCard={(card, { dragging }) => (
        <OrderCard card={card} dragging={dragging} />
      )}
      disableColumnDrag
    />
  )
}

Kanban.propTypes = {
  orders: PropTypes.array
}

export default Kanban
