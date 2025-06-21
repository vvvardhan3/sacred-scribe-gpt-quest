
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Edit2,
  Clock,
  Loader2
} from 'lucide-react';
import { useConversations } from '@/hooks/useConversations';
import { useConversationMessages } from '@/hooks/useConversationMessages';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ConversationSidebarProps {
  activeConversationId: string | null;
  onConversationSelect: (id: string) => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  activeConversationId,
  onConversationSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  const {
    conversations,
    createNewConversation,
    deleteConversation,
    renameConversation,
    loading: conversationsLoading
  } = useConversations();

  const { loading: messagesLoading } = useConversationMessages(activeConversationId);

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewConversation = async () => {
    const newId = await createNewConversation();
    if (newId) {
      onConversationSelect(newId);
    }
  };

  const handleRename = async (id: string) => {
    if (editTitle.trim()) {
      await renameConversation(id, editTitle.trim());
      setEditingId(null);
      setEditTitle('');
    }
  };

  const startEdit = (conversation: any) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  if (conversationsLoading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading conversations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
          <Button onClick={handleNewConversation} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No conversations yet</p>
            <Button 
              onClick={handleNewConversation} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Start your first conversation
            </Button>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`p-3 cursor-pointer transition-all hover:shadow-sm relative group ${
                  activeConversationId === conversation.id
                    ? 'bg-orange-50 border-orange-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onConversationSelect(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    {editingId === conversation.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleRename(conversation.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(conversation.id);
                          if (e.key === 'Escape') {
                            setEditingId(null);
                            setEditTitle('');
                          }
                        }}
                        className="text-sm font-medium"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conversation.title || 'New Conversation'}
                      </h3>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                    
                    <div className="flex items-center mt-2 text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {conversation.timestamp.toLocaleDateString()}
                    </div>
                  </div>

                  {/* Loading indicator for active conversation */}
                  {activeConversationId === conversation.id && messagesLoading && (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                    </div>
                  )}

                  {/* Action Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(conversation);
                        }}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteConversation(conversation.id);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Active indicator */}
                {activeConversationId === conversation.id && (
                  <div className="absolute left-0 top-0 w-1 h-full bg-orange-500 rounded-r"></div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{conversations.length} conversations</span>
          <Badge variant="secondary" className="text-xs">
            HinduGPT
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default ConversationSidebar;
