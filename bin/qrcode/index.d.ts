/// <reference types="react" />
import { ImageSourcePropType } from 'react-native';
export interface LogoProps {
  logo: ImageSourcePropType;
  logoSize: number;
  logoBackgroundColor: string;
  logoMargin: number;
  logoBorderRadius: number;
}
export interface QRCodeProps {
  value: string;
  size: number;
  color: string;
  backgroundColor: string;
  quietZone: number;
  ecl: 'low' | 'medium' | 'quartile' | 'high' | 'L' | 'M' | 'Q' | 'H';
  /**
   * should wrapped in useCallback
   */
  onError: (error: any) => void;
}
export declare const QRCode: ({
  value,
  size,
  color,
  backgroundColor,
  logo,
  logoSize,
  logoBackgroundColor,
  logoMargin,
  logoBorderRadius,
  quietZone,
  ecl,
  onError,
}: Partial<QRCodeProps & LogoProps>) => JSX.Element | null;
