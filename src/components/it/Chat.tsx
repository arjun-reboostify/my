import React, { useState, useEffect, useRef, useCallback } from 'react';
import { noterFirestore, firebaseTimestamp, noterAuth } from '../../firebase/index';
import { 
  Send, 
  Smile, 
  Trash2,
  Edit2,
  X,
  Plus,
  Users,
  Hash,
  ShieldAlert
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { toast, Toaster } from 'sonner';
import User from '../../firebase/utils/getCurrentUser';

// Admin Configuration
const ADMIN_EMAILS = ['ee@ee.com', 'superadmin@noter.com'];
interface SidebarContentProps {
  groups: Group[];
  selectedGroup: Group | null;
  setSelectedGroup: (group: Group | null) => void;
  currentUser: UserProfile | null;
  isAdmin: boolean;
  createGroup: () => void;
  deleteGroup: (groupId: string) => void;
  deleteAllMessages?: () => void;
  deleteAllGroups?: () => void;
  toggleMobileSidebar?: () => void;
}

// Interfaces
interface Message {
  id?: string;
  text: string;
  senderId: string;
  senderName?: string;
  groupId: string;
  timestamp: any;
  emoji?: string;
  edited?: boolean;
}

interface Group {
  id: string;
  name: string;
  members: string[];
  createdBy: string;
}

interface UserProfile {
 
  uid: string;
  displayName?: string;
  email?: string;
}
type ToggleMobileSidebar = (isOpen: boolean) => void;
const ChatComponent: React.FC = () => {
  // State Management
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const toggleSidebar: ToggleMobileSidebar = (open) => {
    setIsOpen(open);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Authentication and User Management
  useEffect(() => {
    const unsubscribe = noterAuth.onAuthStateChanged(async (user) => {
      if (user) {
        const userProfile: UserProfile = {
      
          uid: user.uid,
          displayName: user.displayName || 'Anonymous',
          email: user.email || ''
        };
        setCurrentUser(userProfile);
        setIsAdmin(ADMIN_EMAILS.includes(userProfile.email || ''));
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch Public Groups
  useEffect(() => {
    const unsubscribe = noterFirestore
      .collection('groups')
      .onSnapshot(
        (snapshot) => {
          const fetchedGroups: Group[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Group));
          setGroups(fetchedGroups);
          
          // Auto-select first group if no group selected
          if (fetchedGroups.length > 0 && !selectedGroup) {
            setSelectedGroup(fetchedGroups[0]);
          }
        },
        (err) => {
          toast.error(`Error loading groups: ${err.message}`);
        }
      );

    return () => unsubscribe();
  }, []);

  // Fetch Public Messages
  useEffect(() => {
    if (!selectedGroup) return;

    const unsubscribe = noterFirestore
      .collection('chats')
      .where('groupId', '==', selectedGroup.id)
      .orderBy('timestamp', 'asc')
      .onSnapshot(
        async (snapshot) => {
          const fetchedMessages: Message[] = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const messageData = doc.data() as Message;
              
              // Fetch sender's display name
              const senderDoc = await noterFirestore
                .collection('users')
                .doc(messageData.senderId)
                .get();
              
              return {
                id: doc.id,
                ...messageData,
                senderName: senderDoc.exists 
                  ? senderDoc.data()?.displayName || 'Anonymous'
                  : 'Anonymous'
              };
            })
          );
          setMessages(fetchedMessages);
        },
        (err) => {
          toast.error(`Error loading messages: ${err.message}`);
        }
      );

    return () => unsubscribe();
  }, [selectedGroup]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send/Edit Message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !selectedGroup) {
      toast.error('Please select a group and log in');
      return;
    }

    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    try {
      if (editingMessage) {
        // Only allow editing own messages or by admin
        if (editingMessage.senderId !== currentUser.uid && !isAdmin) {
          toast.error('You can only edit your own messages');
          return;
        }

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
          groupId: selectedGroup.id,
          email:currentUser.email,
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

  // Delete Message (Admin Only)
  const deleteMessage = async (messageId: string) => {
    if (!isAdmin) {
      toast.error('Only admins can delete messages');
      return;
    }

    try {
      await noterFirestore.collection('chats').doc(messageId).delete();
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  // Create Group
  const createGroup = async () => {
    if (!currentUser) {
      toast.error('Please log in to create a group');
      return;
    }

    const groupName = prompt('Enter group name:');
    if (groupName) {
      try {
        await noterFirestore.collection('groups').add({
          name: groupName,
          members: [currentUser.uid],
          createdBy: currentUser.uid
        });
        toast.success('Group created successfully');
      } catch (err) {
        toast.error('Failed to create group');
      }
    }
  };
  const SidebarContent: React.FC<SidebarContentProps> = ({
    groups,
    selectedGroup,
    setSelectedGroup,
    currentUser,
    isAdmin,
    createGroup,
    deleteGroup,
    deleteAllMessages,
    deleteAllGroups,
    toggleMobileSidebar
  }) => {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Groups</h2>
          <button 
            onClick={createGroup}
            className="text-green-400 hover:text-green-500"
            aria-label="Create group"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
  
        <div className="flex-grow overflow-y-auto space-y-2">
          {groups.map((group) => (
            <div 
              key={group.id}
              className={`
                flex items-center justify-between p-2 rounded-lg cursor-pointer
                ${selectedGroup?.id === group.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                transition-colors duration-200
              `}
              onClick={() => {
                setSelectedGroup(group);
                toggleMobileSidebar?.();
              }}
            >
              <span className="flex-grow">{group.name}</span>
              {isAdmin && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteGroup(group.id);
                  }}
                  className="text-red-400 hover:text-red-600 ml-2"
                  aria-label="Delete group"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
  
        {/* Admin Actions */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center text-red-400 mb-2">
              <ShieldAlert className="mr-2 w-5 h-5" />
              <h3 className="font-semibold">Admin Actions</h3>
            </div>
            <div className="space-y-2">
              {deleteAllMessages && (
                <button 
                  onClick={deleteAllMessages}
                  className="w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg flex items-center justify-center"
                >
                  <Trash2 className="mr-2 w-4 h-4" />
                  Delete All Messages
                </button>
              )}
              {deleteAllGroups && (
                <button 
                  onClick={deleteAllGroups}
                  className="w-full bg-red-800 hover:bg-red-900 text-white p-2 rounded-lg flex items-center justify-center"
                >
                  <Trash2 className="mr-2 w-4 h-4" />
                  Delete All Groups
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  // Delete Group (Admin Only)
  const deleteGroup = async (groupId: string) => {
    if (!isAdmin) {
      toast.error('Only admins can delete groups');
      return;
    }

    try {
      // First, delete all messages in the group
      const messagesBatch = noterFirestore.batch();
      const messagesRef = noterFirestore
        .collection('chats')
        .where('groupId', '==', groupId);

      const messagesSnapshot = await messagesRef.get();
      messagesSnapshot.docs.forEach((doc) => {
        messagesBatch.delete(doc.ref);
      });
      await messagesBatch.commit();

      // Then delete the group
      await noterFirestore.collection('groups').doc(groupId).delete();

      toast.success('Group and its messages deleted');
      
      // If the deleted group was selected, select the first group or null
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(groups.length > 0 ? groups[0] : null);
      }
    } catch (err) {
      toast.error('Failed to delete group');
    }
  };

  // Admin: Delete All Messages in Group
  const deleteAllMessages = async () => {
    if (!isAdmin || !selectedGroup) {
      toast.error('You do not have permission to delete all messages');
      return;
    }

    try {
      const batch = noterFirestore.batch();
      const messagesRef = noterFirestore
        .collection('chats')
        .where('groupId', '==', selectedGroup.id);

      const snapshot = await messagesRef.get();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      toast.success(`All messages in ${selectedGroup.name} deleted`);
    } catch (err) {
      toast.error('Failed to delete all messages');
    }
  };

  // Admin: Delete All Groups
  const deleteAllGroups = async () => {
    if (!isAdmin) {
      toast.error('You do not have permission to delete all groups');
      return;
    }

    try {
      const confirmDelete = window.confirm(
        'Are you sure you want to delete ALL groups? This cannot be undone.'
      );
      
      if (!confirmDelete) return;

      const groupsBatch = noterFirestore.batch();
      const groupsRef = noterFirestore.collection('groups');
      const groupsSnapshot = await groupsRef.get();
      groupsSnapshot.docs.forEach((doc) => {
        groupsBatch.delete(doc.ref);
      });
      await groupsBatch.commit();

      const messagesBatch = noterFirestore.batch();
      const messagesRef = noterFirestore.collection('chats');
      const messagesSnapshot = await messagesRef.get();
      messagesSnapshot.docs.forEach((doc) => {
        messagesBatch.delete(doc.ref);
      });
      await messagesBatch.commit();

      toast.success('All groups and messages deleted');
      setSelectedGroup(null);
      setGroups([]);
      setMessages([]);
    } catch (err) {
      toast.error('Failed to delete all groups');
    }
  };

  // Helper: Linkify URLs
  const linkify = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, (url) => 
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">${url}</a>`
    );
  };

  // Toggle Mobile Sidebar

//click outside to close the sidebar



const toggleMobileSidebar = () => {
  setIsMobileSidebarOpen((prevState) => !prevState);
};

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      setIsMobileSidebarOpen(false);
    }
  };

  if (isMobileSidebarOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  // Cleanup function
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isMobileSidebarOpen]);

  // Render UI
  return (

    <div className="flex  max-h-[90vh] min-w-screen z-[1000] mx-auto bg-yellow-800">
    {/* Mobile Sidebar Toggle */}
    <button
      onClick={toggleMobileSidebar}
      className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 p-2 rounded-full"
    >
      <Users className="text-white w-6 h-6" />
    </button>

    {/* Sidebar - Mobile */}
    <div
      ref={sidebarRef}
      className={`
        fixed inset-y-0 left-0 z-40 w-3/4 bg-gray-800 p-4 border-r border-gray-700 
        transform transition-transform duration-300 ease-in-out
        md:hidden z-[50]
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <SidebarContent
        groups={groups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        currentUser={currentUser}
        isAdmin={isAdmin}
        createGroup={createGroup}
        deleteGroup={deleteGroup}
        deleteAllMessages={deleteAllMessages}
        deleteAllGroups={deleteAllGroups}
        toggleMobileSidebar={toggleMobileSidebar}
      />
    </div>

    {/* Sidebar - Desktop */}
    <div className="hidden md:block w-1/4 bg-gray-800 p-4 border-r border-gray-700">
      <SidebarContent
        groups={groups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        currentUser={currentUser}
        isAdmin={isAdmin}
        createGroup={createGroup}
        deleteGroup={deleteGroup}
        deleteAllMessages={deleteAllMessages}
        deleteAllGroups={deleteAllGroups}
      />
    </div>
 

      {/* Chat Area */}
      <div className="flex flex-col w-full md:w-3/4 text-lg">
      <div className='z-[30] fixed min-w-[100%]'>
        {selectedGroup && (
          <div className="bg-gray-800 p-4 border-b border-gray-700 text-white flex justify-between ">
            <div className="flex items-center">
              <Hash className="mr-2 w-6 h-6" />
              <h1 className="text-xl font-bold">{selectedGroup.name}</h1>
              {isAdmin && (
                <button 
                  onClick={() => deleteGroup(selectedGroup.id)}
                  className="ml-2 text-red-400 hover:text-red-600"
                  aria-label="Delete group"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            {currentUser && (
              <span className="text-sm text-gray-400 ">
                {currentUser.displayName}
              </span>
            )}
          </div>
        )}</div>

        {/* Messages */}
        <div className="flex-grow  overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
           <div 
           key={msg.id} 
           className={`flex items-start gap-3 ${
             msg.senderId === currentUser?.uid 
               ? 'justify-end' 
               : 'justify-start'
           }`}
         >
          
         
              <div className={`
                max-w-[70%] p-3 rounded-lg shadow-md
                ${msg.senderId === currentUser?.uid 
                  ? 'bg-yellow-300 text-black' 
                  : 'bg-gray-100 text-black'
                }
                transition-all duration-300 ease-in-out
                hover:scale-[1.02]
              `}>
                <div className="flex items-center justify-between">
                  <div>
                  <a 
             href={`https://${msg.text}`} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-black font-mono text-lg font-bold"
           >
             {msg.text}
           </a>
                    {msg.edited && (
                      <span className="text-xs text-black ml-2">
                        (edited)
                      </span>
                    )}
                  </div>
                  {(msg.senderId === currentUser?.uid || isAdmin) && (
                    <div className="flex items-center space-x-2 ml-2">
                      {msg.senderId === currentUser?.uid && (
                        <button 
                          onClick={() => {
                            setEditingMessage(msg);
                            setNewMessage(msg.text);
                            messageInputRef.current?.focus();
                          }}
                          className="text-black "
                          aria-label="Edit message"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {isAdmin && (
                          <button 
                            onClick={() => deleteMessage(msg.id!)}
                            className="text-red-300 hover:text-red-400"
                            aria-label="Delete message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-black mt-1">
                    {msg.senderName} • {msg.timestamp?.toDate 
                      ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], 
                        {hour: '2-digit', minute:'2-digit'}) 
                      : 'Just now'}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
  
          {/* Message Input */}
{currentUser && selectedGroup && (
  <form 
    onSubmit={sendMessage} 
    className="bg-gray-800 p-1 flex items-center justify-center gap-1 border-t border-gray-700 fixed bottom-0 left-0 right-0 z-40"
  >
    {isEmojiPickerOpen && (
      <div className="absolute bottom-full left-0 z-50">
        {/* Emoji Picker Component */}
      </div>
    )}



    <input 
    
      ref={messageInputRef}
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder={editingMessage 
        ? "Edit your message..." 
        : `Message #${selectedGroup.name}`
      }
      className="flex-grow text-[5vh] px-0 tracking-tighter text-green-200 font-mono transform scale-y-200  py-3 bg-gray-700 max-w-[87vw] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    
    <div className="flex flex-col items-center gap-4">
  {editingMessage && (
    <button
      type="button"
      onClick={() => {
        setEditingMessage(null);
        setNewMessage('');
      }}
      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
      aria-label="Cancel editing"
    >
      <X className="w-6 h-6" />
    </button>
  )}

  <button
    type="button"
    onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
    className="p-2 hover:bg-gray-700 rounded-full transition-colors"
    aria-label="Open emoji picker"
  >
    <Smile className="text-white w-6 h-6" />
  </button>

  <button
    type="submit"
    className={`${
      editingMessage
        ? 'bg-green-600 hover:bg-green-700'
        : 'bg-blue-600 hover:bg-blue-700'
    } text-white p-2 rounded-full transition-colors`}
  >
    <Send className="w-6 h-6" />
  </button>
</div>

  </form>
)}
        </div>
  
        {/* Emoji Picker */}
        {isEmojiPickerOpen && (
          <div className="fixed bottom-20 left-4 z-50">
            <EmojiPicker 
              onEmojiClick={(emojiObject) => {
                setNewMessage(prev => prev + emojiObject.emoji);
                setIsEmojiPickerOpen(false);
              }} 
            />
          </div>
        )}
  
        {/* Toast Notifications */}
        <Toaster position="top-right" richColors />
      </div>
    );
  };
  
  export default ChatComponent;