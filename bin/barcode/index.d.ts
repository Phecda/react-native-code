/// <reference types="react" />
export declare type BarCodeFormat =
  | 'CODE39'
  | 'CODE128'
  | 'CODE128A'
  | 'CODE128B'
  | 'CODE128C'
  | 'EAN13'
  | 'EAN8'
  | 'EAN5'
  | 'EAN2'
  | 'UPC'
  | 'UPCE'
  | 'ITF14'
  | 'ITF'
  | 'MSI'
  | 'MSI10'
  | 'MSI11'
  | 'MSI1010'
  | 'MSI1110'
  | 'pharmacode'
  | 'codabar'
  | 'GenericBarcode';
export interface BarCodeProps {
  value: string;
  format?: BarCodeFormat;
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  quietZone?: number;
}
export declare const BarCode: ({
  value,
  width,
  height,
  format,
  color,
  backgroundColor,
  quietZone,
}: BarCodeProps) => JSX.Element;
