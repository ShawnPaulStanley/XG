import React, { useState } from 'react';
import { Player, PositionKey } from '../types';
import { POSITIONS } from '../data/positions';
import { X, FileText, UserPlus, Sparkles } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newPlayers: Omit<Player, 'id' | 'createdAt'>[]) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [rawText, setRawText] = useState('');

  if (!isOpen) return null;

  const parseLines = (): Omit<Player, 'id' | 'createdAt'>[] => {
    const lines = rawText.split('\n');
    const parsed: Omit<Player, 'id' | 'createdAt'>[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Remove leading numbering like "1. ", "1)", "- "
      const cleanLine = trimmed.replace(/^(\d+[\.\)]\s*|[\-\*]\s*)/, '');

      // Check for position tags in parentheses or after dashes e.g. "John (CB, CDM)" or "Mike - ST"
      const allPosKeys = POSITIONS.map((p) => p.key);
      const foundPositions: PositionKey[] = [];

      allPosKeys.forEach((key) => {
        // Regex word boundary match for position keys
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(cleanLine)) {
          foundPositions.push(key);
        }
      });

      // Extract name by removing brackets/positions or standard cleaning
      let namePart = cleanLine.replace(/\([^\)]*\)/g, '').replace(/[-–—].*$/, '').trim();
      if (!namePart) namePart = cleanLine;

      parsed.push({
        name: namePart,
        preferredPositions: foundPositions.length > 0 ? foundPositions : ['CM'],
      });
    });

    return parsed;
  };

  const handleImport = () => {
    const parsed = parseLines();
    if (parsed.length > 0) {
      onImport(parsed);
      setRawText('');
      onClose();
    }
  };

  const previewList = parseLines();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-['Space_Grotesk',sans-serif]">
      <div className="relative w-full max-w-xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-0 text-black overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 bg-black text-white border-b-4 border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#CCFF00] text-black border-2 border-black flex items-center justify-center">
              <FileText className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase text-white tracking-wide">QUICK BULK IMPORT</h2>
              <p className="text-xs font-mono text-[#CCFF00]">
                PASTE ROSTER LIST (WHATSAPP READY)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-[#FF5F56] text-black border-2 border-black hover:bg-red-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 bg-white">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black flex items-center justify-between">
              <span>PASTE NAMES (ONE PER LINE)</span>
              <span className="text-[10px] font-mono font-bold bg-zinc-200 px-2 py-0.5 border border-black">
                TIP: "John (CB, CDM)" or "Mike - ST"
              </span>
            </label>
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`1. John Miller (CB, CDM)\n2. Alex Ruiz (GK)\n3. David Beckham (RB, CM)\n4. Ryan Giggs (LW, CAM)\n5. Jack Kane (ST)`}
              className="w-full p-4 bg-white border-3 border-black text-black text-xs font-mono font-bold placeholder-zinc-400 focus:outline-none focus:bg-[#00F0FF]/10"
            />
          </div>

          {/* Real-time Parsed Preview */}
          {previewList.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-black font-black uppercase">
                <span>DETECTED {previewList.length} PLAYERS</span>
                <Sparkles className="w-4 h-4 fill-black" />
              </div>
              <div className="max-h-32 overflow-y-auto bg-zinc-100 p-3 border-2 border-black space-y-1.5">
                {previewList.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs text-black font-bold">
                    <span className="uppercase">{p.name}</span>
                    <div className="flex items-center gap-1">
                      {p.preferredPositions.map((pos) => (
                        <span
                          key={pos}
                          className="px-1.5 py-0.5 bg-black text-white text-[10px] font-mono font-black"
                        >
                          {pos}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t-3 border-black bg-white flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white hover:bg-zinc-100 text-black border-2 border-black font-black text-xs uppercase cursor-pointer"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={previewList.length === 0}
            className={`flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase border-2 border-black neo-btn transition-all cursor-pointer ${
              previewList.length > 0
                ? 'bg-[#CCFF00] hover:bg-[#00F0FF] text-black'
                : 'bg-zinc-200 text-zinc-400 cursor-not-allowed opacity-60'
            }`}
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>IMPORT {previewList.length} PLAYERS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
