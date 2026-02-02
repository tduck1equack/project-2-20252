"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        if (!accessToken) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return;
        }

        const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002', {
            path: '/socket.io',
            transports: ['websocket'],
            auth: {
                token: accessToken,
            },
        });

        newSocket.on('connect', () => {
            console.log('Socket Connected');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket Disconnected');
            setIsConnected(false);
        });

        newSocket.on('new_order', (data: any) => {
            toast.success(data.message || 'New Order Received!');
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [accessToken]);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}
