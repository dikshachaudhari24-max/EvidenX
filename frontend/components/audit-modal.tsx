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
import { Activity } from 'lucide-react';
import { api } from '@/lib/api';

interface AuditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  audit: any | null;
  onSuccess?: () => void;
}

export function AuditModal({ open, onOpenChange, audit, onSuccess }: AuditModalProps) {
  const [formData, setFormData] = useState({
    evidence_id: '',
    version_id: '',
    verified_hash: '',
    result: 'PASS',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (audit) {
      setFormData({
        evidence_id: audit.evidence_id || '',
        version_id: audit.version_id || '',
        verified_hash: audit.verified_hash || '',
        result: audit.result || 'PASS',
      });
    } else {
      setFormData({ evidence_id: '', version_id: '', verified_hash: '', result: 'PASS' });
    }
  }, [audit, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (audit?.audit_id) {
        // Update existing
        await api.updateAudit(audit.audit_id, { result: formData.result, verified_hash: formData.verified_hash });
        toast.success('Audit updated successfully');
      } else {
        // Create new
        await api.createAudit(formData);
        toast.success('Manual audit recorded');
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save audit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-[#09090B]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-zinc-100">
            <Activity className="w-5 h-5 text-accent" /> {audit ? 'Edit Audit Record' : 'Log Manual Audit'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {audit ? 'Modify the details of this audit record.' : 'Manually record an integrity check result.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          
          {!audit && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="evidence_id" className="text-zinc-300">Evidence ID</Label>
                <Input id="evidence_id" required value={formData.evidence_id}
                  onChange={(e) => setFormData({ ...formData, evidence_id: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="version_id" className="text-zinc-300">Version ID</Label>
                <Input id="version_id" required value={formData.version_id}
                  onChange={(e) => setFormData({ ...formData, version_id: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="result" className="text-zinc-300">Result</Label>
              <Select value={formData.result} onValueChange={(value) => setFormData({ ...formData, result: value })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100"><SelectValue /></SelectTrigger>
                <SelectContent className="border-zinc-800 bg-[#09090B] text-zinc-100">
                  <SelectItem value="PASS" className="text-emerald-400">PASS</SelectItem>
                  <SelectItem value="FAIL" className="text-red-400">FAIL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="verified_hash" className="text-zinc-300">Verified Hash</Label>
            <Input id="verified_hash" placeholder="Enter computed hash..." value={formData.verified_hash}
              onChange={(e) => setFormData({ ...formData, verified_hash: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 font-mono text-sm" />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800">Cancel</Button>
            <Button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {submitting ? 'Saving...' : 'Save Record'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
