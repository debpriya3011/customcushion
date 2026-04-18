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
  stock?: number;
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
        .then(res => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(products => {
          if (Array.isArray(products)) {
            setItems(prevItems => {
              let hasChanges = false;
              const syncedItems = prevItems.map(item => {
                if (item.category === 'Non-Customizable') {
                  const dbProduct = products.find(p => p.id === item.id);
                  if (dbProduct) {
                    const latestPrice = dbProduct.sellingPrice || dbProduct.listingPrice || dbProduct.price || 0;
                    const latestStock = dbProduct.stock || 0;
                    if (item.name !== dbProduct.name || item.price !== latestPrice || item.image !== dbProduct.imageUrl || item.stock !== latestStock) {
                      hasChanges = true;
                      return {
                        ...item,
                        name: dbProduct.name,
                        price: latestPrice,
                        image: dbProduct.imageUrl,
                        stock: latestStock,
                        quantity: Math.min(item.quantity, latestStock) // Cap quantity to available stock
                      };
                    }
                  } else {
                    // Product deleted, remove from cart
                    hasChanges = true;
                    return null;
                  }
                }
                return item;
              }).filter(item => item !== null);
              
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
        const newQty = existing.quantity + item.quantity;
        const maxQty = item.stock || 999; // If no stock info, allow high qty
        return prev.map(i => i.id === item.id ? { 
          ...i, 
          quantity: Math.min(newQty, maxQty),
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          stock: item.stock
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
    setItems(prev => prev.map(i => {
      if (i.id === id) {
        const maxQty = i.stock || 999;
        return { ...i, quantity: Math.min(qty, maxQty) };
      }
      return i;
    }));
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
