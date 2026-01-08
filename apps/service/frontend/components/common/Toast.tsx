'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
  showComingSoon: (feature?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showToast = useCallback((message: string, severity: AlertColor = 'info') => {
    setToast({ open: true, message, severity });
  }, []);

  const showComingSoon = useCallback((feature?: string) => {
    const message = feature
      ? `${feature} 기능은 준비 중입니다`
      : '이 기능은 준비 중입니다';
    setToast({ open: true, message, severity: 'info' });
  }, []);

  const handleClose = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, showComingSoon }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 80, sm: 24 } }}
      >
        <Alert
          onClose={handleClose}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
