// import { create } from 'zustand'
// type StockData = {
//   currentPrice: number
//   high: number
//   low: number
// }
// type StockStore = {
//   stocks: Record<string, StockData>
//   connect: () => void
//   disconnect: () => void
// }
// export const useStockStore = create<StockStore>(set => {
//   let socket: WebSocket | null = null
//   return {
//     stocks: {},
//     connect: () => {
//       if (socket) return // Prevent multiple connections
//       socket = new WebSocket('ws://localhost:3001/ws')
//       socket.onopen = () => {
//         console.log('Connected to WebSocket')
//         socket?.send(JSON.stringify({ type: 'subscribe', payload: 'EQUITY' }))
//       }
//       socket.onmessage = event => {
//         try {
//           const message = JSON.parse(event.data)
//           // ✅ Ignore ping messages
//           if (message.type === 'ping') return
//           if (message.type === 'stockUpdate' && message.data) {
//             set({ stocks: message.data })
//           }
//         } catch (error) {
//           console.error('Error parsing WebSocket message:', error)
//         }
//       }
//       socket.onclose = () => {
//         console.log('Disconnected from WebSocket')
//         socket = null
//       }
//     },
//     disconnect: () => {
//       if (socket) {
//         socket.close()
//         socket = null
//       }
//     },
//   }
// })
import { create } from 'zustand'

type StockData = {
  currentPrice: number
  high: number
  low: number
}
type StockStore = {
  stocks: Record<string, StockData>
  connect: () => void
  disconnect: () => void
}
export const useStockStore = create<StockStore>(set => {
  let socket: WebSocket | null = null
  const connect = () => {
    if (socket) return // Prevent multiple connections
    socket = new WebSocket('ws://localhost:3001/ws')
    socket.onopen = () => {
      console.log('Connected to WebSocket')
      socket?.send(JSON.stringify({ type: 'subscribe', payload: 'EQUITY' }))
    }
    socket.onmessage = event => {
      try {
        const message = JSON.parse(event.data)
        // ✅ Ignore "ping" messages
        if (message.type === 'ping') return
        if (message.type === 'stockUpdate' && message.data) {
          console.log('Received stock update:', message.data) // ✅ Debug log
          set({ stocks: message.data })
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
    // socket.onclose = () => {
    //   console.log('Disconnected from WebSocket, attempting to reconnect...')
    //   socket = null
    //   setTimeout(connect, 3000) // ✅ Auto-reconnect after 3 seconds
    // }
  }
  const disconnect = () => {
    if (socket) {
      socket.close()
      socket = null
    }
  }
  return { stocks: {}, connect, disconnect }
})
