// Utility to clear potentially incorrect cached prompt content
export const clearPromptCache = () => {
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage);
    const promptCacheKeys = keys.filter(key => key.startsWith('prompt-content-'));
    
    promptCacheKeys.forEach(key => {
      console.log(`🧹 Clearing cached prompt content: ${key}`);
      localStorage.removeItem(key);
    });
    
    if (promptCacheKeys.length > 0) {
      console.log(`✅ Cleared ${promptCacheKeys.length} cached prompt entries`);
    }
  }
};

// Call this once to clear incorrect cache
if (typeof window !== 'undefined') {
  // Only clear cache once per session to avoid performance issues
  const cacheCleared = sessionStorage.getItem('prompt-cache-cleared');
  if (!cacheCleared) {
    clearPromptCache();
    sessionStorage.setItem('prompt-cache-cleared', 'true');
  }
}