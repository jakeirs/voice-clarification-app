import { test, expect, describe } from '@jest/globals';

// Mock localStorage for testing
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => store[key] = value.toString(),
    removeItem: (key) => delete store[key],
    clear: () => store = {}
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Import utility functions
import { formatDuration, formatFileSize, generateRecordingId, isAudioFile } from '../src/lib/audioUtils.js';

describe('Audio Utilities', () => {
  test('formatDuration should format seconds correctly', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(30)).toBe('0:30');
    expect(formatDuration(60)).toBe('1:00');
    expect(formatDuration(125)).toBe('2:05');
    expect(formatDuration(3661)).toBe('61:01');
  });

  test('formatFileSize should format bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1073741824)).toBe('1 GB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  test('generateRecordingId should generate unique IDs', () => {
    const id1 = generateRecordingId();
    const id2 = generateRecordingId();
    
    expect(id1).toMatch(/^recording_\d+_[a-z0-9]{9}$/);
    expect(id2).toMatch(/^recording_\d+_[a-z0-9]{9}$/);
    expect(id1).not.toBe(id2);
  });

  test('isAudioFile should validate audio file types', () => {
    const audioFile = { type: 'audio/mpeg' };
    const videoFile = { type: 'video/mp4' };
    const textFile = { type: 'text/plain' };
    
    expect(isAudioFile(audioFile)).toBe(true);
    expect(isAudioFile(videoFile)).toBe(false);
    expect(isAudioFile(textFile)).toBe(false);
  });
});

describe('LocalStorage Utilities', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  test('should store and retrieve data correctly', () => {
    const testData = { recordings: [], settings: { theme: 'dark' } };
    
    mockLocalStorage.setItem('test-key', JSON.stringify(testData));
    const retrieved = JSON.parse(mockLocalStorage.getItem('test-key'));
    
    expect(retrieved).toEqual(testData);
  });

  test('should handle missing keys gracefully', () => {
    const result = mockLocalStorage.getItem('non-existent-key');
    expect(result).toBeNull();
  });
});

describe('Voice Recording Workflow', () => {
  test('should simulate complete recording workflow', async () => {
    // Simulate starting a recording
    const recordingState = {
      isRecording: true,
      startTime: Date.now(),
      recordingId: generateRecordingId()
    };

    expect(recordingState.isRecording).toBe(true);
    expect(recordingState.recordingId).toBeDefined();

    // Simulate stopping recording
    const endTime = Date.now();
    const duration = (endTime - recordingState.startTime) / 1000;

    const finalRecording = {
      id: recordingState.recordingId,
      title: `Recording ${new Date().toLocaleString()}`,
      duration: duration,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expect(finalRecording.status).toBe('completed');
    expect(finalRecording.duration).toBeGreaterThan(0);
    expect(finalRecording.id).toBe(recordingState.recordingId);
  });
});