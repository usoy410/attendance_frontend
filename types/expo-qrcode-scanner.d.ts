declare module 'expo-qrcode-scanner' {
  import { ViewStyle } from 'react-native';

  export interface QRCodeScannerProps {
    // Style for the scanner container
    style?: ViewStyle;

    // Callback when a scan is successful
    onScanSuccess?: (data: { type: string; data: string }) => void;

    // Callback when scan fails
    onScanFail?: () => void;

    // Tolerance for centering (default 0.5)
    toleranceFactor?: number;

    // Minimum size for validity (Default 140)
    minSize: number;

    // Maximum size for validity (Default 220)
    maxSize: number;

    // Scan continuously? (default false)
    scanningInfinitely?: boolean;
  }

  const QRCodeScanner: React.FC<QRCodeScannerProps>;
  export default QRCodeScanner;
}
