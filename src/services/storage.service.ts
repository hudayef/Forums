/**
 * Storage Service Mock
 * Represents Supabase Storage / AWS S3
 */
export class StorageService {
  /**
   * Mocks uploading a file to cloud storage
   * Returns a fake public URL.
   */
  static async uploadFile(file: File, bucket: string = "notes"): Promise<string> {
    console.log(`[Storage Mock] Uploading ${file.name} to bucket ${bucket}...`);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate a fake url based on timestamp and file name
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '-');
    return `https://mock-storage.campusconnect.local/${bucket}/${timestamp}-${safeName}`;
  }
}
