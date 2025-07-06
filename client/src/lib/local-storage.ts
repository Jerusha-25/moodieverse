// Utility functions for local storage operations

export const LocalStorageKeys = {
  USER_PROGRESS: 'moodieverse_user_progress',
  MOOD_ENTRIES: 'moodieverse_mood_entries',
  KINDNESS_MESSAGES: 'moodieverse_kindness_messages',
  ONBOARDING_COMPLETED: 'moodieverse_onboarding_completed',
  CRISIS_SUPPORT_USED: 'moodieverse_crisis_support_used',
} as const;

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue;
  }
}

export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
  }
}

// Privacy-focused data management
export function clearAllUserData(): void {
  Object.values(LocalStorageKeys).forEach(key => {
    removeFromLocalStorage(key);
  });
}

// Export user data for backup/transfer
export function exportUserData(): string {
  const userData: Record<string, any> = {};
  Object.values(LocalStorageKeys).forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      userData[key] = JSON.parse(data);
    }
  });
  return JSON.stringify(userData, null, 2);
}

// Import user data from backup
export function importUserData(dataString: string): boolean {
  try {
    const userData = JSON.parse(dataString);
    Object.entries(userData).forEach(([key, value]) => {
      if (Object.values(LocalStorageKeys).includes(key as any)) {
        saveToLocalStorage(key, value);
      }
    });
    return true;
  } catch (error) {
    console.error(`Error importing user data: ${error}`);
    return false;
  }
}
