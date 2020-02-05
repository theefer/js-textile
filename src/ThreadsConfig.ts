import { grpc } from '@improbable-eng/grpc-web'
import { Config } from '@textile/threads-client'

/**
 * WriteTransaction performs a mutating bulk transaction on the underlying store.
 */
export class ThreadsConfig extends Config {
  constructor(
    public token: string,
    public deviceId: string,
    public apiScheme: string = 'https',
    public api: string = 'cloud.textile.io',
    public sessionPort: number = 8006,
    public threadsPort: number = 6007,
    public transport: grpc.TransportFactory = grpc.WebsocketTransport(),
  ) {
    super()
    this.host = `${apiScheme}://${api}:${threadsPort}`
  }
  async start() {
    await this.refreshSession()
  }
  get sessionAPI(): string {
    return `${this.apiScheme}://${this.api}:${this.sessionPort}/register`
  }
  private async refreshSession() {
    const payload: RequestInit = {
      method: 'post',
      body: JSON.stringify({
        token: this.token,
        device_id: this.deviceId,
      }),
    }
    const resp = await fetch(this.sessionAPI, payload)
    if (resp.status === 200) {
      const data = await resp.json()
      console.log(data)
    }
    new Error(resp.statusText)
  }
  _wrapMetadata(values?: { [key: string]: any }): { [key: string]: any } | undefined {
    return super._wrapMetadata(values)
  }
  _wrapBrowserHeaders(values: grpc.Metadata): grpc.Metadata {
    return super._wrapBrowserHeaders(values)
  }
}
