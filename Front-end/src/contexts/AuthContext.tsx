import React, { createContext, useContext, useState } from 'react';
import { mockUser } from '@/data/mockData';

// Khai báo kiểu dữ liệu cho Context
interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  
  // Nếu có thông tin user thì nghĩa là đã đăng nhập
  const isAuthenticated = !!user;

  const login = (userData: any) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export hàm useAuth để các trang khác (như Login, Dashboard) có thể gọi
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được bọc bên trong AuthProvider');
  }
  return context;
};