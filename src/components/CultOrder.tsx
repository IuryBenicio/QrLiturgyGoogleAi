import { ListOrdered, Music, Snowflake, BookOpen, Megaphone, GripVertical, Trash2 } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { LiturgyItem, LiturgyType } from '../pages/Dashboard';

interface CultOrderProps {
  items: LiturgyItem[];
  onAdd: (item: Omit<LiturgyItem, 'id'>) => void;
  onRemove: (id: string) => void;
  onReorder: (items: LiturgyItem[]) => void;
  onEdit: (item: LiturgyItem) => void;
}

export function CultOrder({ items, onAdd, onRemove, onReorder, onEdit }: CultOrderProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    
    onReorder(newItems);
  };

  const getIconForType = (type: LiturgyType) => {
    switch (type) {
      case 'LOUVOR': return <Music size={20} />;
      case 'ORACAO': return <Snowflake size={20} />;
      case 'PALAVRA': return <BookOpen size={20} />;
      case 'AVISOS': return <Megaphone size={20} />;
    }
  };

  const getColorClassForType = (type: LiturgyType) => {
    switch (type) {
      case 'LOUVOR': return 'bg-primary/10 text-primary';
      case 'ORACAO': return 'bg-blue-500/10 text-blue-500';
      case 'PALAVRA': return 'bg-orange-500/10 text-orange-500';
      case 'AVISOS': return 'bg-purple-500/10 text-purple-500';
    }
  };

  return (
    <section className="lg:col-span-5 flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-black/5 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <ListOrdered className="text-primary" size={20} />
            <h2 className="font-bold text-lg">Ordem do Culto</h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onAdd({ type: 'LOUVOR', title: 'Momento de Louvor', subtitle: 'Adicione uma música' })}
              className="bg-gray-100 hover:bg-primary hover:text-white transition-all px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Music size={14} /> Louvor
            </button>
            <button 
              onClick={() => onAdd({ type: 'ORACAO', title: 'Momento de Oração', subtitle: 'Tempo sugerido: 5 min' })}
              className="bg-gray-100 hover:bg-primary hover:text-white transition-all px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Snowflake size={14} /> Oração
            </button>
            <button 
              onClick={() => onAdd({ type: 'PALAVRA', title: 'Ministração da Palavra', subtitle: 'Pregador: Confirmado' })}
              className="bg-gray-100 hover:bg-primary hover:text-white transition-all px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <BookOpen size={14} /> Palavra
            </button>
            <button 
              onClick={() => onAdd({ type: 'AVISOS', title: 'Avisos da Semana', subtitle: 'Projetar slide de agenda' })}
              className="bg-gray-100 hover:bg-primary hover:text-white transition-all px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
            >
              <Megaphone size={14} /> Avisos
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl p-8">
              <ListOrdered size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-medium text-center">A ordem do culto está vazia.</p>
              <p className="text-xs text-center mt-1">Adicione itens usando os botões acima ou selecione músicas da biblioteca.</p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="cult-order-list">
                {(provided) => (
                  <div 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            onClick={() => onEdit(item)}
                            className={`group flex items-center gap-4 p-4 bg-white border shadow-sm rounded-xl transition-all cursor-pointer ${
                              snapshot.isDragging ? 'border-primary shadow-md scale-[1.02]' : 'border-black/5 hover:border-primary/50'
                            }`}
                          >
                            <div {...provided.dragHandleProps} className="cursor-move p-1 -ml-1" onClick={(e) => e.stopPropagation()}>
                              <GripVertical className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
                            </div>
                            
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClassForType(item.type)}`}>
                              {getIconForType(item.type)}
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-sm font-bold">{item.title}</h3>
                              <p className="text-xs text-gray-500">{item.subtitle}</p>
                            </div>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemove(item.id);
                              }}
                              className="text-gray-400 hover:text-primary transition-colors p-2"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </section>
  );
}
