import { usePresenceRoom } from 'deepspace'
import { SCOPE_ID } from '../constants'

export default function HandoffViewers({ handoffId }: { handoffId: string }) {
  const { connected, peers } = usePresenceRoom(`${SCOPE_ID}:handoff:${handoffId}`)
  const viewerCount = new Set(peers.map(({ userId }) => userId)).size

  if (!connected) return <p className="mt-3 text-sm text-muted-foreground">Connecting to live viewers…</p>

  return (
    <p role="status" className="mt-3 text-sm text-muted-foreground">
      {viewerCount
        ? `${viewerCount} other ${viewerCount === 1 ? 'analyst' : 'analysts'} viewing`
        : 'Only you are viewing this handoff'}
    </p>
  )
}
