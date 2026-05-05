'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { FileKey2 } from 'lucide-react';
import { api } from '@/lib/api';

interface AccessLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: any | null;
  onSuccess?: () => void;
}

export function AccessLogModal({ open, onOpenChange, log, onSuccess }: AccessLogModalProps) {
  const [formData, setFormData] = useState({
    version_id: '',
    action_type: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (log) {
      setFormData({
        version_id: log.version_id || '',
        action_type: log.action_type || '',
      });
    } else {
      setFormData({ version_id: '', action_type: '' });
    }
  }, [log, open]);

  const actionTypes = ['read', 'write', 'verify', 'export', 'delete'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (log?.log_id) {
        // Update existing (only action_type)
        await api.updateAccessLog(log.log_id, { action_type: formData.action_type });
        toast.success('Access log updated successfully');
      } else {
        // Create new
        await api.createAccessLog(formData);
        toast.success('Access log created');
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save access log');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-[#09090B]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-zinc-100">
            <FileKey2 className="w-5 h-5 text-accent" /> {log ? 'Edit Access Log' : 'Create Access Log'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {log ? 'Modify the action type for this access log.' : 'Manually record an access event.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          
          {!log && (
            <div className="space-y-2">
              <Label htmlFor="version_id" className="text-zinc-300">Version ID</Label>
              <Input id="version_id" required value={formData.version_id}
                onChange={(e) => setFormData({ ...formData, version_id: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-zinc-100 font-mono text-sm" />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="action_type" className="text-zinc-300">Action Type</Label>
            <Select value={formData.action_type} onValueChange={(value) => setFormData({ ...formData, action_type: value })}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 capitalize">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent className="border-zinc-800 bg-[#09090B] text-zinc-100">
                {actionTypes.map((a) => (<SelectItem key={a} value={a} className="capitalize">{a}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800">Cancel</Button>
            <Button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {submitting ? 'Saving...' : 'Save Log'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
