import React, { useMemo } from 'react';
import Svg, { Defs, G, Path, Rect, Image, ClipPath } from 'react-native-svg';
import genMatrix from './generateMatrix';
import transformMatrixIntoPath from './transformMatrixIntoPath';
import { ImageSourcePropType } from 'react-native';

export interface LogoProps {
  logo: ImageSourcePropType;
  logoSize: number;
  logoBackgroundColor: string;
  logoMargin: number;
  logoBorderRadius: number;
}

const renderLogo = ({
  size,
  logo,
  logoSize,
  logoBackgroundColor,
  logoMargin,
  logoBorderRadius,
}: LogoProps & { size: number }) => {
  const logoPosition = (size - logoSize - logoMargin * 2) / 2;
  const logoBackgroundSize = logoSize + logoMargin * 2;
  const logoBackgroundBorderRadius =
    logoBorderRadius + (logoMargin / logoSize) * logoBorderRadius;

  return (
    <G x={logoPosition} y={logoPosition}>
      <Defs>
        <ClipPath id="clip-logo-background">
          <Rect
            width={logoBackgroundSize}
            height={logoBackgroundSize}
            rx={logoBackgroundBorderRadius}
            ry={logoBackgroundBorderRadius}
          />
        </ClipPath>
        <ClipPath id="clip-logo">
          <Rect
            width={logoSize}
            height={logoSize}
            rx={logoBorderRadius}
            ry={logoBorderRadius}
          />
        </ClipPath>
      </Defs>
      <G>
        <Rect
          width={logoBackgroundSize}
          height={logoBackgroundSize}
          fill={logoBackgroundColor}
          clipPath="url(#clip-logo-background)"
        />
      </G>
      <G x={logoMargin} y={logoMargin}>
        <Image
          width={logoSize}
          height={logoSize}
          preserveAspectRatio="xMidYMid slice"
          href={logo}
          clipPath="url(#clip-logo)"
        />
      </G>
    </G>
  );
};

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

export const QRCode = ({
  value = 'this is a QR code',
  size = 100,
  color = 'black',
  backgroundColor = 'white',
  logo,
  logoSize = size * 0.2,
  logoBackgroundColor = 'transparent',
  logoMargin = 2,
  logoBorderRadius = 0,
  quietZone = 0,
  ecl = 'M',
  onError,
}: Partial<QRCodeProps & LogoProps>) => {
  const result = useMemo(() => {
    try {
      const matrix = genMatrix(value, ecl);
      return transformMatrixIntoPath(matrix, size);
    } catch (error) {
      if (onError && typeof onError === 'function') {
        onError(error);
      } else {
        // Pass the error when no handler presented
        throw error;
      }
    }
  }, [value, size, ecl, onError]);

  if (!result) {
    return null;
  }

  const { path, cellSize } = result;

  return (
    <Svg
      viewBox={[
        -quietZone,
        -quietZone,
        size + quietZone * 2,
        size + quietZone * 2,
      ].join(' ')}
      width={size}
      height={size}
    >
      <G>
        <Rect
          x={-quietZone}
          y={-quietZone}
          width={size + quietZone * 2}
          height={size + quietZone * 2}
          fill={backgroundColor}
        />
      </G>
      <G>
        <Path d={path} stroke={color} strokeWidth={cellSize} />
      </G>
      {logo &&
        renderLogo({
          size,
          logo,
          logoSize,
          logoBackgroundColor,
          logoMargin,
          logoBorderRadius,
        })}
    </Svg>
  );
};
