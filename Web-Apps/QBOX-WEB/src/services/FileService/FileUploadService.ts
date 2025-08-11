export default class FileUploadService {
  private socket: WebSocket | null = null;
  private webSocketHost: string;
  private readonly TIMEOUT_MS = 30000; // 30 second timeout

  constructor(host?: string) {
    this.webSocketHost = host || `ws://40.81.234.172:8916`;
    // this.webSocketHost = host || `ws://192.168.1.38:8916`;
  }

  private createWebSocketConnection(url: string): Promise<WebSocket> {

    return new Promise((resolve, reject) => {
      const socket = new WebSocket(url);
      socket.binaryType = 'arraybuffer';

      const timeout = setTimeout(() => {
        socket.close();
        reject(new Error('Connection timeoutss'));
      }, this.TIMEOUT_MS);

      socket.onopen = () => {
        clearTimeout(timeout);
        console.log('WebSocket connection opened');
        resolve(socket);
      };

      socket.onerror = (error) => {
        clearTimeout(timeout);
        console.error('WebSocket error:', error);
        reject(new Error('WebSocket connection failed'));
      };
    });
  }

  async send(files: FileList, callback: (uploadList: any[], error?: string) => void): Promise<void> {
    if (!files.length) {
      callback([], 'No files selected');
      return;
    }

    try {
      console.log('files selected');
      const socket = await this.createWebSocketConnection(`${this.webSocketHost}/api/v1/file_upload`);
      this.socket = socket;
      console.log(this.socket);
      // Set up message handler before sending files
      const uploadComplete = new Promise<any[]>((resolve, reject) => {
        const messageTimeout = setTimeout(() => {
          reject(new Error('Response timeout'));
        }, this.TIMEOUT_MS);

        if (socket) {
          socket.onmessage = (event) => {
            try {
              clearTimeout(messageTimeout);
              if (!event.data) {
                reject(new Error('Empty response received'));
                return;
              }

              const response = JSON.parse(event.data);
              if (!Array.isArray(response)) {
                reject(new Error('Invalid response format'));
                return;
              }

              resolve(response);
            } catch (parseError) {
              reject(new Error(`Failed to parse response: ${(parseError as Error).message}`));
            }
          };

          socket.onclose = () => {
            clearTimeout(messageTimeout);
            reject(new Error('Connection closed before receiving response'));
          };
        }
      });

      // Send the number of files
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(files.length.toString());

        // Send each file
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const arrayBuffer = await this.readFileAsync(file);
          socket.send(arrayBuffer);
          console.log(`Sent file ${i + 1} of ${files.length}`);
        }

        // Wait for response
        const uploadList = await uploadComplete;
        callback(uploadList);
      } else {
        throw new Error('WebSocket is not in OPEN state');
      }

    } catch (error) {
      console.error('Upload error:', error);
      callback([], (error as Error).message);
    } finally {
      this.close();
    }
  }

  private readFileAsync(file: File): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      const timeout = setTimeout(() => {
        reader.abort();
        reject(new Error('File reading timeout'));
      }, this.TIMEOUT_MS);

      reader.onload = () => {
        clearTimeout(timeout);
        const result = reader.result as ArrayBuffer;
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Failed to read file: empty result'));
        }
      };

      reader.onerror = () => {
        clearTimeout(timeout);
        reject(new Error(`Failed to read file: ${file.name}`));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  close(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}