'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import styles from '@/app/ui/dashboard/inbox/inbox.module.css';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';

interface Message {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
}

interface Conversation {
  _id: string;
  members: User[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface DecodedToken {
  userId: string;
}

const Messenger: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [newMessage, setNewMessage] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Fetch userId from token
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      setUserId(decodedToken.userId);
      // Initialize Socket.IO connection
      const newSocket = io("ws://localhost:8901");
      setSocket(newSocket);

      // Fetch conversations for the user
      const fetchConversations = async () => {
        try {
          const response = await axios.get<Conversation[]>(`http://localhost:3000/conversations/${decodedToken.userId}`);
          const filteredConversations = response.data.filter(conversation =>
            conversation.members.some(member => member._id === decodedToken.userId)
          );
          setConversations(filteredConversations);
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }
      };

      fetchConversations();

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    // Socket event listeners
    if (!socket) return;

    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('getMessage', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

  }, [socket]);

  // Function to send a message via socket
  const sendMessage = (conversationId: string, sender: string, text: string) => {
    if (socket) {
      socket.emit('sendMessage', { conversationId, sender, text });
    }
  };

  // Fetch messages for a selected conversation
  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await axios.get<Message[]>(`http://localhost:3000/messages/${conversationId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const router = useRouter();

  // Handle conversation selection
  const handleConversationClick = (conversation: Conversation) => {
    if (window.innerWidth <= 768) {
      // Medium screen or smaller, open in new page
      router.push(`/dashboard/inbox/messages?conversationid=${conversation._id}&userid=${userId}`);
    } else {
      // Larger screen, display messages on the same page
      setSelectedConversation(conversation);
      fetchMessages(conversation._id);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedConversation) return;

    try {
      const response = await axios.post<Message>('http://localhost:3000/messages', {
        conversationId: selectedConversation._id,
        sender: userId,
        text: newMessage,
      });

      // Add the sent message to state
      setMessages(prevMessages => [...prevMessages, response.data]);
      setNewMessage('');
      
      // Send the message through socket as well
      sendMessage(selectedConversation._id, userId, newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Get receiver's name from members array
  const getReceiverName = (conversation: Conversation) => {
    const receiver = conversation.members.find(member => member._id !== userId);
    return receiver ? receiver.name : 'Unknown Receiver';
  };

  return (
    <div className={styles.messenger}>
      <header>
        <h1>Messenger</h1>
      </header>
      <section className={styles.messengerContainer}>
        <aside className={styles.conversations}>
          <h2>Conversations</h2>
          <ul>
            {conversations.map((conversation) => (
              <li key={conversation._id} onClick={() => handleConversationClick(conversation)} className={styles.conversationItem}>
                {getReceiverName(conversation)}
                <br />
                <small>ID: {conversation._id}</small>
              </li>
            ))}
          </ul>
        </aside>
        
        <main className={`${styles.messages} ${styles.hideOnMedium}`}>
          <h2>Messages</h2>
          {selectedConversation ? (
            <div>
              <ul className={styles.messageList}>
                {messages.map((message) => (
                  <li key={message._id} className={`${styles.messageItem} ${message.sender === userId ? styles.sentMessage : styles.receivedMessage}`}>
                    <strong>{message.sender === userId ? 'You' : message.sender}:</strong> {message.text}
                    <br />
                    <small>{message.createdAt}</small>
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
          ) : (
            <p className={styles.noConversation}>Select a conversation to view messages</p>
          )}
        </main>
      </section>
    </div>
  );
};

export default Messenger;
