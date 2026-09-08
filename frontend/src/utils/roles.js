export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CHURCH_ADMIN: 'CHURCH_ADMIN',
  CHAIRPERSON: 'CHAIRPERSON',
  SECRETARY: 'SECRETARY',
  MEMBER: 'MEMBER',
}

export const ADMIN_ROLES = [ROLES.SUPER_ADMIN, ROLES.CHURCH_ADMIN]
export const STAFF_ROLES = [ROLES.SUPER_ADMIN, ROLES.CHURCH_ADMIN, ROLES.CHAIRPERSON, ROLES.SECRETARY]
export const JUMUIA_SCOPED_ROLES = [ROLES.CHAIRPERSON, ROLES.SECRETARY]
export const ALL_ROLES = Object.values(ROLES)

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role)
}

export function isStaffRole(role) {
  return STAFF_ROLES.includes(role)
}
