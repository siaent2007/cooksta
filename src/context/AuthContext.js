import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveData, loadData, KEYS } from '../utils/storage';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData(KEYS.USER).then((saved) => {
      if (saved) setUser(saved);
      setLoading(false);
    });
  }, []);

  const register = async (name, email, password) => {
    const newUser = { name, email, password };
    await saveData(KEYS.USER, newUser);
    setUser(newUser);
  };

  const login = async (email, password) => {
    const saved = await loadData(KEYS.USER);
    if (!saved) throw new Error('No account found. Please register first.');
    if (saved.email !== email) throw new Error('Incorrect email address.');
    if (saved.password !== password) throw new Error('Incorrect password.');
    setUser(saved);
  };

  const logout = async () => setUser(null);

  const updateName = async (name) => {
    const updated = { ...user, name };
    await saveData(KEYS.USER, updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateName }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
