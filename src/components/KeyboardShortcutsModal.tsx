import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'G or Ctrl+Enter', label: 'Generate Balanced Teams' },
    { key: 'S', label: 'Shuffle Teams' },
    { key: 'C', label: 'Copy WhatsApp Format' },
    { key: 'E', label: 'Export Pitch Image (PNG)' },
    { key: '1 - 5', label: 'Switch Navigation Tabs' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-['Space_Grotesk',sans-serif]">
      <div className="relative w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-0 text-black overflow-hidden">
        <div className="flex items-center justify-between p-5 bg-black text-white border-b-4 border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFBD2E] text-black border-2 border-black flex items-center justify-center">
              <Keyboard className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase text-white tracking-wide">KEYBOARD SHORTCUTS</h2>
              <p className="text-xs font-mono text-[#FFBD2E]">PRO TACTICAL HOTKEYS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-[#FF5F56] text-black border-2 border-black hover:bg-red-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        <div className="p-6 space-y-3 bg-white">
          {shortcuts.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-zinc-100 border-2 border-black neo-shadow-sm"
            >
              <span className="text-xs text-black font-black uppercase">{sc.label}</span>
              <kbd className="px-2.5 py-1 bg-black text-[#CCFF00] font-mono text-xs font-black border border-black">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
