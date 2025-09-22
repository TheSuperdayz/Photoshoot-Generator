import React, { useState } from 'react';
import { BellIcon } from './icons/BellIcon';
import type { ToDoItem } from '../types';

interface ReminderToastProps {
    todo: ToDoItem;
    onClose: () => void;
}

export const ReminderToast: React.FC<ReminderToastProps> = ({ todo, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300); // Wait for animation
    };

    const getRelativeDateString = (dueDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const dateParts = dueDate.split('-').map(Number);
        const due = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);

        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'is due today';
        if (diffDays === 1) return 'is due tomorrow';
        if (diffDays < 0) return `was due ${Math.abs(diffDays)} days ago`;
        return `is due in ${diffDays} days`;
    };

    return (
        <div 
            className={`fixed top-5 right-5 z-50 w-full max-w-sm p-4 bg-gray-950/80 backdrop-blur-2xl border border-white/10 rounded-xl shadow-lg flex items-start gap-4 ${isClosing ? 'animate-fadeOutUp' : 'animate-slideInDown'}`}
        >
            <div className="flex-shrink-0 pt-1">
                <BellIcon className="w-6 h-6" />
            </div>
            <div className="flex-grow">
                <p className="font-bold text-white">Task Reminder</p>
                <p className="text-sm text-gray-300">
                    "{todo.title}" {getRelativeDateString(todo.dueDate)}.
                </p>
            </div>
            <button onClick={handleClose} className="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
        </div>
    );
};
