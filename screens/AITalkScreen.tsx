import React, { useRef, useEffect } from 'react';

// Components
import { PersonalitySelector } from '../components/PersonalitySelector';
import { SendIcon } from '../components/icons/SendIcon';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Types
import type { User, ChatMessage } from '../types';

interface AITalkScreenProps {
    user: User;
    isLoading: boolean;
    error: string | null;
    chatHistory: ChatMessage[];
    currentMessage: string;
    setCurrentMessage: (message: string) => void;
    handleSendMessage: (message: string) => void;
    selectedPersonality: string;
    handleSelectPersonality: (personality: string) => void;
}

export const AITalkScreen: React.FC<AITalkScreenProps> = (props) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [props.chatHistory]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        props.handleSendMessage(props.currentMessage);
    };

    const getButtonText = () => {
        if (props.isLoading) return 'Thinking...';
        if (props.user && props.user.credits <= 0) return 'Out of Credits';
        return 'Send (1 Credit)';
    };

    return (
        <main className="flex-grow flex flex-col h-[calc(100vh-4rem)]">
            <div className="container mx-auto w-full max-w-4xl flex-grow flex flex-col p-4">
                {/* Header/Selector */}
                <div className="flex-shrink-0 pb-4 border-b border-white/10">
                    <h1 className="text-xl font-bold text-center mb-4">Talk with AI</h1>
                    <PersonalitySelector
                        selectedPersonality={props.selectedPersonality}
                        onSelect={props.handleSelectPersonality}
                    />
                </div>

                {/* Chat History */}
                <div className="flex-grow overflow-y-auto py-4 space-y-6">
                    {props.chatHistory.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                                    <span className="text-teal-400 text-sm font-bold">AI</span>
                                </div>
                            )}
                            <div
                                className={`max-w-md lg:max-w-lg p-3 rounded-2xl text-white whitespace-pre-wrap break-words ${
                                    msg.role === 'user'
                                        ? 'bg-blue-600/80 rounded-br-lg'
                                        : 'bg-white/10 rounded-bl-lg'
                                }`}
                            >
                                {msg.text}
                                {props.isLoading && index === props.chatHistory.length - 1 && msg.role === 'model' && (
                                     <span className="inline-block w-2 h-4 bg-white ml-1 animate-pulse"></span>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex-shrink-0 pt-4 mt-auto">
                     {props.error && <p className="text-red-400 text-xs text-center mb-2">{props.error}</p>}
                    <form onSubmit={handleFormSubmit} className="relative">
                        <input
                            type="text"
                            value={props.currentMessage}
                            onChange={(e) => props.setCurrentMessage(e.target.value)}
                            placeholder={`Message ${props.selectedPersonality}...`}
                            className="w-full bg-black/30 backdrop-blur-2xl border border-white/10 rounded-full py-3 pl-5 pr-14 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
                            disabled={props.isLoading || (props.user && props.user.credits <= 0)}
                        />
                        <button
                            type="submit"
                            disabled={props.isLoading || !props.currentMessage.trim() || (props.user && props.user.credits <= 0)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 text-gray-900 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                            aria-label="Send message"
                        >
                           {props.isLoading ? <div className="w-5 h-5 animate-spin rounded-full border-2 border-gray-900 border-t-transparent"></div> : <SendIcon className="w-5 h-5" />}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
};
