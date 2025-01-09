import { useState } from 'react';

const useLocalStorage = <T>(key: string, initialValue: T)=> {
    // Get value from localStorage or use the initial value
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading localStorage', error);
            return initialValue;
        }
    });

    // Function to update localStorage
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error setting localStorage', error);
        }
    };

    return [storedValue, setValue] as const;
}

export default useLocalStorage;
