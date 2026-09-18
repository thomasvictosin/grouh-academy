// One-off diagnostic: measures raw connection time and query time
// against Postgres directly via the `pg` driver, with no Prisma layer
// involved at all. This isolates "is it the network/database" from
// "is it something in our app code or Prisma configuration."
//
// Run against each URL separately to compare the pooler vs. direct
// connection:
//
//   node --env-file=.env scripts/db-latency-check.mjs DATABASE_URL
//   node --env-file=.env scripts/db-latency-check.mjs DIRECT_URL
//
// (If --env-file isn't supported by your Node version, run
// `npm install dotenv` once and use:
//   node -r dotenv/config scripts/db-latency-check.mjs DATABASE_URL
// instead.)

import { Client } from 'pg'

const envVarName = process.argv[2] ?? 'DATABASE_URL'
const connectionString = process.env[envVarName]

if (!connectionString) {
  console.error(`${envVarName} is not set.`)
  process.exit(1)
}

async function main() {
  console.log(`Testing ${envVarName}...`)

  const client = new Client({ connectionString })

  const t0 = Date.now()
  await client.connect()
  const t1 = Date.now()

  await client.query('SELECT 1')
  const t2 = Date.now()

  await client.end()

  console.log(`Connect time: ${t1 - t0}ms`)
  console.log(`Query time:   ${t2 - t1}ms`)
  console.log(`Total:        ${t2 - t0}ms`)
}

main().catch((error) => {
  console.error('Failed:', error)
  process.exit(1)
})
