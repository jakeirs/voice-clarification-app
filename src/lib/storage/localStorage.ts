export const STORAGE_KEYS = {
  TRANSCRIPTS: 'voice-transcription-transcripts', // Updated key name
  RECORDINGS: 'voice-clarification-recordings', // Keep for migration
  SETTINGS: 'voice-transcription-settings', // Updated key name  
  USER_PREFERENCES: 'voice-transcription-preferences', // Updated key name
} as const;

export function setItem<T>(key: string, value: T): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function getItem<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  return defaultValue;
}

export function removeItem(key: string): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

export function clearStorage(): void {
  try {
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}