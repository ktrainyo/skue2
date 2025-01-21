import { createClient } from '@supabase/supabase-js';

export class DatabaseCore {
  private supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  async upsert(table: string, data: any, conflict?: string) {
    const { error } = await this.supabase
      .from(table)
      .upsert(data, { onConflict: conflict });

    if (error) throw new Error(error.message);
  }

  // ...other database methods (select, update, delete)...
}
