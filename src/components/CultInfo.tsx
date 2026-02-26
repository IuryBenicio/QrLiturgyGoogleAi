import { Info, Calendar, FileText, User, Type, Book, AlignLeft } from 'lucide-react';
import { CultInfoState } from '../pages/Dashboard';

interface CultInfoProps {
  info: CultInfoState;
  setInfo: React.Dispatch<React.SetStateAction<CultInfoState>>;
}

export function CultInfo({ info, setInfo }: CultInfoProps) {
  return (
    <aside className="lg:col-span-3 space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-5 border border-black/5">
        <div className="flex items-center gap-2 mb-6">
          <Info className="text-primary" size={20} />
          <h2 className="font-bold text-lg">Informações do Culto</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 ml-1">Nome do Culto</label>
            <div className="relative">
              <Type className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                className="w-full bg-gray-50 border-none rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary text-sm outline-none" 
                placeholder="Ex: Culto Dominical" 
                type="text" 
                value={info.name}
                onChange={(e) => setInfo({ ...info, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 ml-1">Data do Culto</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                className="w-full bg-gray-50 border-none rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary text-sm outline-none" 
                placeholder="DD/MM/AAAA" 
                type="text" 
                value={info.date}
                onChange={(e) => setInfo({ ...info, date: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 ml-1">Tema do Culto</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                className="w-full bg-gray-50 border-none rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary text-sm outline-none" 
                placeholder="Ex: O Fruto do Espírito" 
                type="text" 
                value={info.theme}
                onChange={(e) => setInfo({ ...info, theme: e.target.value })}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 ml-1">Pregador</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                className="w-full bg-gray-50 border-none rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary text-sm outline-none" 
                placeholder="Nome do preletor" 
                type="text" 
                value={info.preacher}
                onChange={(e) => setInfo({ ...info, preacher: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 ml-1">Passagem Bíblica</label>
            <div className="relative">
              <Book className="absolute left-3 top-3 text-gray-400" size={20} />
              <textarea 
                className="w-full bg-gray-50 border-none rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary text-sm outline-none min-h-[80px] resize-y" 
                placeholder="Ex: Gálatas 5:22-23" 
                value={info.biblicalPassage}
                onChange={(e) => setInfo({ ...info, biblicalPassage: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 ml-1">Observações Gerais</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 text-gray-400" size={20} />
              <textarea 
                className="w-full bg-gray-50 border-none rounded-lg py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary text-sm outline-none min-h-[80px] resize-y" 
                placeholder="Observações para a equipe..." 
                value={info.observations}
                onChange={(e) => setInfo({ ...info, observations: e.target.value })}
              />
            </div>
          </div>
          
          <div className="pt-4 mt-4 border-t border-black/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold">Terá Ceia?</span>
              <span className="text-xs text-gray-500">Incluir rito no final</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={info.hasSupper}
                onChange={(e) => setInfo({ ...info, hasSupper: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
