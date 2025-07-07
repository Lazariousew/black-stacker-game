
import React from 'react';

interface ModalProps {
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, children }) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 border-4 border-slate-600 rounded-xl p-8 text-center shadow-2xl shadow-black">
        <h2 className="text-4xl font-bold text-cyan-400 mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
