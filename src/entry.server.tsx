import { createReadableStreamFromReadable } from '@react-router/node'
import type { AppLoadContext, EntryContext } from 'react-router'
import { renderToPipeableStream } from 'react-dom/server'
import { PassThrough } from 'node:stream'
import { ServerRouter } from 'react-router'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  void _loadContext
  return new Promise<Response>((resolve, reject) => {
    let shellRendered = false
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={remixContext} url={request.url} />,
      {
        onShellReady() {
          shellRendered = true
          const body = new PassThrough()
          responseHeaders.set('Content-Type', 'text/html')
          resolve(new Response(createReadableStreamFromReadable(body), {
            headers: responseHeaders,
            status: responseStatusCode,
          }))
          pipe(body)
        },
        // oxlint-disable-next-line anti-slop/no-unknown-parameters -- React's server renderer supplies unknown thrown values.
        onShellError(error: unknown) {
          reject(error instanceof Error ? error : new Error(String(error)))
        },
        // oxlint-disable-next-line anti-slop/no-unknown-parameters -- React's server renderer supplies unknown thrown values.
        onError(error: unknown) {
          if (shellRendered) console.error(error instanceof Error ? error : new Error(String(error)))
        },
      },
    )
    setTimeout(abort, 5000)
  })
}
