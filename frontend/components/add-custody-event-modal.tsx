'use client';

import { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Link2 } from 'lucide-react';
import { api } from '@/lib/api';

interface AddCustodyEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evidenceId: string | null;
  onSuccess?: () => void;
}

export function AddCustodyEventModal({ open, onOpenChange, evidenceId, onSuccess }: AddCustodyEventModalProps) {
  const [formData, setFormData] = useState({
    actor_id: '', action_type: '', location: '', notes: '',
  });
  const [actors, setActors] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData({ actor_id: '', action_type: '', location: '', notes: '' });
      // Fetch actors for the dropdown
      api.getActors().then(data => {
        setActors(Array.isArray(data) ? data : []);
      }).catch(err => {
        console.error('Failed to load actors for custody event:', err);
      });
    }
  }, [open]);

  const actionTypes = ['received', 'transferred', 'analyzed', 'released', 'destroyed'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceId) return;
    if (!formData.actor_id || !formData.action_type) {
      toast.error('Actor and Action Type are required');
      return;
    }
    
    setSubmitting(true);
    try {
      const result = await api.createCustodyEvent({
        evidence_id: evidenceId,
        actor_id: formData.actor_id,
        action_type: formData.action_type,
        location: formData.location,
        notes: formData.notes,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Custody event logged successfully');
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to log custody event');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-zinc-800 bg-[#09090B]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-zinc-100">
            <Link2 className="w-5 h-5 text-accent" /> Log Custody Event
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Record a chain of custody action for Evidence ID: <span className="font-mono text-xs">{evidenceId?.substring(0, 8)}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="actor_id" className="text-zinc-300">Personnel / Actor *</Label>
            <Select value={formData.actor_id} onValueChange={(value) => setFormData({ ...formData, actor_id: value })}>
              <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100"><SelectValue placeholder="Select an actor" /></SelectTrigger>
              <SelectContent className="border-zinc-800 bg-[#09090B] text-zinc-100">
                {actors.map((actor) => (
                  <SelectItem key={actor.actor_id} value={actor.actor_id}>
                    {actor.name} ({actor.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="action_type" className="text-zinc-300">Action Type *</Label>
              <Select value={formData.action_type} onValueChange={(value) => setFormData({ ...formData, action_type: value })}>
                <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-100 capitalize"><SelectValue placeholder="Select action" /></SelectTrigger>
                <SelectContent className="border-zinc-800 bg-[#09090B] text-zinc-100">
                  {actionTypes.map((a) => (<SelectItem key={a} value={a} className="capitalize">{a}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-zinc-300">Location</Label>
              <Input id="location" placeholder="e.g. Lab 2" value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-zinc-900 border-zinc-800 text-zinc-100" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-zinc-300">Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              placeholder="Any additional details..." 
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-zinc-900 border-zinc-800 text-zinc-100 min-h-[80px]" 
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800">Cancel</Button>
            <Button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              {submitting ? 'Logging...' : 'Log Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
