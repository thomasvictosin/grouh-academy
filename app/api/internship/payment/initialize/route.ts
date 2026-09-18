// The acceptance path is retained as a backwards-compatible alias. Keeping
// one implementation prevents the public, client-supplied email/price flow
// from diverging from the authenticated application payment lifecycle.
export { POST } from '../acceptance/initialize/route'
