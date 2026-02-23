export const config = {
  runtime: 'edge',
}

export default function handler(req: Request) {
  if (req.headers.get('upgrade') !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 })
  }

  const { socket, response } = (globalThis as any).upgradeWebSocket(req)

  socket.addEventListener('open', () => {
    console.log('WebSocket connected')
  })

  socket.addEventListener('message', (event: any) => {
    socket.send(
      JSON.stringify({
        type: 'echo',
        message: event.data,
      })
    )
  })

  socket.addEventListener('close', () => {
    console.log('WebSocket closed')
  })

  return response
}
