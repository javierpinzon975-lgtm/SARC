import { useState, useEffect } from 'react';

export function usePersistentState(key, defaultValue) {
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (e) {
            console.warn(`No fue posible leer "${key}" de localStorage:`, e);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn(`No fue posible guardar "${key}" en localStorage:`, e);
        }
    }, [key, value]);

    return [value, setValue];
}
