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
import { UserPlus, UserCog } from 'lucide-react';
import { api } from '@/lib/api';

interface ActorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actor: any | null;
  onSuccess?: () => void;
}

export function ActorModal({ open, onOpenChange, actor, onSuccess }: ActorModalProps) {
  const [formData, setFormData] = useState({
    name: '', role: '', email: '', department: '', badge: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const isEdit = !!actor;

  useEffect(() => {
    if (open) {
      if (actor) {
        setFormData({
          name: actor.name || '',
          role: actor.role || '',
          email: actor.email || '',
          department: actor.department || '',
          badge: actor.badge || '',
        });
      } else {
        setFormData({ name: '', role: '', email: '', department: '', badge: '' });
      }
    }
  }, [open, actor]);

  const roles = ['investigator', 'analyst', 'custodian', 'admin'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      toast.error('Name and Role are required');
      return;
    }
    
    setSubmitting(true);
    try {
      if (isEdit) {
        const result = await api.updateActor(actor.actor_id, formData);
        if (result.error) toast.error(result.error);
        else toast.success('Actor updated successfully');
      } else {
        const result = await api.createActor(formData);
        if (result.error) toast.error(result.error);
        else toast.success('Actor added successfully');
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || `Failed to ${isEdit ? 'update' : 'add'} actor`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gray-700 bg-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEdit ? <UserCog className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            {isEdit ? 'Edit Personnel' : 'Add New Personnel'}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update details for this actor.' : 'Register a new actor into the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" placeholder="John Doe" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-800/50 border-gray-700" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 capitalize"><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent className="border-gray-700 bg-gray-900">
                  {roles.map((r) => (<SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="badge">Badge ID</Label>
              <Input id="badge" placeholder="e.g. BDG-123" value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="bg-gray-800/50 border-gray-700" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-gray-800/50 border-gray-700" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="e.g. Forensics" value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="bg-gray-800/50 border-gray-700" />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 border-gray-700">Cancel</Button>
            <Button type="submit" disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {submitting ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Actor')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
