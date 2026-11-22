import type { CollectionSchema } from 'deepspace/schema'
import { HANDOFF_UPDATES_COLLECTION, HANDOFF_UPDATE_MAX_LENGTH } from '../handoffs'

const analystPermissions = { read: true, create: true, update: false, delete: false }

export const handoffUpdatesSchema: CollectionSchema = {
  name: HANDOFF_UPDATES_COLLECTION,
  columns: [
    { name: 'handoffId', storage: 'text', interpretation: 'plain', required: true, maxLength: 128 },
    { name: 'finding', storage: 'text', interpretation: 'plain', required: true, maxLength: HANDOFF_UPDATE_MAX_LENGTH },
  ],
  permissions: {
    '*': { read: false, create: false, update: false, delete: false },
    member: analystPermissions,
    admin: analystPermissions,
  },
}
