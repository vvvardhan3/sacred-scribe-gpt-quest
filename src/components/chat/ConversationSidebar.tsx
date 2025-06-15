
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Plus, Edit2, Trash2, MessageSquare, MoreHorizontal, Search, Library, Bot } from 'lucide-react';
import { Conversation } from '@/hooks/useConversations';

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onCreateNew: () => void;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateNew,
  onRename,
  onDelete
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const startEdit = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
    setOpenPopoverId(null);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setOpenPopoverId(null);
  };

  return (
    <>
      <Sidebar className="border-r border-gray-200 bg-gray-50 w-64">
        <SidebarHeader className="p-3 border-b border-gray-200">
          <Button 
            onClick={onCreateNew}
            className="w-full justify-start text-left bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 shadow-none h-10"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-3" />
            New chat
          </Button>
        </SidebarHeader>
        
        <SidebarContent className="p-0">
          <div className="p-3 space-y-1">
            <SidebarMenuButton className="w-full justify-start h-10 px-3 text-gray-700 hover:bg-gray-200 rounded-lg">
              <Search className="h-4 w-4 mr-3" />
              Search chats
            </SidebarMenuButton>
            <SidebarMenuButton className="w-full justify-start h-10 px-3 text-gray-700 hover:bg-gray-200 rounded-lg">
              <Library className="h-4 w-4 mr-3" />
              Library
            </SidebarMenuButton>
          </div>

          <div className="border-t border-gray-200 pt-3">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Chats</h3>
            </div>
            
            <ScrollArea className="h-[calc(100vh-200px)]">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="px-3 space-y-1">
                    {conversations.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No conversations yet</p>
                      </div>
                    ) : (
                      conversations.map((conv) => (
                        <SidebarMenuItem key={conv.id}>
                          <div className="relative flex items-center w-full group">
                            <SidebarMenuButton
                              isActive={activeConversationId === conv.id}
                              onClick={() => onSelectConversation(conv.id)}
                              className={`flex-1 justify-start h-10 px-3 rounded-lg text-sm font-medium transition-colors ${
                                activeConversationId === conv.id 
                                  ? 'bg-gray-200 text-gray-900' 
                                  : 'text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <div className="flex-1 min-w-0 text-left">
                                {editingId === conv.id ? (
                                  <Input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onBlur={saveEdit}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') saveEdit();
                                      if (e.key === 'Escape') cancelEdit();
                                    }}
                                    className="h-8 text-sm bg-white border-gray-300"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  <span className="truncate block">{conv.title}</span>
                                )}
                              </div>
                            </SidebarMenuButton>
                            
                            {editingId !== conv.id && (
                              <Popover 
                                open={openPopoverId === conv.id} 
                                onOpenChange={(open) => setOpenPopoverId(open ? conv.id : null)}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-32 p-1" align="end">
                                  <div className="flex flex-col">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="justify-start h-8 px-2"
                                      onClick={() => startEdit(conv)}
                                    >
                                      <Edit2 className="h-3 w-3 mr-2" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="justify-start h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleDelete(conv.id)}
                                    >
                                      <Trash2 className="h-3 w-3 mr-2" />
                                      Delete
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </SidebarMenuItem>
                      ))
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </ScrollArea>
          </div>
        </SidebarContent>
      </Sidebar>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ConversationSidebar;
