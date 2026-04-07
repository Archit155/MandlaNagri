// Maps roles to specific permissions
const ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
  USER: 'user'
};

const PERMISSIONS = {
  CREATE_ARTICLE: 'create_article',
  EDIT_ARTICLE: 'edit_article',
  DELETE_ARTICLE: 'delete_article',
  GENERATE_INVITE: 'generate_invite'
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.CREATE_ARTICLE,
    PERMISSIONS.EDIT_ARTICLE,
    PERMISSIONS.DELETE_ARTICLE,
    PERMISSIONS.GENERATE_INVITE
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.CREATE_ARTICLE,
    PERMISSIONS.EDIT_ARTICLE
  ],
  [ROLES.USER]: [] // Read-only via public endpoints
};

module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS
};
