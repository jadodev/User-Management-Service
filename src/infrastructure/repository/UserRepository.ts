import { UserInterfacePortOut } from "../../domain/port/out/UserInterfacePortOut";
import { User } from "../../domain/entity/User";
import { UserBuilder } from "../../domain/builder/UserBuilder";
import { UserRole } from "../../domain/enum/UserRole";
import { Database } from "../config/DataBase";
import { PoolConnection } from "mysql2/promise";
import { Phone } from "../../domain/valueObject/Phone";
import { InvalidUserRoleException } from "../../exceptions/InvalidRoleError";
import { NotFoundError } from "../../exceptions/NotFoundError";
import { DatabaseException } from "../../exceptions/DatabaseException";

export class UserRepository implements UserInterfacePortOut {
  
  async save(user: User): Promise<User> {
    const connection: PoolConnection = await Database.getConnection();
    
    const userData = {
        identification: user.getIdentification(),
        name: user.getName(),
        role: user.getRole(),
        phone: user.getPhone() || null,
    };

    if (![UserRole.CUSTOMER, UserRole.DRIVER].includes(userData.role)) {
        throw new InvalidUserRoleException(`Invalid role: ${userData.role}`);
    }

    const tableName = user.getRole() === UserRole.CUSTOMER ? "customers" : "drivers";

    try {
        await connection.execute(
            `INSERT INTO ${tableName} (identification, name, phone) 
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE
             name = VALUES(name), 
             phone = VALUES(phone)`,
            [userData.identification, userData.name, userData.phone]
        );

        if (!user.getId()) {
            const [rows]: any[] = await connection.execute("SELECT LAST_INSERT_ID() AS id");
            const newId = rows[0].id.toString();
            user = new User(
                newId,
                user.getIdentification(),
                user.getName(),
                user.getRole(),
                user.getPhone() ? new Phone(user.getPhone()) : undefined
            );
        }

    } catch (err) {
        console.error("Error saving user:", err);
        throw new DatabaseException("Error saving user");
    } finally {
        connection.release();
    }

    return user;
}

  async getById(id: string): Promise<User | null> {
    const connection: PoolConnection = await Database.getConnection();
    let user: User | null = null;

    try {  
      const [customerRows]: any[] = await connection.execute(
        'SELECT *, "CUSTOMER" AS role FROM customers WHERE id = ?',
        [id]
      );

      const [driverRows]: any[] = await connection.execute(
        'SELECT *, "DRIVER" AS role FROM drivers WHERE id = ?',
        [id]
      );

      const userData = customerRows.length > 0 ? customerRows[0] : driverRows.length > 0 ? driverRows[0] : null;

      if (!userData) {
        throw new NotFoundError(`User with identification ${id} not found`);
      }

      const builder = new UserBuilder()
        .setId(userData.id)
        .setIdentification(userData.identification)
        .setName(userData.name)
        .setRole(userData.role as UserRole)
        .setPhone(userData.phone || null);

      user = builder.build();
      
    } catch (err) {
      throw new NotFoundError('Error retrieving user');
    } finally {
      connection.release();
    }

    return user;
  }

  async getByIdentification(identification: number | string): Promise<User> {
    const connection: PoolConnection = await Database.getConnection();

    try {
      const [customerRows]: any[] = await connection.execute(
        'SELECT *, "CUSTOMER" AS role FROM customers WHERE identification = ? LIMIT 1',
        [identification]
      );

      const [driverRows]: any[] = await connection.execute(
        'SELECT *, "DRIVER" AS role FROM drivers WHERE identification = ? LIMIT 1',
        [identification]
      );

      const userData = customerRows.length > 0 ? customerRows[0] : driverRows.length > 0 ? driverRows[0] : null;

      if (!userData) {
        throw new NotFoundError(`User with identification ${identification} not found`);
      }

      return new UserBuilder()
        .setId(userData.id)
        .setIdentification(userData.identification)
        .setName(userData.name)
        .setRole(userData.role as UserRole)
        .setPhone(userData.phone || null)
        .build();
        
    } catch (err) {
      if (!(err instanceof NotFoundError)) {
        throw new DatabaseException("Error retrieving user by identification");
      }
      throw err;
    } finally {
      connection.release();
    }
  }
}