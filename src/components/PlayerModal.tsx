import React, { useState, useEffect } from 'react';
import { Player, PositionKey } from '../types';
import { POSITIONS, getCategoryBadgeClass } from '../data/positions';
import { X, Check, UserPlus, Save, AlertCircle } from 'lucide-react';

interface PlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (player: Omit<Player, 'id' | 'createdAt'>, existingId?: string) => void;
  editingPlayer?: Player | null;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlayer,
}) => {
  const [name, setName] = useState('');
  const [kitNumber, setKitNumber] = useState<string>('');
  const [preferredPositions, setPreferredPositions] = useState<PositionKey[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingPlayer) {
      setName(editingPlayer.name);
      setKitNumber(editingPlayer.kitNumber ? String(editingPlayer.kitNumber) : '');
      setPreferredPositions(editingPlayer.preferredPositions || []);
    } else {
      setName('');
      setKitNumber('');
      setPreferredPositions(['CM']); // default preferred
    }
    setError('');
  }, [editingPlayer, isOpen]);

  if (!isOpen) return null;

  const togglePosition = (posKey: PositionKey) => {
    if (preferredPositions.includes(posKey)) {
      // Don't allow empty selection
      if (preferredPositions.length === 1) {
        setError('At least one preferred position is required.');
        return;
      }
      setPreferredPositions(preferredPositions.filter((p) => p !== posKey));
    } else {
      setPreferredPositions([...preferredPositions, posKey]);
    }
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a player name.');
      return;
    }
    if (preferredPositions.length === 0) {
      setError('Select at least one preferred position.');
      return;
    }

    onSave(
      {
        name: name.trim(),
        preferredPositions,
        kitNumber: kitNumber ? parseInt(kitNumber, 10) : undefined,
      },
      editingPlayer?.id
    );

    onClose();
  };

  const categories = ['GK', 'DEF', 'MID', 'ATT'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-['Space_Grotesk',sans-serif]">
      <div className="relative w-full max-w-lg bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-0 text-black overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 bg-black text-white border-b-4 border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#CCFF00] text-black border-2 border-black flex items-center justify-center">
              {editingPlayer ? <Save className="w-5 h-5 stroke-[2.5]" /> : <UserPlus className="w-5 h-5 stroke-[2.5]" />}
            </div>
            <div>
              <h2 className="text-lg font-black uppercase text-white tracking-wide">
                {editingPlayer ? 'EDIT PLAYER DETAILS' : 'ADD NEW PLAYER'}
              </h2>
              <p className="text-xs font-mono text-[#CCFF00]">
                TACTICAL POSITION ASSIGNMENT
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#FF5F56] text-black border-2 border-black font-bold text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 stroke-[2.5]" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-black uppercase text-black">
                PLAYER NAME <span className="text-[#FF5F56]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. JOHN MILLER"
                autoFocus
                className="w-full px-4 py-2.5 bg-white border-3 border-black text-black text-xs font-bold placeholder-zinc-400 focus:outline-none focus:bg-[#00F0FF]/10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase text-black">KIT #</label>
              <input
                type="number"
                min="1"
                max="99"
                value={kitNumber}
                onChange={(e) => setKitNumber(e.target.value)}
                placeholder="7"
                className="w-full px-4 py-2.5 bg-white border-3 border-black text-black text-xs font-bold text-center placeholder-zinc-400 focus:outline-none focus:bg-[#00F0FF]/10"
              />
            </div>
          </div>

          {/* Preferred Positions Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase text-black">
                PREFERRED POSITIONS (MULTIPLE ALLOWED)
              </label>
              <span className="text-xs font-mono font-black bg-[#CCFF00] px-2 py-0.5 border border-black">
                {preferredPositions.length} SELECTED
              </span>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const catPositions = POSITIONS.filter((p) => p.category === cat);
                return (
                  <div key={cat} className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-black bg-zinc-200 px-2 py-0.5 border border-black inline-block">
                      {catPositions[0]?.categoryLabel}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {catPositions.map((pos) => {
                        const isSelected = preferredPositions.includes(pos.key);
                        return (
                          <button
                            key={pos.key}
                            type="button"
                            onClick={() => togglePosition(pos.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase border-2 border-black transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#00F0FF] text-black neo-shadow-sm'
                                : 'bg-white text-black hover:bg-zinc-100'
                            }`}
                          >
                            <span className="font-bold">{pos.key}</span>
                            <span className="text-[10px] opacity-80">({pos.label})</span>
                            {isSelected && <Check className="w-3.5 h-3.5 ml-0.5 stroke-[2.5]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t-3 border-black flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-zinc-100 text-black border-2 border-black font-black text-xs uppercase cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#CCFF00] hover:bg-[#00F0FF] text-black font-black text-xs uppercase border-2 border-black neo-btn cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{editingPlayer ? 'UPDATE PLAYER' : 'SAVE PLAYER'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
