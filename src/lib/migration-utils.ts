import { STORAGE_KEYS } from '@/lib/storage/localStorage';
import { Transcript } from '@/types';

interface OldStorageFormat {
  state: {
    transcripts: Transcript[];
  };
  version: number;
}

export const migrateTranscriptData = (): boolean => {
  try {
    // Check if new storage key already has data
    const newData = localStorage.getItem(STORAGE_KEYS.TRANSCRIPTS);
    if (newData) {
      console.log('📄 [Migration] New storage key already has data, skipping migration');
      return false;
    }

    // Check for old storage key
    const oldData = localStorage.getItem(STORAGE_KEYS.RECORDINGS);
    if (!oldData) {
      console.log('📭 [Migration] No old data found to migrate');
      return false;
    }

    console.log('🔄 [Migration] Found old transcript data, starting migration...');

    // Parse old data
    const parsedOldData: OldStorageFormat = JSON.parse(oldData);
    
    if (!parsedOldData.state?.transcripts) {
      console.log('⚠️ [Migration] Old data has no transcripts array');
      return false;
    }

    // Validate and migrate transcripts
    const migratedTranscripts = parsedOldData.state.transcripts.filter((transcript: any) => {
      return (
        typeof transcript.id === 'string' &&
        typeof transcript.title === 'string' &&
        typeof transcript.text === 'string' &&
        typeof transcript.createdAt === 'string' &&
        typeof transcript.updatedAt === 'string'
      );
    });

    console.log(`📦 [Migration] Migrating ${migratedTranscripts.length} transcripts`);

    // Create new storage format
    const newStorageData = {
      state: {
        transcripts: migratedTranscripts,
      },
      version: 0,
    };

    // Save to new storage key
    localStorage.setItem(STORAGE_KEYS.TRANSCRIPTS, JSON.stringify(newStorageData));
    
    // Remove old storage key
    localStorage.removeItem(STORAGE_KEYS.RECORDINGS);
    
    console.log('✅ [Migration] Successfully migrated transcript data to new storage key');
    return true;

  } catch (error) {
    console.error('❌ [Migration] Error during data migration:', error);
    return false;
  }
};

// Run migration on app startup
export const runMigrationIfNeeded = () => {
  if (typeof window !== 'undefined') {
    const migrationAttempted = sessionStorage.getItem('transcript-migration-attempted');
    
    if (!migrationAttempted) {
      const migrated = migrateTranscriptData();
      
      // Mark migration as attempted (successful or not)
      sessionStorage.setItem('transcript-migration-attempted', 'true');
      
      if (migrated) {
        console.log('🎉 [Migration] Data migration completed successfully');
      }
    }
  }
};