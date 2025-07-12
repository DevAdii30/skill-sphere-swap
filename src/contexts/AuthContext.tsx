import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  avatar?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  bio?: string;
  rating: number;
  reviewCount: number;
  isPublic: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        location: 'New York, NY',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        skillsOffered: ['React', 'TypeScript', 'Node.js'],
        skillsWanted: ['Python', 'Design', 'Photography'],
        availability: ['Weekends', 'Evenings'],
        bio: 'Full-stack developer passionate about learning new technologies.',
        rating: 4.8,
        reviewCount: 12,
        isPublic: true
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const register = async (userData: Partial<User> & { email: string; password: string }): Promise<boolean> => {
    // Mock registration
    if (userData.email && userData.password.length >= 6) {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name || 'New User',
        email: userData.email,
        location: userData.location,
        avatar: userData.avatar,
        skillsOffered: userData.skillsOffered || [],
        skillsWanted: userData.skillsWanted || [],
        availability: userData.availability || [],
        bio: userData.bio,
        rating: 0,
        reviewCount: 0,
        isPublic: true
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};