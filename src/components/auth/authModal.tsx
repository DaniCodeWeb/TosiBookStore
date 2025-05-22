// src/components/AuthModalManager.tsx
import React, { useState } from 'react';
import LoginModal from './loginModal/loginModal';
import RegisterModal from './registroModal/registroModal';
import RecoverModal from './recuperarContrasena/recuperarContrasena';

type ModalType = 'login' | 'register' | 'recover' | null;

interface AuthModalManagerProps {
  initialModal?: ModalType;
}

export default function AuthModalManager({ initialModal = null }: AuthModalManagerProps) {
  const [currentModal, setCurrentModal] = useState<ModalType>(initialModal);

  const openModal = (modalType: ModalType) => {
    setCurrentModal(modalType);
  };

  const closeModal = () => {
    setCurrentModal(null);
  };

  const switchToLogin = () => {
    setCurrentModal('login');
  };

  const switchToRegister = () => {
    setCurrentModal('register');
  };

  const switchToRecover = () => {
    setCurrentModal('recover');
  };

  // Exponer función globalmente para que el navbar la pueda usar
  if (typeof window !== 'undefined') {
    (window as any).openAuthModal = openModal;
  }

  return (
    <>
      <LoginModal
        isOpen={currentModal === 'login'}
        onClose={closeModal}
        onSwitchToRegister={switchToRegister}
        onSwitchToRecover={switchToRecover}
      />
      
      <RegisterModal
        isOpen={currentModal === 'register'}
        onClose={closeModal}
        onSwitchToLogin={switchToLogin}
      />
      
      <RecoverModal
        isOpen={currentModal === 'recover'}
        onClose={closeModal}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
}