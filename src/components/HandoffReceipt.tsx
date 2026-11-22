import { useAuthUser, useMutations, useQuery } from 'deepspace'
import { useState } from 'react'
import { HANDOFF_RECEIPTS_COLLECTION, type HandoffReceipt } from '../handoffs'
import { Button } from './ui'

export default function HandoffReceiptStatus({ handoffId }: { handoffId: string }) {
  const { user } = useAuthUser()
  const { createConfirmed, ready } = useMutations<HandoffReceipt>(HANDOFF_RECEIPTS_COLLECTION)
  const { records, status } = useQuery<HandoffReceipt>(HANDOFF_RECEIPTS_COLLECTION, {
    where: { handoffId },
  })
  const [saving, setSaving] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState(false)
  const seenByMe = confirmed || records.some(({ data }) => data.analystId === user?.id)

  async function markSeen() {
    setSaving(true)
    setError(false)
    try {
      await createConfirmed({ handoffId })
      setConfirmed(true)
    } catch {
      setError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-4 border-t border-border pt-3 text-sm">
      {status === 'loading' && <p role="status">Checking acknowledgments…</p>}
      {status === 'error' && <p role="alert">Acknowledgments could not load.</p>}
      {status === 'ready' && (
        <p className="mb-2 text-muted-foreground" role="status">
          {records.length === 0
            ? 'No acknowledgments yet.'
            : `Seen by ${records.length} ${records.length === 1 ? 'analyst' : 'analysts'}.`}
        </p>
      )}
      {seenByMe
        ? <p className="text-success" role="status">You marked this as seen.</p>
        : <Button size="sm" onClick={markSeen} loading={saving} disabled={!user || !ready || status !== 'ready'}>
            Mark as seen
          </Button>}
      {error && !seenByMe && <p role="alert" className="mt-2 text-destructive">Could not confirm the acknowledgment. Check again before retrying.</p>}
    </div>
  )
}
