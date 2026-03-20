import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@firebase/auth';
import { FirebaseAuthService } from '../services/FirebaseAuthService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = FirebaseAuthService.subscribeToAuthChanges(
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const signOut = async () => {
    await FirebaseAuthService.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
