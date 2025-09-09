'use client';

import { useEffect } from 'react';

export function BodyAttributeHandler() {
  useEffect(() => {
    // This runs after React hydration completes
    const body = document.body;
    
    // Log current body attributes for debugging
    const currentAttributes = Array.from(body.attributes).map(attr => `${attr.name}="${attr.value}"`);
    console.log('🔍 [Body Handler] Body attributes after hydration:', currentAttributes);
    
    // List of known extension attributes that can cause hydration mismatches
    const extensionAttributes = [
      'cz-shortcut-listen',    // Password managers (e.g., 1Password, LastPass)
      'data-new-gr-c-s-check-loaded', // Grammarly
      'data-gr-ext-installed', // Grammarly  
      'spellcheck',            // Various spell checkers
      'data-lt-installed',     // LanguageTool
      'data-grammarly-extension-installed', // Grammarly variants
    ];
    
    let cleanedCount = 0;
    
    // Remove extension attributes that cause hydration issues
    extensionAttributes.forEach(attr => {
      if (body.hasAttribute(attr)) {
        console.log(`🧹 [Body Handler] Removing extension attribute: ${attr}="${body.getAttribute(attr)}"`);
        body.removeAttribute(attr);
        cleanedCount++;
      }
    });
    
    // Mark that our cleanup has run
    body.setAttribute('data-hydration-handled', 'true');
    
    if (cleanedCount > 0) {
      console.log(`✅ [Body Handler] Cleaned ${cleanedCount} extension attributes to prevent hydration mismatches`);
    } else {
      console.log('✨ [Body Handler] No problematic extension attributes found');
    }
    
    // Optional: Monitor for future attribute changes by extensions
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.target === body) {
          const attrName = mutation.attributeName;
          if (attrName && extensionAttributes.includes(attrName)) {
            console.log(`⚠️ [Body Handler] Extension re-added attribute: ${attrName}, removing again...`);
            body.removeAttribute(attrName);
          }
        }
      });
    });
    
    // Observe body attribute changes
    observer.observe(body, {
      attributes: true,
      attributeFilter: extensionAttributes,
    });
    
    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
      console.log('🔄 [Body Handler] Attribute monitoring stopped');
    };
    
  }, []); // Run once after component mounts
  
  return null; // This component doesn't render anything
}