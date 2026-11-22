import { useMutations, useQuery } from 'deepspace'
import { useState } from 'react'
import HandoffActivity from '../../../components/HandoffActivity'
import HandoffReceiptStatus from '../../../components/HandoffReceipt'
import HandoffViewers from '../../../components/HandoffViewers'
import HandoffForm from '../../../components/HandoffForm'
import { HANDOFFS_COLLECTION, type Handoff } from '../../../handoffs'

export default function HandoffsPage() {
  const { createConfirmed, ready } = useMutations<Handoff>(HANDOFFS_COLLECTION)
  const { records, status } = useQuery<Handoff>(HANDOFFS_COLLECTION, {
    orderBy: 'createdAt',
    orderDir: 'desc',
    limit: 50,
  })

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-10">
      <h1 className="mb-2 text-xl font-semibold">Shared queue</h1>
      <p className="mb-8 text-sm text-muted-foreground">Demo workspace. Use fictional security cases here.</p>
      <HandoffForm onSave={createConfirmed} ready={ready} />

      <section aria-labelledby="recent-handoffs" className="mt-10">
        <h2 id="recent-handoffs" className="mb-4 text-xl font-semibold">Recent handoffs</h2>
        {status === 'loading' && <p role="status">Loading handoffs…</p>}
        {status === 'error' && <p role="alert">The shared queue could not load.</p>}
        {status === 'ready' && records.length === 0 && <p>No handoffs yet.</p>}
        <ul className="space-y-3">
          {records.map(({ recordId, data }) => (
            <HandoffCard key={recordId} recordId={recordId} data={data} />
          ))}
        </ul>
      </section>
    </div>
  )
}

function HandoffCard({ recordId, data }: { recordId: string; data: Handoff }) {
  const [opened, setOpened] = useState(false)
  return (
    <li className="rounded-xl border border-border bg-card p-4">
      <details onToggle={(event) => setOpened(event.currentTarget.open)}>
        <summary className="cursor-pointer font-medium break-words">{data.title}</summary>
        <dl className="mt-3 space-y-3 text-sm break-words">
          <div>
            <dt className="font-medium">What you checked</dt>
            <dd className="whitespace-pre-wrap text-muted-foreground">{data.checked}</dd>
          </div>
          <div>
            <dt className="font-medium">Next action</dt>
            <dd className="whitespace-pre-wrap text-muted-foreground">{data.nextAction}</dd>
          </div>
        </dl>
        {opened && (
          <>
            <HandoffViewers handoffId={recordId} />
            <HandoffReceiptStatus handoffId={recordId} />
            <HandoffActivity handoffId={recordId} />
          </>
        )}
      </details>
    </li>
  )
}
