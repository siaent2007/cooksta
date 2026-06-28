import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveData, loadData, removeData, KEYS } from '../utils/storage';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const saved = await loadData(KEYS.USER);
        if (mounted && saved) setUser(saved);
      } catch (err) {
        // Corrupted/unavailable storage shouldn't crash startup — log and continue.
        console.warn('Failed to load saved user:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
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

  const logout = async () => {
    try {
      await removeData(KEYS.USER);
    } catch (err) {
      console.warn('Failed to clear stored user:', err);
    }
    setUser(null);
  };

  const updateName = async (name) => {
    const updated = { ...user, name };
    setUser(updated);
    try {
      await saveData(KEYS.USER, updated);
    } catch (err) {
      console.warn('Failed to persist updated name:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateName }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
