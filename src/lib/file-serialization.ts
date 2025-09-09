import { SerializableImageRef } from '@/types';

// Generate unique ID for images
const generateImageId = (): string => {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Maximum file size (5MB) to prevent localStorage bloat
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Convert File to serializable format for localStorage
export const fileToSerializable = async (file: File): Promise<SerializableImageRef> => {
  return new Promise((resolve, reject) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`));
      return;
    }

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      reject(new Error(`File type ${file.type} is not supported. Only image files are allowed.`));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const dataUrl = reader.result as string;
        
        resolve({
          id: generateImageId(),
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl,
          uploadedAt: new Date(),
        });
      } catch (error) {
        reject(new Error(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

// Convert multiple files to serializable format
export const filesToSerializable = async (files: File[]): Promise<SerializableImageRef[]> => {
  const results: SerializableImageRef[] = [];
  
  for (const file of files) {
    try {
      const serialized = await fileToSerializable(file);
      results.push(serialized);
    } catch (error) {
      console.error(`Failed to serialize file ${file.name}:`, error);
      // Continue with other files instead of failing completely
    }
  }
  
  return results;
};

// Convert serializable format back to File-like object for UI compatibility
export const serializableToFile = (ref: SerializableImageRef): File => {
  try {
    // Extract the base64 data from the data URL
    const [header, base64Data] = ref.dataUrl.split(',');
    
    if (!base64Data) {
      throw new Error('Invalid data URL format');
    }

    // Convert base64 to binary
    const byteString = atob(base64Data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    
    // Create File object
    const file = new File([arrayBuffer], ref.name, { 
      type: ref.type,
      lastModified: ref.uploadedAt.getTime()
    });
    
    return file;
  } catch (error) {
    console.error('Failed to convert serializable to file:', error);
    // Return a fallback empty file to prevent crashes
    return new File([''], ref.name || 'unknown.png', { type: ref.type || 'image/png' });
  }
};

// Convert multiple serializable references back to Files
export const serializablesToFiles = (refs: SerializableImageRef[]): File[] => {
  return refs.map(ref => serializableToFile(ref));
};

// Validate serializable image reference
export const validateSerializableImageRef = (ref: any): ref is SerializableImageRef => {
  return (
    typeof ref === 'object' &&
    ref !== null &&
    typeof ref.id === 'string' &&
    typeof ref.name === 'string' &&
    typeof ref.size === 'number' &&
    typeof ref.type === 'string' &&
    typeof ref.dataUrl === 'string' &&
    ref.dataUrl.startsWith('data:') &&
    (ref.uploadedAt instanceof Date || typeof ref.uploadedAt === 'string')
  );
};

// Calculate approximate storage size of serializable images
export const calculateImagesStorageSize = (images: SerializableImageRef[]): number => {
  return images.reduce((total, img) => total + img.dataUrl.length, 0);
};

// Get human-readable file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Check if localStorage has enough space (rough estimate)
export const checkStorageQuota = (images: SerializableImageRef[]): { hasSpace: boolean; estimatedSize: string; } => {
  const estimatedSize = calculateImagesStorageSize(images);
  const estimatedSizeFormatted = formatFileSize(estimatedSize);
  
  // localStorage typically has 5-10MB limit, let's be conservative and use 4MB
  const STORAGE_LIMIT = 4 * 1024 * 1024; // 4MB
  
  return {
    hasSpace: estimatedSize < STORAGE_LIMIT,
    estimatedSize: estimatedSizeFormatted
  };
};