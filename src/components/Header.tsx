import { useState, useRef, useEffect } from 'react';
import { QrCode, Upload, LogOut, User, Loader2 } from 'lucide-react';

interface HeaderProps {
  onPublish: () => void;
  onLogout: () => void;
  isPublishing?: boolean;
}

export function Header({ onPublish, onLogout, isPublishing = false }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-graphite border-b border-white/10 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center bg-primary rounded-lg text-white">
            <QrCode size={24} />
          </div>
          <div>
            <h1 className="text-white font-black text-xl tracking-tight leading-none">Igreja BASE</h1>
            <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Liturgia QR</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a className="text-white hover:text-primary transition-colors text-sm font-semibold" href="#">Novo Culto</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onPublish} 
          disabled={isPublishing}
          className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {isPublishing ? 'Publicando...' : 'Publicar Liturgia'}
        </button>
        <div className="relative" ref={dropdownRef}>
          <div 
            className="h-10 w-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 hover:border-white/30 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <User size={20} />
          </div>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-black/5 py-1 z-50">
              <div className="px-4 py-2 border-b border-black/5">
                <p className="text-sm font-bold text-gray-900">Administrador</p>
                <p className="text-xs text-gray-500">admin@igrejabase.com</p>
              </div>
              <button 
                onClick={() => {
                  setIsDropdownOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
