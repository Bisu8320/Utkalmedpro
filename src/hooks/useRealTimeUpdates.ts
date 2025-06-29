import { useEffect, useRef, useState } from 'react'
import { API_CONFIG } from '../config/api'

interface UseRealTimeUpdatesOptions {
  endpoint: string
  onMessage?: (data: any) => void
  onError?: (error: Event) => void
  onConnect?: () => void
  onDisconnect?: () => void
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export function useRealTimeUpdates(options: UseRealTimeUpdatesOptions) {
  const {
    endpoint,
    onMessage,
    onError,
    onConnect,
    onDisconnect,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = () => {
    try {
      // Derive WebSocket URL from API_CONFIG.baseURL to ensure consistency
      const apiUrl = new URL(API_CONFIG.baseURL)
      const wsProtocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsBaseUrl = `${wsProtocol}//${apiUrl.host}`
      const wsUrl = endpoint.startsWith('ws') ? endpoint : `${wsBaseUrl}${endpoint}`
      
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setReconnectAttempts(0)
        onConnect?.()
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onMessage?.(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error)
        }
      }

      ws.onclose = () => {
        console.log('WebSocket disconnected')
        setIsConnected(false)
        onDisconnect?.()
        
        // Attempt to reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1)
            connect()
          }, reconnectInterval)
        }
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        onError?.(error)
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Error creating WebSocket connection:', error)
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
  }

  const sendMessage = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [endpoint])

  return {
    isConnected,
    reconnectAttempts,
    sendMessage,
    disconnect,
    reconnect: connect
  }
}