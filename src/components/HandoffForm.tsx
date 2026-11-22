import { ClipboardList, Shield } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button, Input, Textarea } from './ui'
import { handoffFields, type Handoff } from '../handoffs'

const example = {
  title: 'Repeated failed sign-ins',
  checked: 'Five failed attempts hit the demo account in two minutes.',
  nextAction: 'Check whether any sign-in succeeded afterward.',
}

const emptyNote = { title: '', checked: '', nextAction: '' }

interface HandoffFormProps {
  onSave?: (note: Handoff) => Promise<string>
  ready?: boolean
}

export default function HandoffForm({ onSave, ready }: HandoffFormProps) {
  const [draft, setDraft] = useState(emptyNote)
  const [preview, setPreview] = useState<typeof emptyNote | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function changeDraft(note: Handoff) {
    setDraft(note)
    setPreview(null)
    setSaved(false)
    setError('')
  }

  function previewNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const note = {
      title: draft.title.trim(),
      checked: draft.checked.trim(),
      nextAction: draft.nextAction.trim(),
    }
    if (!note.title || !note.checked || !note.nextAction) {
      setError('Fill in all three fields to preview your note.')
      return
    }
    setError('')
    setPreview(note)
  }

  async function saveNote() {
    if (!preview || !onSave || !ready || saving || saved) return
    setSaving(true)
    setError('')
    try {
      await onSave(preview)
      setSaved(true)
    } catch {
      setError('Could not confirm the save. Check the shared queue before trying again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section aria-labelledby="new-handoff-heading">
      <header className="mb-8">
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-primary">
          <Shield aria-hidden="true" className="size-4" /> ShiftBrief
        </p>
        <h2 id="new-handoff-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">New handoff</h2>
        <p className="mt-2 text-muted-foreground">Leave the next analyst a clear action to take.</p>
      </header>
      <div className="grid items-start gap-5 md:grid-cols-2">
        <form onSubmit={previewNote} className="space-y-5 rounded-xl border border-border bg-card p-5 sm:p-6">
          {handoffFields.map(({ name, label, maxLength }) => {
            const Field = name === 'title' ? Input : Textarea
            return (
              <div key={name} className="space-y-2">
                <label htmlFor={name} className="block text-sm font-medium">{label}</label>
                <Field
                  id={name}
                  name={name}
                  disabled={saving}
                  required
                  maxLength={maxLength}
                  value={draft[name]}
                  onChange={(event) => changeDraft({ ...draft, [name]: event.target.value })}
                />
              </div>
            )
          })}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>Preview note</Button>
            <Button variant="outline" disabled={saving} onClick={() => changeDraft(example)}>
              Try an example
            </Button>
          </div>
        </form>
        <section aria-labelledby="preview-heading" className="rounded-xl border border-border p-5 sm:p-6">
          <h2 id="preview-heading" className="flex items-center gap-2 text-sm font-semibold">
            <ClipboardList aria-hidden="true" className="size-4 text-primary" /> Note preview
          </h2>
          <div aria-live="polite" className="mt-5">
            {preview ? (
              <>
                <h3 className="mb-4 text-xl font-semibold break-words">{preview.title}</h3>
                <dl className="space-y-4 text-sm">
                  <div>
                    <dt className="font-medium">What you checked</dt>
                    <dd className="mt-1 whitespace-pre-wrap break-words text-muted-foreground">{preview.checked}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">Next action</dt>
                    <dd className="mt-1 whitespace-pre-wrap break-words text-muted-foreground">{preview.nextAction}</dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Your note will appear here.</p>
            )}
          </div>
          {onSave && preview && (
            <div className="mt-5">
              <Button onClick={saveNote} disabled={!ready || saved} loading={saving}>Save handoff</Button>
              {saved && <p role="status" className="mt-2 text-sm text-success">Saved to the shared queue.</p>}
            </div>
          )}
          {onSave && !ready && <p className="mt-3 text-sm text-muted-foreground">Waiting for the shared queue to connect.</p>}
        </section>
      </div>
    </section>
  )
}
