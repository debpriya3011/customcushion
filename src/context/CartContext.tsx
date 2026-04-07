'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  customOptions?: Record<string, string>;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage and auto-sync latest database values
  useEffect(() => {
    const stored = localStorage.getItem('cg_cart');
    let initialItems: CartItem[] = [];
    if (stored) {
      try { 
        initialItems = JSON.parse(stored);
        setItems(initialItems);
      } catch {}
    }

    // Auto-sync Non-Customizable products with the database to catch subsequent admin changes (price, name, etc.)
    if (initialItems.length > 0) {
      fetch('/api/products')
        .then(res => res.json())
        .then(products => {
          if (Array.isArray(products)) {
            setItems(prevItems => {
              let hasChanges = false;
              const syncedItems = prevItems.map(item => {
                if (item.category === 'Non-Customizable') {
                  const dbProduct = products.find(p => p.id === item.id);
                  if (dbProduct) {
                    const latestPrice = dbProduct.sellingPrice || dbProduct.listingPrice || dbProduct.price || 0;
                    if (item.name !== dbProduct.name || item.price !== latestPrice || item.image !== dbProduct.imageUrl) {
                      hasChanges = true;
                      return {
                        ...item,
                        name: dbProduct.name,
                        price: latestPrice,
                        image: dbProduct.imageUrl
                      };
                    }
                  } else {
                    // Item was deleted from the database! We could optionally remove it, but letting the user keep it or removing it is a design choice.
                    // For now, if we wanted to remove it: return null; 
                    // To keep it simple and safe, we won't auto-delete without telling them, or we could!
                  }
                }
                return item;
              });
              
              return hasChanges ? syncedItems : prevItems;
            });
          }
        })
        .catch(console.error);
    }
  }, []);

  const { user } = useAuth();
  const mounted = useRef(false);

  // Persist to localStorage and DB
  useEffect(() => {
    localStorage.setItem('cg_cart', JSON.stringify(items));
    if (mounted.current && user) {
      // Sync with server if logged in
      fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items)
      }).catch(console.error);
    }
    mounted.current = true;
  }, [items, user]);

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { 
          ...i, 
          quantity: i.quantity + item.quantity,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category
        } : i);
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
