/**
 * Calendar connection status hook
 */

import { useState, useEffect, useCallback } from 'react';
import { GoogleTasksSyncService } from '../../services/GoogleTasksSyncService';
import { isWeb } from '../../utils/PlatformUtils';

export type CalendarConnectionStatus =
  | 'checking'
  | 'connected'
  | 'disconnected'
  | 'unsupported';

export const useCalendarConnection = () => {
  const [connectionStatus, setConnectionStatus] =
    useState<CalendarConnectionStatus>('checking');
  const [isConnecting, setIsConnecting] = useState(false);

  const refreshStatus = useCallback(async () => {
    if (isWeb) {
      setConnectionStatus('unsupported');
      return;
    }

    const scopes = await GoogleTasksSyncService.getCurrentUserScopes();
    const hasCalendarScope = Boolean(
      scopes?.includes('https://www.googleapis.com/auth/calendar.events'),
    );
    setConnectionStatus(hasCalendarScope ? 'connected' : 'disconnected');
  }, []);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const handleConnect = useCallback(async () => {
    if (
      connectionStatus === 'unsupported' ||
      connectionStatus === 'checking' ||
      isConnecting
    ) {
      return;
    }

    setIsConnecting(true);
    try {
      await GoogleTasksSyncService.signInInteractive();
    } finally {
      await refreshStatus();
      setIsConnecting(false);
    }
  }, [connectionStatus, isConnecting, refreshStatus]);

  const statusText: Record<CalendarConnectionStatus, string> = {
    checking: 'STATUS: CHECKING...',
    connected: 'STATUS: CONNECTED',
    disconnected: 'STATUS: NOT CONNECTED',
    unsupported: 'STATUS: NOT AVAILABLE ON WEB',
  };

  const buttonText: Record<CalendarConnectionStatus, string> = {
    checking: 'CHECKING...',
    connected: 'CONNECTED',
    disconnected: 'CONNECT GOOGLE CALENDAR',
    unsupported: 'WEB UNSUPPORTED',
  };

  const isButtonDisabled =
    connectionStatus === 'connected' ||
    connectionStatus === 'unsupported' ||
    connectionStatus === 'checking' ||
    isConnecting;

  return {
    connectionStatus,
    isConnecting,
    statusText: statusText[connectionStatus],
    buttonText: buttonText[connectionStatus],
    isButtonDisabled,
    handleConnect,
    refreshStatus,
  };
};
