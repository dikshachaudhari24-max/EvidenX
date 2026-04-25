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
import { Edit } from 'lucide-react';
import { api } from '@/lib/api';

interface EditEvidenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evidence: any | null;
  onSuccess?: () => void;
}

export function EditEvidenceModal({ open, onOpenChange, evidence, onSuccess }: EditEvidenceModalProps) {
  const [formData, setFormData] = useState({
    description: '', type: '', location: '', status: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (evidence) {
      setFormData({
        description: evidence.description || '',
        type: evidence.type || '',
        location: evidence.location || '',
        status: evidence.status || '',
      });
    }
  }, [evidence]);

  const evidenceTypes = [
    'Digital Records', 'Images & Video', 'Biological', 'Biometric',
    'Physical Items', 'Location Data', 'Trace Evidence', 'Digital Forensics',
  ];

  const statuses = ['secured', 'analyzed', 'archived', 'compromised'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidence?.evidence_id) return;
    
    setSubmitting(true);
    try {
      const result = await api.updateEvidence(evidence.evidence_id, formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Evidence updated successfully');
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update evidence');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gray-700 bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5" />Edit Evidence
          </DialogTitle>
          <DialogDescription>
            Update details for Evidence ID: <span className="font-mono text-xs">{evidence?.evidence_id?.substring(0, 8)}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Brief description of the evidence" value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-800/50 border-gray-700" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Input id="location" placeholder="e.g., Vault A - Shelf 3" value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-gray-800/50 border-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 capitalize"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-900">
                  {statuses.map((s) => (<SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Evidence Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-900">
                {evidenceTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-gray-700">Cancel</Button>
            <Button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
