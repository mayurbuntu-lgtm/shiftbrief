import { useMutations, useQuery, useUserLookup } from 'deepspace'
import { useId, useState, type FormEvent } from 'react'
import {
  HANDOFF_RECEIPTS_COLLECTION,
  HANDOFF_UPDATES_COLLECTION,
  HANDOFF_UPDATE_MAX_LENGTH,
  type HandoffReceipt,
  type HandoffUpdate,
} from '../handoffs'
import { Button, Textarea } from './ui'

const dateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default function HandoffActivity({ handoffId }: { handoffId: string }) {
  const inputId = useId()
  const { getName } = useUserLookup()
  const { createConfirmed, ready } = useMutations<HandoffUpdate>(HANDOFF_UPDATES_COLLECTION)
  const updates = useQuery<HandoffUpdate>(HANDOFF_UPDATES_COLLECTION, { where: { handoffId } })
  const receipts = useQuery<HandoffReceipt>(HANDOFF_RECEIPTS_COLLECTION, { where: { handoffId } })
  const [finding, setFinding] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)

  const timeline = [
    ...updates.records.map(({ recordId, createdAt, createdBy, data }) => ({
      id: `update:${recordId}`, createdAt, createdBy, text: data.finding,
    })),
    ...receipts.records.map(({ recordId, createdAt, createdBy }) => ({
      id: `receipt:${recordId}`, createdAt, createdBy, text: 'Marked as seen',
    })),
  ].sort((a, b) => a.createdAt.localeCompare(b.createdAt))

  async function addFinding(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = finding.trim()
    if (!text || !ready || saving) return
    setSaving(true)
    setError(false)
    try {
      await createConfirmed({ handoffId, finding: text })
      setFinding('')
    } catch {
      setError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mt-4 border-t border-border pt-4">
      <h3 className="font-medium">Activity</h3>
      {(updates.status === 'error' || receipts.status === 'error') && (
        <p role="alert" className="text-sm text-destructive">Some activity could not load.</p>
      )}
      {updates.status === 'ready' && receipts.status === 'ready' && timeline.length === 0 && (
        <p className="mt-2 text-sm text-muted-foreground">No activity yet.</p>
      )}
      <ol className="mt-2 space-y-3 text-sm">
        {timeline.map(({ id, createdAt, createdBy, text }) => (
          <li key={id} className="border-l border-border pl-3">
            <p className="whitespace-pre-wrap break-words">{text}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {getName(createdBy) || 'Analyst'} · <time dateTime={createdAt}>{dateFormat.format(new Date(createdAt))}</time>
            </p>
          </li>
        ))}
      </ol>
      <form onSubmit={addFinding} className="mt-4 space-y-2">
        <label htmlFor={inputId} className="block text-sm font-medium">What did you find?</label>
        <Textarea id={inputId} value={finding} required maxLength={HANDOFF_UPDATE_MAX_LENGTH}
          disabled={saving} onChange={(event) => setFinding(event.target.value)} />
        <Button type="submit" size="sm" loading={saving} disabled={!ready || !finding.trim()}>Add update</Button>
        {error && <p role="alert" className="text-sm text-destructive">Could not confirm the update. Check activity before retrying.</p>}
      </form>
    </section>
  )
}
