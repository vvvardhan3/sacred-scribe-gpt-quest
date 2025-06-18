
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, Bell, CreditCard, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
              <img src="/icon.png" alt="HinduGPT Logo" className="w-16 h-16 rounded-full" />
          </div>
          
          {user && (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-orange-600 hover:bg-orange-50">
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border border-gray-200 shadow-lg" align="end">
                  <DropdownMenuLabel className="text-gray-700">Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem className="hover:bg-orange-50 cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/notifications">
                    <DropdownMenuItem className="hover:bg-orange-50 cursor-pointer">
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/billing">
                    <DropdownMenuItem className="hover:bg-orange-50 cursor-pointer">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Billing
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="hover:bg-red-50 cursor-pointer text-red-600 hover:text-red-700"
                    onClick={signOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
