'use client';
import React from 'react';
import axios from 'axios';
import { MdEmail } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import styles from '@/app/ui/dashboard/dashboard.module.css';

interface StartChatButtonProps {
  userId: string;
  recipientId: string;
  disabled: boolean;
  className?: string;
}

interface Conversation {
  _id: string;
  members: string[];
}

const StartChatButton: React.FC<StartChatButtonProps> = ({ userId, recipientId, disabled, className }) => {
  const router = useRouter();

  const handleStartChat = async () => {
    if (disabled || !userId || !recipientId) return;

    try {
      const conversationsResponse = await axios.get<Conversation[]>(`http://localhost:3000/conversations/${userId}`);
      const conversations = conversationsResponse.data;

      const existingConversation = conversations.find((conversation) => {
        if (conversation.members.length !== 2) return false; // Ensure exactly two members
      
        const memberSet = new Set(conversation.members);
        return memberSet.has(userId) && memberSet.has(recipientId);
      });

      let conversationId;
      if (existingConversation) {
        conversationId = existingConversation._id;
        console.log(`Existing conversation found: ID=${conversationId}`);
      } else {
        const response = await axios.post('http://localhost:3000/conversations', {
          members: [userId, recipientId],
        });
        conversationId = response.data.conversationId;
        console.log(`New conversation created: ID=${conversationId}`);
      }

      router.push(`/dashboard/inbox?conversationId=${conversationId}`);
    } catch (error) {
      console.error('Error initiating conversation:', error);
    }
  };

  return (
    <button className={className || styles.button} onClick={handleStartChat} disabled={disabled}>
      <MdEmail size={15} className={styles.buttonIcon} /> {disabled ? 'X' : 'Start Chat'}
    </button>
  );
};

export default StartChatButton;
