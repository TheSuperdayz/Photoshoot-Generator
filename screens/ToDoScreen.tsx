import React, { useState, useMemo } from 'react';
import type { ToDoItem } from '../types';
import { PlusIcon } from '../components/icons/PlusIcon';
import { PencilIcon } from '../components/icons/PencilIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { BellIcon } from '../components/icons/BellIcon';

interface ToDoScreenProps {
    todos: ToDoItem[];
    onUpdateToDos: (updatedToDos: ToDoItem[]) => void;
}

const ToDoModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (todo: Omit<ToDoItem, 'id' | 'isCompleted'> & { id?: string }) => void;
    todo: ToDoItem | null;
}> = ({ isOpen, onClose, onSave, todo }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [reminder, setReminder] = useState<ToDoItem['reminder']>('none');

    React.useEffect(() => {
        if (todo) {
            setTitle(todo.title);
            setDescription(todo.description || '');
            setDueDate(todo.dueDate);
            setReminder(todo.reminder || 'none');
        } else {
            setTitle('');
            setDescription('');
            const today = new Date();
            today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
            setDueDate(today.toISOString().split('T')[0]);
            setReminder('none');
        }
    }, [todo, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSave({ id: todo?.id, title, description, dueDate, reminder });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-gray-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-6">{todo ? 'Edit Task' : 'Add New Task'}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="todo-title">Title</label>
                        <input id="todo-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-gray-400 placeholder-gray-500" />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="todo-desc">Description (Optional)</label>
                        <textarea id="todo-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-gray-400 placeholder-gray-500" />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="todo-date">Due Date</label>
                        <input id="todo-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-gray-400" />
                    </div>
                    <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="todo-reminder">Reminder</label>
                        <select
                            id="todo-reminder"
                            value={reminder}
                            onChange={(e) => setReminder(e.target.value as ToDoItem['reminder'])}
                            className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-gray-400"
                        >
                            <option value="none">No reminder</option>
                            <option value="on-due-date">On due date</option>
                            <option value="1-day-before">1 day before</option>
                            <option value="3-days-before">3 days before</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-end gap-4 mt-4">
                        <button type="button" onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-full">Cancel</button>
                        <button type="submit" className="font-bold py-2 px-5 rounded-full text-gray-900 bg-white">Save Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const ToDoScreen: React.FC<ToDoScreenProps> = ({ todos, onUpdateToDos }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState<ToDoItem | null>(null);

    const handleSaveTodo = (todoData: Omit<ToDoItem, 'id' | 'isCompleted'> & { id?: string }) => {
        if (todoData.id) {
            // Editing existing
            const updatedToDos = todos.map(t => t.id === todoData.id ? { ...t, ...todoData } : t);
            onUpdateToDos(updatedToDos);
        } else {
            // Adding new
            const newTodo: ToDoItem = {
                ...todoData,
                id: `todo_${Date.now()}`,
                isCompleted: false,
            };
            onUpdateToDos([newTodo, ...todos]);
        }
    };

    const handleDeleteTodo = (id: string) => {
        onUpdateToDos(todos.filter(t => t.id !== id));
    };
    
    const handleToggleComplete = (id: string) => {
        onUpdateToDos(todos.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
    };

    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ key: `pad-start-${i}`, day: null, isPadding: true });
        }
        for (let day = 1; day <= daysInMonth; day++) {
            days.push({ key: `${year}-${month}-${day}`, day, isPadding: false, date: new Date(year, month, day) });
        }
        const remainingCells = 42 - days.length; // 6 rows * 7 columns
        for (let i = 0; i < remainingCells; i++) {
            days.push({ key: `pad-end-${i}`, day: null, isPadding: true });
        }
        return days;
    }, [currentDate]);

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    };
    
    const today = new Date();
    const isToday = (date: Date) => date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();

    return (
        <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col">
            <ToDoModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTodo(null); }} onSave={handleSaveTodo} todo={editingTodo} />
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-white tracking-tight">Task Calendar</h1>
                <p className="mt-2 text-lg text-gray-400">Organize your creative projects and deadlines.</p>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-md bg-white/10 hover:bg-white/20">&lt;</button>
                    <h2 className="text-2xl font-bold w-48 text-center">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-md bg-white/10 hover:bg-white/20">&gt;</button>
                </div>
                <button onClick={() => { setEditingTodo(null); setIsModalOpen(true); }} className="flex items-center gap-2 font-bold py-2 px-4 rounded-full text-gray-900 bg-white hover:bg-gray-200 transition-colors">
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Task</span>
                </button>
            </div>
            
            <div className="grid grid-cols-7 gap-px bg-gray-700 border border-gray-700 rounded-lg overflow-hidden flex-grow min-h-[60vh]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-sm py-2 bg-black/30 text-gray-300">{day}</div>
                ))}
                
                {calendarGrid.map(cell => {
                    const cellDateStr = cell.date ? cell.date.toISOString().split('T')[0] : '';
                    const tasksForDay = todos.filter(t => t.dueDate === cellDateStr);
                    const hasReminder = tasksForDay.some(task => task.reminder && task.reminder !== 'none');

                    return (
                        <div key={cell.key} className={`bg-black/20 p-2 flex flex-col ${cell.isPadding ? 'opacity-40' : ''}`}>
                            {!cell.isPadding && (
                                <div className="flex items-center mb-2">
                                    <span className={`font-bold text-sm ${isToday(cell.date!) ? 'text-blue-400' : ''}`}>{cell.day}</span>
                                    {hasReminder && (
                                        <BellIcon className="w-3 h-3 text-yellow-500 ml-1.5" />
                                    )}
                                </div>
                            )}
                            <div className="flex-grow space-y-1 overflow-y-auto">
                                {tasksForDay.map(task => (
                                    <div key={task.id} className={`p-1.5 rounded-md text-xs group relative ${task.isCompleted ? 'bg-green-500/10 text-gray-400' : 'bg-blue-500/10 text-gray-200'}`}>
                                       <div className="flex gap-2 items-start">
                                            <button onClick={() => handleToggleComplete(task.id)} className="w-4 h-4 rounded-sm border-2 border-gray-500 flex-shrink-0 mt-0.5 flex items-center justify-center">
                                                {task.isCompleted && <CheckIcon className="w-3 h-3 text-green-400" />}
                                            </button>
                                            <div className="flex-grow">
                                                <span className={`font-medium ${task.isCompleted ? 'line-through' : ''}`}>{task.title}</span>
                                                {task.reminder && task.reminder !== 'none' && (
                                                    <BellIcon className="w-3 h-3 text-yellow-500 inline-block ml-1.5" />
                                                )}
                                            </div>
                                       </div>
                                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditingTodo(task); setIsModalOpen(true); }} className="p-1 rounded bg-white/10 hover:bg-white/20"><PencilIcon className="w-3 h-3"/></button>
                                            <button onClick={() => handleDeleteTodo(task.id)} className="p-1 rounded bg-white/10 hover:bg-white/20"><TrashIcon className="w-3 h-3"/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
};