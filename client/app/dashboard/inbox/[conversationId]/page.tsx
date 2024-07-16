'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import io from 'socket.io-client';
import styles from '@/app/ui/dashboard/inbox/inbox.module.css';

interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

const ConversationPage: React.FC = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userid');
  const conversationId = searchParams.get('conversationid');

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8901');

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      if (userId) {
        newSocket.emit('addUser', userId);
      }
    });

    newSocket.on('getMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (userId && conversationId) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get<Message[]>(`http://localhost:3000/messages/${conversationId}`);
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [conversationId, userId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      const response = await axios.post('http://localhost:3000/messages', {
        conversationId,
        sender: userId,
        text: newMessage,
      });

      socket?.emit('sendMessage', {
        senderId: userId,
        receiverId: conversationId, // Assuming conversationId can be used to identify the receiver
        text: newMessage,
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className={styles.messages}>
      <h2>Messages</h2>
      <ul className={styles.messageList}>
        {messages.map((message) => (
          <li key={message._id} className={styles.messageItem}>
            <strong>{message.sender === userId ? 'You' : message.sender}:</strong> {message.text}
            <br />
            <small>{new Date(message.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage} className={styles.messageForm}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
          required
          className={styles.messageInput}
        />
        <button type="submit" className={styles.sendButton}>Send</button>
      </form>
    </div>
  );
};

export default ConversationPage;