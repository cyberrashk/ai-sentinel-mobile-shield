
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate' | 'join-room' | 'leave-room';
  roomId: string;
  userId: string;
  data?: any;
}

const connectedClients = new Map<string, WebSocket>();
const rooms = new Map<string, Set<string>>();

serve(async (req) => {
  const upgrade = req.headers.get("upgrade") || "";
  
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  let userId: string | null = null;
  let currentRoom: string | null = null;

  socket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  socket.onmessage = (event) => {
    try {
      const message: SignalingMessage = JSON.parse(event.data);
      
      switch (message.type) {
        case 'join-room':
          userId = message.userId;
          currentRoom = message.roomId;
          
          // Store client connection
          connectedClients.set(userId, socket);
          
          // Add user to room
          if (!rooms.has(currentRoom)) {
            rooms.set(currentRoom, new Set());
          }
          rooms.get(currentRoom)!.add(userId);
          
          // Notify other users in the room
          broadcastToRoom(currentRoom, {
            type: 'user-joined',
            userId: userId,
            roomId: currentRoom
          }, userId);
          
          console.log(`User ${userId} joined room ${currentRoom}`);
          break;

        case 'offer':
        case 'answer':
        case 'ice-candidate':
          // Forward signaling message to specific user
          if (message.data && message.data.targetUserId) {
            const targetSocket = connectedClients.get(message.data.targetUserId);
            if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
              targetSocket.send(JSON.stringify({
                type: message.type,
                fromUserId: userId,
                data: message.data
              }));
            }
          }
          break;

        case 'leave-room':
          if (userId && currentRoom) {
            // Remove user from room
            const room = rooms.get(currentRoom);
            if (room) {
              room.delete(userId);
              if (room.size === 0) {
                rooms.delete(currentRoom);
              }
            }
            
            // Notify other users
            broadcastToRoom(currentRoom, {
              type: 'user-left',
              userId: userId,
              roomId: currentRoom
            }, userId);
            
            console.log(`User ${userId} left room ${currentRoom}`);
          }
          break;
      }
    } catch (error) {
      console.error("Error processing message:", error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format'
      }));
    }
  };

  socket.onclose = () => {
    if (userId) {
      // Clean up user connection
      connectedClients.delete(userId);
      
      if (currentRoom) {
        const room = rooms.get(currentRoom);
        if (room) {
          room.delete(userId);
          if (room.size === 0) {
            rooms.delete(currentRoom);
          } else {
            // Notify other users
            broadcastToRoom(currentRoom, {
              type: 'user-left',
              userId: userId,
              roomId: currentRoom
            }, userId);
          }
        }
      }
    }
    console.log("WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  return response;
});

function broadcastToRoom(roomId: string, message: any, excludeUserId?: string) {
  const room = rooms.get(roomId);
  if (!room) return;

  room.forEach(userId => {
    if (userId !== excludeUserId) {
      const socket = connectedClients.get(userId);
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      }
    }
  });
}
