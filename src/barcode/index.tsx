import React, { useState, useEffect } from 'react';
import Svg, { Path, G, Rect } from 'react-native-svg';
import JSBarCode from 'jsbarcode';

export type BarCodeFormat =
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

export const BarCode = ({
  value,
  width = 100,
  height = 50,
  format,
  color = 'black',
  backgroundColor = 'white',
  quietZone = 0,
}: BarCodeProps) => {
  const [path, setPath] = useState('');

  useEffect(() => {
    const cache = { encodings: [{ data: '' }] };
    JSBarCode(cache, value, { format });
    const data = cache.encodings[0].data;

    const unitSize = width / data.length;
    let needDraw = false;
    let localPath = '';
    for (let index = 0; index < data.length; index++) {
      const unit = data[index] as '0' | '1';
      if (unit === '1') {
        if (!needDraw) {
          localPath += `M${index * unitSize} ${height / 2}`;
          needDraw = true;
        }
        if (needDraw && index === data.length - 1) {
          localPath += `H${data.length * unitSize}`;
        }
      } else if (needDraw) {
        localPath += `H${index * unitSize} `;
        needDraw = false;
      }
    }
    setPath(localPath);
  }, [value, width, format, height]);

  return (
    <Svg
      viewBox={[
        -quietZone,
        -quietZone,
        width + quietZone * 2,
        height + quietZone * 2,
      ].join(' ')}
      width={width}
      height={height}
    >
      <Rect
        fill={backgroundColor}
        x={-quietZone}
        y={-quietZone}
        width={width + quietZone * 2}
        height={height + quietZone * 2}
      />
      <G>
        <Path d={path} strokeWidth={height} stroke={color} />
      </G>
    </Svg>
  );
};
