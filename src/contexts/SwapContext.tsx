import React, { createContext, useContext, useState } from 'react';

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  fromUserAvatar?: string;
  toUserAvatar?: string;
  skillOffered: string;
  skillRequested: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}

interface SwapContextType {
  swapRequests: SwapRequest[];
  sendSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateSwapStatus: (requestId: string, status: SwapRequest['status']) => void;
  deleteSwapRequest: (requestId: string) => void;
  getUserSwapRequests: (userId: string) => { sent: SwapRequest[]; received: SwapRequest[] };
}

const SwapContext = createContext<SwapContextType | undefined>(undefined);

export const useSwap = () => {
  const context = useContext(SwapContext);
  if (context === undefined) {
    throw new Error('useSwap must be used within a SwapProvider');
  }
  return context;
};

export const SwapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);

  const sendSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: SwapRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date()
    };
    setSwapRequests(prev => [...prev, newRequest]);
  };

  const updateSwapStatus = (requestId: string, status: SwapRequest['status']) => {
    setSwapRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              status,
              ...(status === 'completed' && { completedAt: new Date() })
            }
          : request
      )
    );
  };

  const deleteSwapRequest = (requestId: string) => {
    setSwapRequests(prev => prev.filter(request => request.id !== requestId));
  };

  const getUserSwapRequests = (userId: string) => {
    const sent = swapRequests.filter(request => request.fromUserId === userId);
    const received = swapRequests.filter(request => request.toUserId === userId);
    return { sent, received };
  };

  return (
    <SwapContext.Provider
      value={{
        swapRequests,
        sendSwapRequest,
        updateSwapStatus,
        deleteSwapRequest,
        getUserSwapRequests
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};