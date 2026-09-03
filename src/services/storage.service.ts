import { createClient } from '@/lib/supabase/server';

export class StorageService {
  private supabase = createClient();
  private bucket = 'receipts';

  async uploadReceipt(file: File, path?: string): Promise<string> {
    const fileName = path || `${Date.now()}-${file.name}`;
    const filePath = `${this.bucket}/${fileName}`;

    const { error } = await this.supabase.storage
      .from(this.bucket)
      .upload(filePath, file);

    if (error) throw new Error(`Failed to upload receipt: ${error.message}`);

    const { data } = this.supabase.storage
      .from(this.bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async deleteReceipt(filePath: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.bucket)
      .remove([filePath]);

    if (error) throw new Error(`Failed to delete receipt: ${error.message}`);
  }

  async uploadMultiple(files: File[], bucket = 'receipts'): Promise<string[]> {
    const urls = [];
    for (const file of files) {
      const url = await this.uploadReceipt(file, `${bucket}/${file.name}`);
      urls.push(url);
    }
    return urls;
  }
}
