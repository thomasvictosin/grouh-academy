import assert from 'node:assert/strict'
import test from 'node:test'

import { RoleName } from '@/generated/prisma/client'
import {
  DEVELOPMENT_TEST_ROLES,
  getValidatedDevelopmentRole,
} from '@/lib/dev-auth'
import { getAuthorizedHomeRouteForRoles } from '@/lib/supabase/auth'

test('each development role is accepted and nothing else is', () => {
  for (const role of DEVELOPMENT_TEST_ROLES) {
    assert.equal(getValidatedDevelopmentRole(role), role)
  }

  for (const value of ['admin', 'SUPER_ADMIN', '', null, 42]) {
    assert.equal(getValidatedDevelopmentRole(value), null)
  }
})

test('authorized home routes follow the documented role priority', () => {
  assert.equal(
    getAuthorizedHomeRouteForRoles([RoleName.STUDENT]),
    '/student',
  )
  assert.equal(
    getAuthorizedHomeRouteForRoles([RoleName.INTERN]),
    '/internship/dashboard',
  )
  assert.equal(
    getAuthorizedHomeRouteForRoles([RoleName.MENTOR]),
    '/mentor',
  )
  assert.equal(
    getAuthorizedHomeRouteForRoles([RoleName.INSTRUCTOR]),
    '/instructor',
  )
  assert.equal(
    getAuthorizedHomeRouteForRoles([RoleName.ADMIN]),
    '/admin/student',
  )
  assert.equal(
    getAuthorizedHomeRouteForRoles([
      RoleName.STUDENT,
      RoleName.INTERN,
      RoleName.ADMIN,
    ]),
    '/admin/student',
  )
  assert.equal(getAuthorizedHomeRouteForRoles([]), '/student')
})
