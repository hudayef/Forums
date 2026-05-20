import { createClient } from '@supabase/supabase-js';

// We initialize the client if environment variables are present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseClient = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export class RealtimeService {
  /**
   * Mock / Wrapper for broadcasting a notification payload.
   * In a true Supabase configuration, the client listening to the 'Notification'
   * table using `channel.on('postgres_changes')` would naturally pick up
   * the database insert without a manual broadcast layer.
   * However, we keep this service to abstract manual broadcast channels if needed.
   */
  static broadcastNotification(userId: string, payload: { id: string; title: string; message: string; linkUrl: string | null; type: string }) {
    if (!supabaseClient) {
      console.warn('[Realtime Mock] Supabase client not initialized. Cannot broadcast:', payload.title);
      return;
    }

    // Example of broadcasting via Supabase Channels (if needed instead of DB changes listener)
    supabaseClient
      .channel(`user-${userId}`)
      .send({
        type: 'broadcast',
        event: 'new-notification',
        payload,
      });
  }
}
