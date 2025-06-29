import React from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { useApi } from '../contexts/ApiContext'

const ConnectionStatus: React.FC = () => {
  const { isConnected } = useApi()

  return (
    <div className={`fixed top-4 right-4 z-50 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
      isConnected 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
    }`}>
      {isConnected ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Disconnected</span>
        </>
      )}
    </div>
  )
}

export default ConnectionStatus