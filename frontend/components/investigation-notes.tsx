"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { api } from "@/lib/api";
import { toast } from "sonner";

export type InvestigationNote = {
  id: string;
  evidenceId: string;
  investigatorName: string;
  timestamp: string;
  howFound: string;
  sourceInformant: string;
  locationFound: string;
  keyObservations: string;
  additionalNotes: string;
};

type InvestigationNotesProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evidenceId: string | null;
  investigatorName: string;
};

export function InvestigationNotes({
  open,
  onOpenChange,
  evidenceId,
  investigatorName,
}: InvestigationNotesProps) {
  const [evidenceNotes, setEvidenceNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [howFound, setHowFound] = useState("");
  const [sourceInformant, setSourceInformant] = useState("");
  const [locationFound, setLocationFound] = useState("");
  const [keyObservations, setKeyObservations] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const loadNotes = async () => {
    if (!evidenceId) return;
    setLoading(true);
    try {
      const data = await api.getVersions(evidenceId);
      // Sort newest first
      const sorted = Array.isArray(data) ? data.sort((a, b) => 
        new Date(b.version_time).getTime() - new Date(a.version_time).getTime()
      ) : [];
      setEvidenceNotes(sorted);
    } catch (err) {
      console.error("Failed to load notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadNotes();
    } else {
      setEvidenceNotes([]);
    }
  }, [open, evidenceId]);

  const resetForm = () => {
    setHowFound("");
    setSourceInformant("");
    setLocationFound("");
    setKeyObservations("");
    setAdditionalNotes("");
  };

  const handleSubmit = async () => {
    if (!evidenceId) return;
    if (!howFound.trim() && !sourceInformant.trim() && !locationFound.trim() && !keyObservations.trim() && !additionalNotes.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        investigatorName,
        howFound: howFound.trim(),
        sourceInformant: sourceInformant.trim(),
        locationFound: locationFound.trim(),
        keyObservations: keyObservations.trim(),
        additionalNotes: additionalNotes.trim(),
      };

      const result = await api.createVersion({
        evidence_id: evidenceId,
        hash_value: `report-hash-${Date.now()}`,
        notes: JSON.stringify(payload)
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Investigation report saved to database');
        resetForm();
        loadNotes();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="bg-[#09090B] border-zinc-800 text-zinc-100 w-full sm:max-w-lg">
        <DrawerHeader className="border-b border-zinc-800 flex-row items-start justify-between gap-3">
          <div>
            <DrawerTitle className="text-zinc-100">
              {evidenceId ? `Evidence ID: ${evidenceId}` : "Investigation Notes"}
            </DrawerTitle>
            <DrawerDescription className="text-zinc-400">
              Fill out the investigation report details and submit to store this record.
            </DrawerDescription>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-md border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
            aria-label="Close investigation notes panel"
          >
            <X className="w-4 h-4" />
          </button>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-zinc-300 font-medium">
              How did you find out about this evidence?
            </label>
            <textarea
              value={howFound}
              onChange={(e) => setHowFound(e.target.value)}
              className="w-full min-h-20 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-zinc-300 font-medium">Source / Informant</label>
            <textarea
              value={sourceInformant}
              onChange={(e) => setSourceInformant(e.target.value)}
              className="w-full min-h-16 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-zinc-300 font-medium">
              Location where evidence was found
            </label>
            <textarea
              value={locationFound}
              onChange={(e) => setLocationFound(e.target.value)}
              className="w-full min-h-16 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-zinc-300 font-medium">Key Observations</label>
            <textarea
              value={keyObservations}
              onChange={(e) => setKeyObservations(e.target.value)}
              className="w-full min-h-20 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-zinc-300 font-medium">Additional Notes</label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full min-h-20 rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              submitting || !evidenceId ||
              (!howFound.trim() && !sourceInformant.trim() && !locationFound.trim() && !keyObservations.trim() && !additionalNotes.trim())
            }
            className="w-full flex justify-center rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:text-zinc-400 text-white py-2.5 text-sm font-medium transition-colors"
          >
            {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Investigation Report'}
          </button>

          <div className="pt-2 border-t border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">Previous Reports</h3>
            <div className="space-y-3 max-h-[48vh] overflow-auto pr-1">
              {loading ? (
                <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-zinc-500" /></div>
              ) : evidenceNotes.length > 0 ? (
                evidenceNotes.map((version) => {
                  let parsed;
                  try { parsed = JSON.parse(version.notes); } catch { parsed = { additionalNotes: version.notes }; }
                  
                  return (
                    <div key={version.version_id} className="border border-zinc-800 bg-zinc-900/60 rounded-lg p-3">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-xs text-zinc-300 font-medium">
                          {parsed.investigatorName || 'System'} <span className="text-zinc-600 font-mono ml-2">v{version.version_number}</span>
                        </p>
                        <p className="text-xs text-zinc-500">
                          {new Date(version.version_time).toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-2 text-sm text-zinc-200">
                        {parsed.howFound && <p><span className="text-zinc-400">How found:</span> <span className="whitespace-pre-wrap">{parsed.howFound}</span></p>}
                        {parsed.sourceInformant && <p><span className="text-zinc-400">Source:</span> <span className="whitespace-pre-wrap">{parsed.sourceInformant}</span></p>}
                        {parsed.locationFound && <p><span className="text-zinc-400">Location:</span> <span className="whitespace-pre-wrap">{parsed.locationFound}</span></p>}
                        {parsed.keyObservations && <p><span className="text-zinc-400">Observations:</span> <span className="whitespace-pre-wrap">{parsed.keyObservations}</span></p>}
                        {parsed.additionalNotes && <p><span className="text-zinc-400">Notes:</span> <span className="whitespace-pre-wrap">{parsed.additionalNotes}</span></p>}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-zinc-500">No notes yet for this evidence.</p>
              )}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
