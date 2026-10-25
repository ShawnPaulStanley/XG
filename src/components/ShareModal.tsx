import React, { useState } from 'react';
import { DivisionResult } from '../types';
import { formatTeamsForWhatsApp, formatTeamsPlainText } from '../utils/whatsappFormatter';
import { X, Copy, Check, Share2, Download, MessageSquare } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: DivisionResult | null;
  onExportPNG: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  result,
  onExportPNG,
}) => {
  const [copiedWA, setCopiedWA] = useState(false);
  const [copiedPlain, setCopiedPlain] = useState(false);

  if (!isOpen || !result) return null;

  const waText = formatTeamsForWhatsApp(result);
  const plainText = formatTeamsPlainText(result);

  const handleCopyWA = () => {
    navigator.clipboard.writeText(waText);
    setCopiedWA(true);
    setTimeout(() => setCopiedWA(false), 2000);
  };

  const handleCopyPlain = () => {
    navigator.clipboard.writeText(plainText);
    setCopiedPlain(true);
    setTimeout(() => setCopiedPlain(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-['Space_Grotesk',sans-serif]">
      <div className="relative w-full max-w-xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-0 text-black overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-black text-white border-b-4 border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00F0FF] text-black border-2 border-black flex items-center justify-center">
              <Share2 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase text-white tracking-wide">SHARE MATCH LINEUPS</h2>
              <p className="text-xs font-mono text-[#00F0FF]">
                WHATSAPP READY FORMAT
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

        {/* Content */}
        <div className="p-6 space-y-5 bg-white">
          {/* WhatsApp Preview & Copy Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-black uppercase flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 stroke-[2.5]" />
                <span>WHATSAPP FORMATTED TEXT</span>
              </label>
              <button
                onClick={handleCopyWA}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#CCFF00] hover:bg-[#00F0FF] text-black font-black text-xs border-2 border-black neo-btn transition-colors cursor-pointer uppercase"
              >
                {copiedWA ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Copy className="w-3.5 h-3.5 stroke-[2.5]" />}
                <span>{copiedWA ? 'COPIED!' : 'COPY WHATSAPP'}</span>
              </button>
            </div>

            <textarea
              readOnly
              rows={6}
              value={waText}
              className="w-full p-3 bg-zinc-100 border-3 border-black text-black font-mono font-bold text-xs focus:outline-none"
            />
          </div>

          {/* Export PNG Pitch Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onExportPNG();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#00F0FF] hover:bg-[#CCFF00] text-black font-black text-xs uppercase border-2 border-black neo-shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>DOWNLOAD PITCH IMAGE (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
