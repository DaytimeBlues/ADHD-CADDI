import { ViewStyle } from 'react-native';

export interface ThemeTokens {
  colors: {
    neutral: {
      lightest?: string;
      lighter?: string;
      light?: string;
      medium?: string;
      dark: string;
      darker: string;
      darkest: string;
      border?: string;
      borderSubtle?: string;
      [key: string]: string | undefined;
    };
    brand: Record<number | string, string>;
    semantic: {
      primary: string;
      secondary?: string;
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    utility?: Record<string, string>;
    [key: string]: any;
  };
  spacing: Record<number | string, number>;
  radii: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    pill: number;
    [key: string]: number;
  };
  elevation: Record<string, ViewStyle>;
  typography?: any;
  fontSizes?: Record<number | string, number>;
  lineHeights?: Record<string, number>;
  motion?: Record<string, number>;
  [key: string]: any;
}
