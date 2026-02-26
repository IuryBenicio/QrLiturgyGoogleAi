import { ListMusic, Search, Plus, PlusCircle } from 'lucide-react';
import { useState } from 'react';

const songs = [
  { title: "Bondade de Deus", artist: "Isaías Saad • Gratidão" },
  { title: "Ousado Amor", artist: "Isaias Saad • Adoração" },
  { title: "Vem Me Buscar", artist: "Jefferson & Suellen • Pentecostal" },
  { title: "Lugar Secreto", artist: "Gabriela Rocha • Intimidade" },
  { title: "A Casa é Sua", artist: "Casa Worship • Presença" },
  { title: "Grandes Coisas", artist: "Fernandinho • Celebração" },
  { title: "Quão Grande é o Meu Deus", artist: "Soraya Moraes • Exaltação" },
  { title: "Pode Morar Aqui", artist: "Theo Rubia • Entrega" },
];

interface MusicLibraryProps {
  onAddSong: (song: { title: string; artist: string }) => void;
}

export function MusicLibrary({ onAddSong }: MusicLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="lg:col-span-4 flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-black/5 flex flex-col h-full lg:max-h-[calc(100vh-140px)]">
        <div className="flex items-center gap-2 mb-4">
          <ListMusic className="text-primary" size={20} />
          <h2 className="font-bold text-lg">Biblioteca de Músicas</h2>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input 
            className="w-full bg-gray-50 border-none rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary text-sm outline-none" 
            placeholder="Pesquisar por nome ou tema..." 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1">
          {filteredSongs.map((song, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="flex flex-col">
                <span className="text-sm font-bold">{song.title}</span>
                <span className="text-xs text-gray-500">{song.artist}</span>
              </div>
              <button 
                onClick={() => onAddSong(song)}
                className="bg-primary/10 text-primary p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
              >
                <Plus size={18} />
              </button>
            </div>
          ))}
          {filteredSongs.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              Nenhuma música encontrada.
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-black/5">
          <button className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors">
            <PlusCircle size={20} />
            Cadastrar Nova Música
          </button>
        </div>
      </div>
    </section>
  );
}
