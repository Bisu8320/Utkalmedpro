import { WebSocketServer, WebSocket } from 'ws'

let wss: WebSocketServer

const clients = new Set<WebSocket>()

export const setupWebSocket = (websocketServer: WebSocketServer) => {
  wss = websocketServer

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection')
    clients.add(ws)

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message)
        console.log('Received message:', data)
        
        // Handle different message types
        switch (data.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }))
            break
          default:
            console.log('Unknown message type:', data.type)
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    })

    ws.on('close', () => {
      console.log('WebSocket connection closed')
      clients.delete(ws)
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
      clients.delete(ws)
    })

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connected',
      message: 'Connected to Utkal Medpro real-time updates'
    }))
  })
}

export const broadcastUpdate = (data: any) => {
  const message = JSON.stringify(data)
  
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
  
  console.log(`Broadcasted update to ${clients.size} clients:`, data.type)
}

export const getConnectedClients = () => {
  return clients.size
}