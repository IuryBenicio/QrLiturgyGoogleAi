import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, content: string) => void;
  initialTitle: string;
  initialContent: string;
  modalType: 'LOUVOR' | 'AVISOS' | 'ORACAO' | 'PALAVRA' | 'OTHER';
}

export function ItemModal({ isOpen, onClose, onSave, initialTitle, initialContent, modalType }: ItemModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setContent(initialContent);
    }
  }, [isOpen, initialTitle, initialContent]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(title, content);
    onClose();
  };

  const isMusic = modalType === 'LOUVOR';
  const isAviso = modalType === 'AVISOS';

  const headerTitle = isMusic ? 'Editar Música' : isAviso ? 'Editar Aviso' : 'Editar Item';
  const titleLabel = isMusic ? 'Nome da Música' : isAviso ? 'Nome do Aviso' : 'Título';
  const contentLabel = isMusic ? 'Letra da Música' : isAviso ? 'Descrição Detalhada' : 'Conteúdo';
  const contentPlaceholder = isMusic ? 'Cole a letra da música aqui...' : isAviso ? 'O que será lido/projetado...' : 'Detalhes adicionais...';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-black/5">
          <h3 className="font-bold text-lg">{headerTitle}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 ml-1">
              {titleLabel}
            </label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary text-sm outline-none transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 ml-1">
              {contentLabel}
            </label>
            <textarea 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary text-sm outline-none min-h-[200px] resize-y transition-all"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={contentPlaceholder}
            />
          </div>
        </div>
        <div className="p-4 border-t border-black/5 flex justify-end gap-2 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-red-700 rounded-lg transition-colors shadow-sm">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
