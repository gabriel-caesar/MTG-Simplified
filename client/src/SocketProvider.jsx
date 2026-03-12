import { useContext, useEffect, useState } from 'react';
import { authContext, socketContext } from './contexts/contexts';

export const useSocket = () => {
  const context = useContext(socketContext);
  if (!context) throw new Error(`Context error`);
  return context;
};

export default function SocketProvider({ children }) {

  // Main state for the client socket
  const [socket, setSocket] = useState(null);

  const { user, dispatchUser } = useContext(authContext);

  // State that provides connection feedback
  const [connected, setConnected] = useState(false);

  function registerClient(s) {
    if (!user) return;
    if (s.readyState === 1) {
      const registerMsg = {
        to: null,
        from: user._id,
        type: 'register'
      }
      s.send(JSON.stringify(registerMsg))
    }
  }

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    setSocket(ws);
    
    // Register the client when opening a connection and update the connection status state
    ws.addEventListener('open', () => {
      setConnected(true);
      
    });

    ws.addEventListener('close', () => {
      setConnected(false);
    });

    ws.onmessage = event => {
      const msg = JSON.parse(event.data)
      const recipient = msg.to;
      const sender = msg.from;
      const inviteObject = msg.content;

      let updatedRecipient = null;

      switch (msg.type) {
        case 'friend-invite-accepted':
          // Making sure websockets don't overlap the database update done previously
          const duplicateFriend = recipient.friends.find(f => f._id === sender._id)
          updatedRecipient = {
            ...recipient,
            friends: duplicateFriend
            ? recipient.friends
            : [ ...recipient.friends, sender ],
            // Filter sender's friend invite from recipients object
            friend_invites: recipient.friend_invites.filter(f => f.from !== sender._id)
          }
          dispatchUser({ type: 'assign-user', payload: updatedRecipient })
          break

        case 'friend-invite-sent':
          // Making sure websockets don't overlap the database update done previously
          const duplicateInvite = recipient.friend_invites.find(i => i.from === inviteObject.from)
          updatedRecipient = {
            ...recipient,
            friend_invites: duplicateInvite 
              ? recipient.friend_invites
              : [ ...recipient.friend_invites, inviteObject ]
          }
          dispatchUser({ type: 'assign-user', payload: updatedRecipient })
          break
      }
    }

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, [])

  useEffect(() => {
    if (!socket || !user)
      return

    registerClient(socket)

  }, [user, socket])

  if (!socket) return null

  const value = { socket, connected, setConnected };

  return (
    <socketContext.Provider value={value}>
      { children }
    </socketContext.Provider>
  )
}