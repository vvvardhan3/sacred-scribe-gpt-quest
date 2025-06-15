
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Plus, Edit2, Trash2, MessageSquare, MoreHorizontal, X, LogOut } from 'lucide-react';
import { Conversation } from '@/hooks/useConversations';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toggleSidebar } = useSidebar();

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

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    return user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';
  };

  return (
    <>
      <Sidebar className="border-r border-gray-200 bg-white w-80">
        <SidebarHeader className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">हिं</span>
              </div>
              <span className="font-semibold text-xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">HinduGPT</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="p-0">
          <div className="p-4">
            <Button 
              onClick={onCreateNew}
              className="w-full justify-start text-left bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-none h-11 rounded-lg"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-3" />
              New chat
            </Button>
          </div>

          <div className="flex-1">
            <ScrollArea className="h-[calc(100vh-240px)]">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="px-4 space-y-1">
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
                              className={`flex-1 justify-start h-10 px-3 rounded-lg text-sm transition-colors ${
                                activeConversationId === conv.id 
                                  ? 'bg-gray-100 text-gray-900' 
                                  : 'text-gray-700 hover:bg-gray-50'
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

          {/* User Profile Section */}
          <div className="border-t border-gray-100 p-4">
            <Popover open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 px-3 hover:bg-gray-50 rounded-lg"
                >
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="bg-gray-100 text-gray-700 text-sm font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {getDisplayName()}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </div>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start" side="top">
                <div className="flex items-center space-x-3 p-2 mb-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gray-100 text-gray-700 font-medium">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {getDisplayName()}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start h-9 px-2 text-gray-700 hover:bg-gray-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
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
