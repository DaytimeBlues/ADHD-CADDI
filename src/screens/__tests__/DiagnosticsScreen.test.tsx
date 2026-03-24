import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { fireEvent, render } from '@testing-library/react-native';
import DiagnosticsScreen from '../DiagnosticsScreen';

const mockRefreshDiagnostics = jest.fn(async () => undefined);
const mockExportBackup = jest.fn(async () => undefined);
const mockImportBackup = jest.fn(async () => undefined);
const mockSetBackupJson = jest.fn((_value: string) => undefined);
const mockSetImportMode = jest.fn((_mode: 'overwrite' | 'merge') => undefined);
const mockSelectTheme = jest.fn(
  async (_variant: 'linear' | 'cosmic') => undefined,
);
const mockSetTutorialsEnabled = jest.fn((_enabled: boolean) => undefined);
const mockResetTutorialProgress = jest.fn(() => undefined);

jest.mock('../diagnostics/hooks/useDiagnosticsData', () => ({
  useDiagnosticsData: () => ({
    diagnostics: [{ label: 'Platform', value: 'web', status: 'info' }],
    isRefreshing: false,
    refreshDiagnostics: mockRefreshDiagnostics,
  }),
}));

jest.mock('../diagnostics/hooks/useBackupManager', () => ({
  useBackupManager: () => ({
    backupJson: '{"schema":"spark-backup-v1"}',
    setBackupJson: mockSetBackupJson,
    isBackupBusy: false,
    backupStatus: '',
    importMode: 'overwrite',
    setImportMode: mockSetImportMode,
    lastBackupExportAt: null,
    exportBackup: mockExportBackup,
    importBackup: mockImportBackup,
    refreshLastBackupExportAt: jest.fn(),
  }),
}));

jest.mock('../diagnostics/hooks/useThemeSwitcher', () => ({
  useThemeSwitcher: () => ({
    variant: 'linear',
    themeOptions: [
      {
        variant: 'linear',
        label: 'Linear',
        description: 'Linear mode',
        preview: { background: '#000000', accent: '#ffffff' },
        selected: true,
      },
      {
        variant: 'cosmic',
        label: 'Cosmic',
        description: 'Cosmic mode',
        preview: { background: '#111111', accent: '#eeeeee' },
        selected: false,
      },
    ],
    selectTheme: mockSelectTheme,
  }),
}));

jest.mock('../diagnostics/hooks/useTutorialSettings', () => ({
  useTutorialSettings: () => ({
    tutorialsEnabled: true,
    setTutorialsEnabled: mockSetTutorialsEnabled,
    resetTutorialProgress: mockResetTutorialProgress,
  }),
}));

jest.mock('../../ui/cosmic', () => {
  const { TouchableOpacity, View } = require('react-native');

  return {
    CosmicBackground: ({ children }: { children: React.ReactNode }) => (
      <View>{children}</View>
    ),
    GlowCard: ({
      children,
      onPress,
      accessibilityLabel,
      accessibilityRole,
      accessibilityState,
    }: {
      children: React.ReactNode;
      onPress?: () => void;
      accessibilityLabel?: string;
      accessibilityRole?: string;
      accessibilityState?: Record<string, boolean>;
    }) => (
      <TouchableOpacity
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
      >
        {children}
      </TouchableOpacity>
    ),
  };
});

describe('DiagnosticsScreen', () => {
  beforeEach(() => {
    mockRefreshDiagnostics.mockResolvedValue(undefined);
    mockExportBackup.mockResolvedValue(undefined);
    mockImportBackup.mockResolvedValue(undefined);
    mockSelectTheme.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders sections and wires interactions', () => {
    const view = render(
      <NavigationContainer>
        <DiagnosticsScreen />
      </NavigationContainer>,
    );

    expect(view.getByText('SYSTEM STATUS')).toBeTruthy();
    expect(view.getByText('SETUP INSTRUCTIONS')).toBeTruthy();
    expect(view.getByText('GUIDED HELP')).toBeTruthy();
    expect(view.getByText('DATA BACKUP')).toBeTruthy();
    expect(view.getByText('APPEARANCE')).toBeTruthy();

    fireEvent.press(view.getByLabelText('Go back'));
    fireEvent.press(view.getByLabelText('Refresh diagnostics'));
    fireEvent(
      view.getByTestId('tutorials-enabled-toggle'),
      'valueChange',
      false,
    );
    fireEvent.press(view.getByTestId('tutorials-reset-progress'));
    fireEvent.press(view.getByTestId('diagnostics-export-backup'));
    fireEvent.press(view.getByTestId('diagnostics-import-backup'));
    fireEvent.press(view.getByLabelText('Select Linear theme'));

    // Verify navigation was called (using the exported mock object)
    const { mockNavigation } = require('../../../__tests__/setup');
    expect(mockNavigation.goBack).toHaveBeenCalledTimes(1);

    expect(mockRefreshDiagnostics).toHaveBeenCalledTimes(1);
    expect(mockSetTutorialsEnabled).toHaveBeenCalledWith(false);
    expect(mockResetTutorialProgress).toHaveBeenCalledTimes(1);
    expect(mockExportBackup).toHaveBeenCalledTimes(1);
    expect(mockImportBackup).toHaveBeenCalledTimes(1);
    expect(mockSelectTheme).toHaveBeenCalledWith('linear');
  });
});
