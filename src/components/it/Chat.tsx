import React, { useState, useEffect, useRef, useCallback } from 'react';
import { noterFirestore, firebaseTimestamp } from '../../firebase/index';
import getCurrentUser from '../../firebase/utils/getCurrentUser'
import { 
  Send, 
  Smile, 
  Trash2,
  Edit2,
  X 
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { toast, Toaster } from 'sonner';
import Side from './Sidebar'

interface Message {
  id?: string;
  text: string;
  senderId: string;
  timestamp: any;
  emoji?: string;
  edited?: boolean;
}

const ChatComponent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Firebase listener for real-time messages
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error('Please log in to view messages');
      return;
    }

    const unsubscribe = noterFirestore
      .collection('chats')
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        (snapshot) => {
          const fetchedMessages: Message[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Message));
          setMessages(fetchedMessages);
        },
        (err) => {
          toast.error(`Error loading messages: ${err.message}`);
        }
      );

    return () => unsubscribe();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error('Please log in to send messages');
      return;
    }

    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    try {
      if (editingMessage) {
        // Update existing message
        await noterFirestore.collection('chats').doc(editingMessage.id).update({
          text: trimmedMessage,
          edited: true
        });
        toast.success('Message updated successfully');
        setEditingMessage(null);
      } else {
        // Send new message
        await noterFirestore.collection('chats').add({
          text: trimmedMessage,
          senderId: currentUser.uid,
          timestamp: firebaseTimestamp()
        });
        toast.success('Message sent');
      }

      // Reset states
      setNewMessage('');
      setIsEmojiPickerOpen(false);
    } catch (err) {
      toast.error('Failed to send/edit message');
    }
  };

  const deleteMessage = async (messageId: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
      await noterFirestore.collection('chats').doc(messageId).delete();
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const startEditing = useCallback((message: Message) => {
    setEditingMessage(message);
    setNewMessage(message.text);
    messageInputRef.current?.focus();
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingMessage(null);
    setNewMessage('');
  }, []);

  const handleEmojiClick = (emojiObject: any) => {
    setNewMessage(prev => prev + emojiObject.emoji);
    setIsEmojiPickerOpen(false);
  };
  const linkify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => 
      `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
  };
  return (<>
    <div className="flex flex-col h-screen max-w-full md:max-w-2xl lg:max-w-4xl mx-auto bg-gray-900">
    <Side />
      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-3 ${
              msg.senderId === getCurrentUser()?.uid 
                ? 'justify-end' 
                : 'justify-start'
            }`}
          >
            <div className={`
              max-w-[70%] p-3 rounded-lg shadow-md
              ${msg.senderId === getCurrentUser()?.uid 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-white'
              }
              transition-all duration-300 ease-in-out
              hover:scale-[1.02]
            `}>
              <div className="flex items-center justify-between">
                <div>
                <div dangerouslySetInnerHTML={{ __html: linkify(msg.text) }} />
                  {msg.edited && (
                    <span className="text-xs text-gray-300 ml-2">(edited)</span>
                  )}
                </div>
                {msg.senderId === getCurrentUser()?.uid && (
                  <div className="flex items-center space-x-2 ml-2">
                    <button 
                      onClick={() => startEditing(msg)}
                      className="text-white hover:text-gray-200"
                      aria-label="Edit message"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteMessage(msg.id!)}
                      className="text-red-300 hover:text-red-400"
                      aria-label="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-300 mt-1">
                {msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      

      {/* Message Input */}
      <form 
        onSubmit={sendMessage} 
        className="bg-gray-800 p-4 flex items-center gap-2 border-t border-gray-700"
      >
        <button 
          type="button"
          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
          className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          aria-label="Open emoji picker"
        >
          <Smile className="text-white w-6 h-6" />
        </button>

        <input 
          ref={messageInputRef}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={editingMessage ? "Edit your message..." : "Type a message..."}
          className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {editingMessage ? (
          <button 
            type="button"
            onClick={cancelEditing}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
            aria-label="Cancel editing"
          >
            <X className="w-6 h-6" />
          </button>
        ) : null}

        <button 
          type="submit" 
          className={`
            ${editingMessage 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
            } 
            text-white p-2 rounded-full transition-colors
          `}
        >
          <Send className="w-6 h-6" />
        </button>
      </form>
      </div>
      {/* Emoji Picker */}
      {isEmojiPickerOpen && (
        <div className="fixed bottom-20 left-4 z-50">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
    </>
  );
};

export default ChatComponent;