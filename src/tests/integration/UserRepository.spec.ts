import { UserRepository } from "../../infrastructure/repository/UserRepository";
import { User } from "../../domain/entity/User";
import { UserRole } from "../../domain/enum/UserRole";
import { Database } from "../../infrastructure/config/DataBase";
import { Phone } from "../../domain/valueObject/Phone";
import { NotFoundError } from "../../exceptions/NotFoundError";
import { PoolConnection } from "mysql2/promise";

describe("UserRepository Integration Tests", () => {
  let userRepository: UserRepository;
  let connection: PoolConnection;

  beforeAll(async () => {
    userRepository = new UserRepository();
    connection = await Database.getConnection();
  });

  afterAll(async () => {
    await connection.release();
  });

  it("should throw NotFoundError when retrieving a non-existing user", async () => {
    await expect(userRepository.getById("999999"))
      .rejects.toThrow(NotFoundError);
  });

  it("should retrieve a user by identification", async () => {
    const user = new User(
      undefined,
      9876543210,
      "Jane Doe",
      UserRole.DRIVER,
      new Phone("1234567890")
    );
    
    const savedUser = await userRepository.save(user);
    const retrievedUser = await userRepository.getByIdentification(9876543210);
    expect(retrievedUser).toBeDefined();
    expect(Number(retrievedUser.getIdentification())).toBe(9876543210);
    expect(retrievedUser.getRole()).toBe(UserRole.DRIVER);
  });
});
