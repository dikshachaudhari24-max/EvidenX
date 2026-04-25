'use client';

import { useState } from 'react';
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
import { Plus } from 'lucide-react';
import { api } from '@/lib/api';

interface AddEvidenceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddEvidenceModal({ open, onOpenChange, onSuccess }: AddEvidenceModalProps) {
  const [formData, setFormData] = useState({
    caseId: '', description: '', type: '', location: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const evidenceTypes = [
    'Digital Records', 'Images & Video', 'Biological', 'Biometric',
    'Physical Items', 'Location Data', 'Trace Evidence', 'Digital Forensics',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.caseId || !formData.type || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      const result = await api.createEvidence({
        case_id: formData.caseId,
        description: formData.description || `${formData.type} evidence`,
        type: formData.type,
        location: formData.location,
        status: 'secured',
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Evidence added successfully');
        setFormData({ caseId: '', description: '', type: '', location: '' });
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to add evidence');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gray-700 bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />Add New Evidence
          </DialogTitle>
          <DialogDescription>
            Register a new piece of evidence into the chain of custody system
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="caseId">Case ID *</Label>
              <Input id="caseId" placeholder="e.g., CASE-2024-001" value={formData.caseId}
                onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                className="bg-gray-800/50 border-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Storage Location *</Label>
              <Input id="location" placeholder="e.g., Vault A - Shelf 3" value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-gray-800/50 border-gray-700" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Brief description of the evidence" value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-gray-800/50 border-gray-700" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Evidence Type *</Label>
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
              {submitting ? 'Adding...' : 'Add Evidence'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
