'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FileStack } from 'lucide-react';
import { api } from '@/lib/api';

interface VersionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  version: any | null;
  onSuccess?: () => void;
}

export function VersionModal({ open, onOpenChange, version, onSuccess }: VersionModalProps) {
  const [formData, setFormData] = useState({
    evidence_id: '',
    hash_value: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (version) {
      setFormData({
        evidence_id: version.evidence_id || '',
        hash_value: version.hash_value || '',
        notes: version.notes || '',
      });
    } else {
      setFormData({ evidence_id: '', hash_value: '', notes: '' });
    }
  }, [version, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (version?.version_id) {
        // Update existing (only notes are updatable via API)
        await api.updateVersion(version.version_id, { notes: formData.notes });
        toast.success('Version notes updated successfully');
      } else {
        // Create new
        await api.createVersion(formData);
        toast.success('New version created');
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save version');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-[#09090B]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-zinc-100">
            <FileStack className="w-5 h-5 text-accent" /> {version ? 'Edit Version' : 'Create Version'}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {version ? 'Update the investigation notes for this version.' : 'Manually create a new evidence version.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          
          {!version && (
            <>
              <div className="space-y-2">
                <Label htmlFor="evidence_id" className="text-zinc-300">Evidence ID</Label>
                <Input id="evidence_id" required value={formData.evidence_id}
                  onChange={(e) => setFormData({ ...formData, evidence_id: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 font-mono text-sm" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hash_value" className="text-zinc-300">File Hash</Label>
                <Input id="hash_value" required value={formData.hash_value} placeholder="SHA-256 Hash"
                  onChange={(e) => setFormData({ ...formData, hash_value: e.target.value })}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 font-mono text-sm" />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-zinc-300">Investigation Notes</Label>
            <Textarea 
              id="notes" 
              placeholder="Findings or notes..." 
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 min-h-[100px]" 
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800">Cancel</Button>
            <Button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {submitting ? 'Saving...' : 'Save Version'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
