/**
 * for user
 */

export enum Roles {
  ADMIN = 'ADMIN',
  AUTHOR = 'AUTHOR',
}

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

/**
 * for post resource
 */
export enum PostStateEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}
