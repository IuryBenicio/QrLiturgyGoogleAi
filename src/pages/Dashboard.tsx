import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { CultInfo } from '../components/CultInfo';
import { CultOrder } from '../components/CultOrder';
import { MusicLibrary } from '../components/MusicLibrary';
import { ItemModal } from '../components/ItemModal';
import { useNavigate } from 'react-router-dom';

export type LiturgyType = 'LOUVOR' | 'ORACAO' | 'PALAVRA' | 'AVISOS';

export interface LiturgyItem {
  id: string;
  type: LiturgyType;
  title: string;
  subtitle: string;
  content?: string;
}

export interface LibrarySong {
  id: string;
  title: string;
  artist: string;
  content?: string;
}

export interface CultInfoState {
  id?: string;
  name: string;
  date: string;
  theme: string;
  preacher: string;
  biblicalPassage: string;
  observations: string;
  hasSupper: boolean;
}

type EditingContext = {
  type: 'ORDER_ITEM';
  item: LiturgyItem;
} | {
  type: 'LIBRARY_SONG';
  song: LibrarySong;
} | null;

const fallbackSongs: LibrarySong[] = [
  { id: '1', title: "Bondade de Deus", artist: "Isaías Saad • Gratidão" },
  { id: '2', title: "Ousado Amor", artist: "Isaias Saad • Adoração" },
  { id: '3', title: "Vem Me Buscar", artist: "Jefferson & Suellen • Pentecostal" },
  { id: '4', title: "Lugar Secreto", artist: "Gabriela Rocha • Intimidade" },
  { id: '5', title: "A Casa é Sua", artist: "Casa Worship • Presença" },
  { id: '6', title: "Grandes Coisas", artist: "Fernandinho • Celebração" },
  { id: '7', title: "Quão Grande é o Meu Deus", artist: "Soraya Moraes • Exaltação" },
  { id: '8', title: "Pode Morar Aqui", artist: "Theo Rubia • Entrega" },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [cultInfo, setCultInfo] = useState<CultInfoState>({
    name: '',
    date: '',
    theme: '',
    preacher: '',
    biblicalPassage: '',
    observations: '',
    hasSupper: false,
  });

  const [liturgyItems, setLiturgyItems] = useState<LiturgyItem[]>([]);
  const [librarySongs, setLibrarySongs] = useState<LibrarySong[]>([]);
  const [editingContext, setEditingContext] = useState<EditingContext>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiturgia = async () => {
      try {
        const response = await fetch('https://qrliturgy-java.onrender.com/liturgia/last_liturgia', {
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          setCultInfo({
            id: data.id,
            name: data.culto || '',
            date: data.data || '',
            theme: data.tema || '',
            preacher: data.pregador || '',
            biblicalPassage: data.passagemBiblica || '',
            observations: data.observacoes || '',
            hasSupper: data.ceia || false,
          });
          
          if (data.ordemLiturgica && Array.isArray(data.ordemLiturgica)) {
            setLiturgyItems(data.ordemLiturgica.map((item: any, index: number) => {
              if (typeof item === 'string') {
                return {
                  id: `item-${Date.now()}-${index}`,
                  type: item as LiturgyType,
                  title: item,
                  subtitle: '',
                  content: '',
                };
              }
              return {
                id: `item-${Date.now()}-${index}`,
                type: item.tipo,
                title: item.titulo,
                subtitle: item.subtitulo || '',
                content: item.conteudo || '',
              };
            }));
          }
        } else {
          throw new Error('Failed to fetch liturgia');
        }
      } catch (error) {
        console.error('Erro ao buscar última liturgia:', error);
        setConnectionError('Não foi possível conectar ao servidor. Usando modo offline.');
      }
    };

    const fetchLouvores = async () => {
      try {
        const response = await fetch('https://qrliturgy-java.onrender.com/louvor/get_louvores', {
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setLibrarySongs(data.map((song: any) => ({
              id: song.id?.toString() || Math.random().toString(36).substr(2, 9),
              title: song.nome || song.titulo || '',
              artist: song.artista || song.autor || '',
              content: song.letra || song.conteudo || '',
            })));
          }
        } else {
          throw new Error('Failed to fetch louvores');
        }
      } catch (error) {
        console.error('Erro ao buscar louvores:', error);
        // Fallback to mock data so the UI is still usable
        setLibrarySongs(fallbackSongs);
      }
    };

    fetchLiturgia();
    fetchLouvores();
  }, []);

  const handleAddLiturgyItem = (item: Omit<LiturgyItem, 'id'>) => {
    const newItem: LiturgyItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setLiturgyItems((prev) => [...prev, newItem]);
  };

  const handleRemoveLiturgyItem = (id: string) => {
    setLiturgyItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReorderLiturgyItems = (newItems: LiturgyItem[]) => {
    setLiturgyItems(newItems);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    const payload = {
      culto: cultInfo.name,
      data: cultInfo.date,
      tema: cultInfo.theme,
      pregador: cultInfo.preacher,
      passagemBiblica: cultInfo.biblicalPassage,
      observacoes: cultInfo.observations,
      ceia: cultInfo.hasSupper,
      ordemLiturgica: liturgyItems.map(item => item.type),
      itens: liturgyItems.map(item => ({
        tipo: item.type,
        titulo: item.title,
        subtitulo: item.subtitle,
        conteudo: item.content,
      })),
      louvores: liturgyItems.filter(i => i.type === 'LOUVOR').map(i => ({
        titulo: i.title,
        letra: i.content
      })),
      avisos: liturgyItems.filter(i => i.type === 'AVISOS').map(i => ({
        titulo: i.title,
        descricao: i.content
      }))
    };

    try {
      const url = cultInfo.id 
        ? `https://qrliturgy-java.onrender.com/liturgia/edit_liturgia/${cultInfo.id}`
        : 'https://qrliturgy-java.onrender.com/liturgia/new_liturgia';
      
      const method = cultInfo.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.id && !cultInfo.id) {
          setCultInfo(prev => ({ ...prev, id: data.id }));
        }
        alert('Liturgia publicada com sucesso!');
      } else {
        alert('Erro ao publicar liturgia. Verifique os dados e tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao publicar:', error);
      alert('Erro de conexão ao publicar liturgia. O servidor pode estar offline.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminData');
    navigate('/login');
  };

  const handleSaveModal = (title: string, content: string) => {
    if (!editingContext) return;

    if (editingContext.type === 'ORDER_ITEM') {
      setLiturgyItems(prev => prev.map(item => 
        item.id === editingContext.item.id 
          ? { ...item, title, content } 
          : item
      ));
    } else if (editingContext.type === 'LIBRARY_SONG') {
      setLibrarySongs(prev => prev.map(song => 
        song.id === editingContext.song.id 
          ? { ...song, title, content } 
          : song
      ));
      
      setLiturgyItems(prev => prev.map(item => 
        (item.type === 'LOUVOR' && item.title === editingContext.song.title)
          ? { ...item, title, content }
          : item
      ));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onPublish={handlePublish} onLogout={handleLogout} isPublishing={isPublishing} />
      
      {connectionError && (
        <div className="bg-orange-50 border-b border-orange-200 text-orange-800 px-6 py-2 text-sm text-center flex items-center justify-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
          {connectionError}
        </div>
      )}

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1600px] mx-auto w-full">
        <CultInfo info={cultInfo} setInfo={setCultInfo} />
        <CultOrder 
          items={liturgyItems} 
          onAdd={handleAddLiturgyItem} 
          onRemove={handleRemoveLiturgyItem}
          onReorder={handleReorderLiturgyItems}
          onEdit={(item) => setEditingContext({ type: 'ORDER_ITEM', item })}
        />
        <MusicLibrary 
          songs={librarySongs}
          onAddSong={(song) => handleAddLiturgyItem({
            type: 'LOUVOR',
            title: song.title,
            subtitle: song.artist,
            content: song.content,
          })} 
          onEditSong={(song) => setEditingContext({ type: 'LIBRARY_SONG', song })}
        />
      </main>
      
      {/* Footer for mobile view hint */}
      <footer className="p-6 pt-0 lg:hidden">
        <div className="bg-graphite text-white p-4 rounded-xl flex items-center justify-between">
          <span className="text-sm font-medium">Pronto para publicar?</span>
          <button 
            onClick={handlePublish} 
            disabled={isPublishing}
            className="bg-primary px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-70"
          >
            {isPublishing ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </footer>

      <ItemModal 
        isOpen={editingContext !== null}
        onClose={() => setEditingContext(null)}
        onSave={handleSaveModal}
        initialTitle={editingContext?.type === 'ORDER_ITEM' ? editingContext.item.title : editingContext?.type === 'LIBRARY_SONG' ? editingContext.song.title : ''}
        initialContent={editingContext?.type === 'ORDER_ITEM' ? (editingContext.item.content || '') : editingContext?.type === 'LIBRARY_SONG' ? (editingContext.song.content || '') : ''}
        modalType={editingContext?.type === 'ORDER_ITEM' ? editingContext.item.type : editingContext?.type === 'LIBRARY_SONG' ? 'LOUVOR' : 'OTHER'}
      />
    </div>
  );
}
