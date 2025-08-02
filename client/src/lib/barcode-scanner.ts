export interface ScanResult {
  text: string;
  format: string;
}

export class BarcodeScanner {
  private video: HTMLVideoElement | null = null;
  private stream: MediaStream | null = null;

  async startScanning(): Promise<ScanResult> {
    try {
      // Request camera access
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });

      // Create video element
      this.video = document.createElement("video");
      this.video.srcObject = this.stream;
      this.video.play();

      // For now, return a mock result since we'd need a proper barcode scanning library
      // In a real implementation, you'd use libraries like @zxing/library or QuaggaJS
      return new Promise((resolve) => {
        setTimeout(() => {
          this.stopScanning();
          resolve({
            text: "BT2024001", // Mock batch number
            format: "CODE_128"
          });
        }, 3000);
      });
    } catch (error) {
      throw new Error("Camera access denied or not available");
    }
  }

  stopScanning(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.video) {
      this.video.remove();
      this.video = null;
    }
  }

  isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}

export const barcodeScanner = new BarcodeScanner();
