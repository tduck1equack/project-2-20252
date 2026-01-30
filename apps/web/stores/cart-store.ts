import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
    productVariantId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    maxQuantity?: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productVariantId: string) => void;
    updateQuantity: (productVariantId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((i) => i.productVariantId === item.productVariantId);

                if (existingItem) {
                    set({
                        items: currentItems.map((i) =>
                            i.productVariantId === item.productVariantId
                                ? { ...i, quantity: i.quantity + item.quantity }
                                : i
                        ),
                    });
                } else {
                    set({ items: [...currentItems, item] });
                }
            },
            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.productVariantId !== id) });
            },
            updateQuantity: (id, quantity) => {
                set({
                    items: get().items.map((i) =>
                        i.productVariantId === id ? { ...i, quantity } : i
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
            totalPrice: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
