export const HANDOFFS_COLLECTION = 'handoffs'

export type Handoff = {
  title: string
  checked: string
  nextAction: string
}

export const handoffFields = [
  { name: 'title', label: 'Case title', maxLength: 100 },
  { name: 'checked', label: 'What you checked', maxLength: 1000 },
  { name: 'nextAction', label: 'Next action', maxLength: 500 },
] as const

export const HANDOFF_RECEIPTS_COLLECTION = 'handoffReceipts'

export type HandoffReceipt = {
  handoffId: string
  analystId?: string
}

export const HANDOFF_UPDATES_COLLECTION = 'handoffUpdates'
export const HANDOFF_UPDATE_MAX_LENGTH = 1000

export type HandoffUpdate = {
  handoffId: string
  finding: string
}
