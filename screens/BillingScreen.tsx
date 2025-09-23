
import React, { useState } from 'react';
import type { User, PaymentMethod, AppView } from '../types';
import { BillingIcon } from '../components/icons/BillingIcon';
import { CreditIcon } from '../components/icons/CreditIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { PlusIcon } from '../components/icons/PlusIcon';

interface BillingScreenProps {
  user: User;
  // FIX: Updated plan types
  onUpdateSubscription: (plan: 'Freemium' | 'Executive') => void;
  onBuyCredits: (credits: number, cost: number) => void;
  onAddPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  onDeletePaymentMethod: (id: string) => void;
  onNavigate: (view: AppView) => void;
}


const AddPaymentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (method: Omit<PaymentMethod, 'id'>) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 200);
    };

    if (!isOpen && !isClosing) return null;
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Basic validation
        if (cardNumber.length < 15 || expiryDate.length < 4 || cvc.length < 3) {
            alert("Please enter valid card details.");
            return;
        }
        
        // Simple card type detection
        const firstDigit = cardNumber.charAt(0);
        let cardType: 'Visa' | 'Mastercard' | 'Amex' = 'Visa';
        if (firstDigit === '5') cardType = 'Mastercard';
        if (firstDigit === '3') cardType = 'Amex';

        onSave({ cardType, last4: cardNumber.slice(-4), expiryDate });
        handleClose();
    };

    return (
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`} onClick={handleClose}>
            <div className={`bg-gray-950/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-xl w-full max-w-md p-8 ${isClosing ? 'animate-scale-out' : 'animate-scale-in'}`} onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-6">Add New Card</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input type="text" placeholder="Card Number" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full bg-black/20 border border-gray-600 rounded-lg p-3" maxLength={16} />
                    <div className="flex gap-4">
                        <input type="text" placeholder="MM/YY" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="w-full bg-black/20 border border-gray-600 rounded-lg p-3" maxLength={5} />
                        <input type="text" placeholder="CVC" value={cvc} onChange={e => setCvc(e.target.value)} className="w-full bg-black/20 border border-gray-600 rounded-lg p-3" maxLength={4} />
                    </div>
                     <div className="flex items-center justify-end gap-4 mt-4">
                        <button type="button" onClick={handleClose} className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-full">Cancel</button>
                        <button type="submit" className="font-bold py-2 px-5 rounded-full text-gray-900 bg-white btn-bounce">Add Card</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const BillingScreen: React.FC<BillingScreenProps> = (props) => {
  const { user, onUpdateSubscription, onBuyCredits, onAddPaymentMethod, onDeletePaymentMethod, onNavigate } = props;
  const { subscription, credits, billingHistory, paymentMethods } = user;
  // FIX: Updated plan check from 'Pro' to 'Executive'
  const isPro = subscription?.plan === 'Executive';
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="flex-grow container mx-auto p-4 md:p-8">
      <AddPaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={onAddPaymentMethod} />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Billing</h1>
            <button onClick={() => onNavigate('dashboard')} className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-full transition-colors">
              &larr; Back to Dashboard
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-3 space-y-8">
                {/* Current Plan */}
                <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Current Plan</h2>
                   <div className={`p-6 rounded-lg mb-4 ${isPro ? 'bg-purple-500/10 border border-purple-400/30' : 'bg-gray-500/10 border border-gray-400/20'}`}>
                        <div className="flex justify-between items-center">
                            <h3 className={`text-xl font-bold ${isPro ? 'text-purple-300' : 'text-gray-200'}`}>{isPro ? 'Executive Member' : 'Freemium'} Plan</h3>
                            {isPro ? 
                                <button onClick={() => onUpdateSubscription('Freemium')} className="font-semibold py-2 px-4 rounded-full text-sm text-white bg-white/10 hover:bg-white/20 btn-bounce">Downgrade to Freemium</button>
                                :
                                <button onClick={() => onUpdateSubscription('Executive')} className="font-bold py-2 px-4 rounded-full text-sm text-gray-900 bg-gradient-to-r from-purple-300 to-purple-400 hover:opacity-90 btn-bounce">Upgrade to Executive</button>
                            }
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                           {isPro ? `${subscription?.creditsPerMonth} credits per month. Renews on ${new Date(subscription?.nextBillingDate || '').toLocaleDateString()}.` : '5 free credits, refreshed daily.'}
                        </p>
                   </div>
                   <div className="text-center text-sm text-gray-400">
                     Executive Member plan: <span className="font-semibold text-white">$29/month</span> for <span className="font-semibold text-white">500 credits</span>.
                   </div>
                </div>

                {/* Billing History */}
                <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><BillingIcon className="w-6 h-6"/>Billing History</h2>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {(billingHistory && billingHistory.length > 0) ? (
                            billingHistory.slice().reverse().map(item => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg text-sm">
                                    <div>
                                        <p className="font-semibold">{item.description}</p>
                                        <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className="font-bold">${item.amount.toFixed(2)}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-400 py-4">No billing history yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-8">
                {/* Buy Credits */}
                <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg p-6">
                     <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><CreditIcon className="w-5 h-5"/>Buy Credits</h2>
                     <div className="space-y-3">
                        <button onClick={() => onBuyCredits(100, 10)} className="w-full flex justify-between items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors btn-bounce">
                           <span><span className="font-bold">100</span> Credits</span>
                           <span className="font-bold bg-white/10 px-2 py-0.5 rounded-md">$10.00</span>
                        </button>
                        <button onClick={() => onBuyCredits(250, 20)} className="w-full flex justify-between items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors btn-bounce">
                           <span><span className="font-bold">250</span> Credits</span>
                           <span className="font-bold bg-white/10 px-2 py-0.5 rounded-md">$20.00</span>
                        </button>
                     </div>
                </div>

                 {/* Payment Methods */}
                <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-white mb-4">Payment Methods</h2>
                    <div className="space-y-3 mb-4">
                        {(paymentMethods && paymentMethods.length > 0) ? (
                            paymentMethods.map(pm => (
                                <div key={pm.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg text-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs bg-gray-700 p-1 rounded-sm">{pm.cardType.slice(0,4)}</span>
                                        <p>**** {pm.last4}</p>
                                        <p className="text-gray-400">{pm.expiryDate}</p>
                                    </div>
                                    <button onClick={() => onDeletePaymentMethod(pm.id)} className="text-gray-400 hover:text-white"><TrashIcon className="w-4 h-4"/></button>
                                </div>
                            ))
                        ) : (
                             <p className="text-center text-gray-400 text-sm py-2">No payment methods on file.</p>
                        )}
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg text-sm text-white bg-white/10 hover:bg-white/20 transition-colors btn-bounce">
                        <PlusIcon className="w-4 h-4"/> Add New Card
                    </button>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
};
