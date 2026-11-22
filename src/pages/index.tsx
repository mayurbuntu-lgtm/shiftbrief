import { Link } from 'react-router-dom'
import HandoffForm from '../components/HandoffForm'
import { Seo } from '../components/Seo'
import { seo } from '../seo'

export default function Landing() {
  return (
    <>
      <Seo {...seo} path="/" />
      <main data-testid="static-landing" className="mx-auto max-w-5xl px-5 py-10 sm:px-10 sm:py-16">
        <Link to="/handoffs" className="mb-5 inline-block text-sm font-medium text-primary underline">
          Open shared queue
        </Link>
        <HandoffForm />
      </main>
    </>
  )
}
