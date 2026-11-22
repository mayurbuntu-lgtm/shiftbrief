import type { CollectionSchema } from 'deepspace/schema'
import { HANDOFFS_COLLECTION, handoffFields } from '../handoffs'

export const handoffsSchema: CollectionSchema = {
  name: HANDOFFS_COLLECTION,
  columns: handoffFields.map(({ name, maxLength }) => ({
    name,
    maxLength,
    storage: 'text',
    interpretation: 'plain',
    required: true,
  })),
  permissions: {
    '*': { read: false, create: false, update: false, delete: false },
    member: { read: true, create: true, update: false, delete: false },
    admin: { read: true, create: true, update: false, delete: false },
  },
}
