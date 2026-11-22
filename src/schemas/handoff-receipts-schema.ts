import type { CollectionSchema } from 'deepspace/schema'
import { HANDOFF_RECEIPTS_COLLECTION } from '../handoffs'

export const handoffReceiptsSchema: CollectionSchema = {
  name: HANDOFF_RECEIPTS_COLLECTION,
  columns: [
    { name: 'handoffId', storage: 'text', interpretation: 'plain', required: true, maxLength: 128 },
    { name: 'analystId', storage: 'text', interpretation: 'plain', required: true, userBound: true },
  ],
  uniqueOn: ['handoffId', 'analystId'],
  permissions: {
    '*': { read: false, create: false, update: false, delete: false },
    member: { read: true, create: true, update: false, delete: false, writableFields: ['handoffId'] },
    admin: { read: true, create: true, update: false, delete: false, writableFields: ['handoffId'] },
  },
}
