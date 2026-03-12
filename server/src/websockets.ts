import WebSocket, { WebSocketServer } from 'ws';

import type { SocketMessage } from '../lib/types.ts';
import { getUser } from './queries.ts';
import { ObjectId } from 'mongodb';
import { success } from 'zod';

export default function initWebSockets(ws_instance: WebSocketServer) {
  // User clients storage
  const clients = new Map<string, WebSocket>();

  // WebSockets logic
  ws_instance.on('connection', (s: WebSocket) => {
    // Private variable for the current socket connection
    let userId: string | null;

    // On socket close, delete the current client
    s.on('close', () => {
      if (userId) {
        clients.delete(userId);
        console.log(`Disconnected ${userId}`);
      }
    })

    s.on('message', async message => {
      const parsedMsg = JSON.parse(message.toString()) as SocketMessage;
      const clientsArray = Array.from(clients.values());  
      const keysArray = Array.from(clients.keys());  
      
      console.log(`\nParsed Message: ${JSON.stringify(parsedMsg)}\n`)
      let friendClient = null;    
      let inviteResponse = null;
      const senderUser = await getUser({ _id: new ObjectId(parsedMsg.from) })
      const recipientUser = await getUser({ _id: new ObjectId(parsedMsg.to) })

      switch (parsedMsg.type) {
        case 'register':
          userId = parsedMsg.from;
          clients.set(userId, s);
          console.log(`\nConnected clients:\n`)
          keysArray.forEach(c => console.log(c, ','))
          break

        case 'login':
          type SocketResponse = { success: boolean, message?: string };

          let response: SocketResponse | null = null;
          const existent = clients.get(parsedMsg.from); // Check if the user trying to log in is already logged in

          existent
            ? response = { success: false, message: 'User already logged in' }
            : response = { success: true, message: 'No existent session from this user found' };
          

          s.send(JSON.stringify(response));
          break

        case 'accept-friend-invite':
          friendClient = clients.get(parsedMsg.to)

          if (!friendClient)
            throw new Error(`Friend client not found → ${friendClient}`)

          inviteResponse = {
            type: 'friend-invite-accepted',
            to: recipientUser,
            from: senderUser
          }
          friendClient.send(JSON.stringify(inviteResponse))
          break

        case 'send-friend-invite':
          console.log(`${clientsArray.length} CLIENTS CONNECTED`)
          friendClient = clients.get(parsedMsg.to)

          // Meaning the user was offline
          if (!friendClient)
            return s.send(JSON.stringify({ success: true, message: 'User is offline, but invite was sent' }))

          inviteResponse = {
            type: 'friend-invite-sent',
            from: senderUser,
            to: recipientUser,
            content: parsedMsg.content // Friend invite object
          }
          console.log(`\nThis is the inviteResponse: ${JSON.stringify(inviteResponse)}\n`)
          friendClient.send(JSON.stringify(inviteResponse))
          break

        default:
          return         
      }
    })

  })
}

