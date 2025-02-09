export class InvalidUserRoleException extends Error {
    constructor(role: string) {
      super(`Invalid user role: ${role}`);
      this.name = "InvalidRoleError";
    }
  }
  