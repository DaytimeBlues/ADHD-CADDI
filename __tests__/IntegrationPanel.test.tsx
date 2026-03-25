import React from 'react';
import { render, screen, waitFor } from '@testing-library/react-native';
import { IntegrationPanel } from '../src/components/brain-dump/IntegrationPanel';

const mockGetGoogleAuth = jest.fn();
const mockGetTodoistAuth = jest.fn();

jest.mock('../src/services/OAuthService', () => ({
  OAuthService: {
    getGoogleAuth: (...args: unknown[]) => mockGetGoogleAuth(...args),
    getTodoistAuth: (...args: unknown[]) => mockGetTodoistAuth(...args),
    initiateGoogleAuth: jest.fn(),
    initiateTodoistAuth: jest.fn(),
    disconnectGoogle: jest.fn(),
    disconnectTodoist: jest.fn(),
  },
}));

jest.mock('../src/services/LoggerService', () => ({
  LoggerService: {
    error: jest.fn(),
  },
}));

describe('IntegrationPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetGoogleAuth.mockResolvedValue(null);
    mockGetTodoistAuth.mockResolvedValue(null);
  });

  it('renders branded logos for Google and Todoist', async () => {
    render(<IntegrationPanel />);

    await waitFor(() => {
      expect(screen.getByLabelText('Google logo')).toBeTruthy();
      expect(screen.getByLabelText('Todoist logo')).toBeTruthy();
    });
  });

  it('shows connect actions when providers are disconnected', async () => {
    render(<IntegrationPanel />);

    await waitFor(() => {
      expect(screen.getByTestId('google-connect-btn')).toBeTruthy();
      expect(screen.getByTestId('todoist-connect-btn')).toBeTruthy();
    });
  });
});
