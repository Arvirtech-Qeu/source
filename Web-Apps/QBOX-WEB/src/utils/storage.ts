// storage.ts

// Save data to localStorage
export const saveToLocalStorage = (key: string, data: any): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
};

// Retrieve data from localStorage
export const getFromLocalStorage = (key: string): any => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to retrieve from localStorage:', error);
        return null;
    }
};

// Remove data from localStorage
export const removeFromLocalStorage = (key: string): void => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Failed to remove from localStorage:', error);
    }
};

// Save data to sessionStorage
export const saveToSessionStorage = (key: string, data: any): void => {
    try {
        sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save to sessionStorage:', error);
    }
};

// Retrieve data from sessionStorage
export const getFromSessionStorage = (key: string): any => {
    try {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Failed to retrieve from sessionStorage:', error);
        return null;
    }
};
