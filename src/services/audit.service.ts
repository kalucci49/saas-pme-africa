import { createClient } from '@/lib/supabase/server';
import { AuditLog } from '@/types';

export class AuditService {
  private supabase = createClient();

  async log(data: {
    action: AuditLog['action'];
    entity_type: string;
    entity_id: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    const { data: user } = await this.supabase.auth.getUser();
    
    const { error } = await this.supabase.from('audit_logs').insert({
      organization_id: await this.getCurrentOrgId(),
      user_id: user.user?.id,
      action: data.action,
      entity_type: data.entity_type,
      entity_id: data.entity_id,
      metadata: data.metadata || {}
    });

    if (error) {
      console.error('Failed to log audit entry:', error);
    }
  }

  async getLogs(entityType?: string, entityId?: string): Promise<AuditLog[]> {
    let query = this.supabase
      .from('audit_logs')
      .select('*, user:profiles(full_name, avatar_url)')
      .order('created_at', { ascending: false })
      .limit(100);

    if (entityType) query = query.eq('entity_type', entityType);
    if (entityId) query = query.eq('entity_id', entityId);

    const { data, error } = await query;
    if (error) throw new Error(`Failed to fetch logs: ${error.message}`);
    return data || [];
  }

  private async getCurrentOrgId(): Promise<string> {
    const { data } = await this.supabase.rpc('get_current_org_id');
    return data;
  }
}
