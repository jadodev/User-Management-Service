import { Pool, PoolConnection } from "mysql2/promise";
import { Phone } from "../../domain/valueObject/Phone";
import { User } from "../../domain/entity/User";
import { UserRole } from "../../domain/enum/UserRole";

export class Database {
  private static pool: Pool;

  static async initialize() {
    if (!this.pool) {
      const mysql = require("mysql2/promise");
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
        database: process.env.DB_NAME || "user_service",
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      await this.createTables();
    }
  }

  static async getConnection(): Promise<PoolConnection> {
    if (!this.pool) {
      await this.initialize();
    }
    return await this.pool.getConnection();
  }

  private static async createTables() {
    const connection = await this.getConnection();
    try {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS customers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          identification VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NULL
        )
      `);
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS drivers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          identification VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NULL
        )
      `);
    } catch (error) {
      console.error("Error creating tables:", error);
    } finally {
      connection.release();
    }
  }
}

export class UserRepository {
  async save(user: User): Promise<User> {
    const connection: PoolConnection = await Database.getConnection();

    const userData = {
      identification: user.getIdentification(),
      name: user.getName(),
      phone: user.getPhone() || null,
    };

    const tableName = user.getRole() === UserRole.CUSTOMER ? "customers" : "drivers";

    try {
      const [result]: any = await connection.execute(
        `INSERT INTO ${tableName} (identification, name, phone) 
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
         name = VALUES(name), 
         phone = VALUES(phone)`,
        [userData.identification, userData.name, userData.phone]
      );

      if (!user.getId() && result.insertId) {
        user = new User(
          result.insertId,
          user.getIdentification(),
          user.getName(),
          user.getRole(),
          user.getPhone() ? new Phone(user.getPhone()) : undefined
        );
      }
    } catch (err) {
      console.error("Error saving user:", err);
      throw new Error("Error saving user");
    } finally {
      connection.release();
    }

    return user;
  }
}
