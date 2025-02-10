import { PoolConnection } from "mysql2/promise";
import { Database } from "../../../../infrastructure/config/DataBase";
import { UserRepository } from "../../../../infrastructure/repository/UserRepository";
import { User } from "../../../../domain/entity/User";
import { UserRole } from "../../../../domain/enum/UserRole";
import { DatabaseException } from "../../../../exceptions/DatabaseException";
import { NotFoundError } from "../../../../exceptions/NotFoundError";


jest.mock('../../../../infrastructure/config/DataBase');
const mockGetConnection = Database.getConnection as jest.MockedFunction<typeof Database.getConnection>;

const mockConnection: Partial<PoolConnection> = {
    execute: jest.fn(),
    release: jest.fn(),
};

describe('UserRepository', () => {
    let userRepository: UserRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        mockGetConnection.mockResolvedValue(mockConnection as PoolConnection);
        userRepository = new UserRepository();
    });

    describe('save', () => {

        it('It should throw an InvalidUserRoleException if the role is invalid.', async () => {
            const user = new User('1', 1234567890, 'John Doe', 'INVALID_ROLE' as UserRole);

            await expect(userRepository.save(user)).rejects.toThrow(`Invalid role: ${user.role}`);
        });
    });

    describe('getById', () => {
        it('It should return a CUSTOMER if it exists.', async () => {
            const mockUserData = {
                id: '1',
                identification: 1234567890,
                name: 'John Doe',
                role: UserRole.CUSTOMER,
                phone: '1234567890',
            };

            (mockConnection.execute as jest.Mock)
                .mockResolvedValueOnce([[mockUserData]])
                .mockResolvedValueOnce([[]]);

            const user = await userRepository.getById('1');

            expect(user).toBeInstanceOf(User);
            expect(user?.getRole()).toBe(UserRole.CUSTOMER);
        });

        it('It should throw a NotFoundError if the user does not exist.', async () => {
            (mockConnection.execute as jest.Mock)
                .mockResolvedValueOnce([[]])
                .mockResolvedValueOnce([[]]); 

            await expect(userRepository.getById('999')).rejects.toThrow(NotFoundError);
        });
    });

    describe('getByIdentification', () => {
        it('It should return a DRIVER if it exists.', async () => {
            const mockUserData = {
                id: '1',
                identification: 1234567890,
                name: 'John Doe',
                role: UserRole.DRIVER,
                phone: '1234567890',
            };

            (mockConnection.execute as jest.Mock)
                .mockResolvedValueOnce([[]]) 
                .mockResolvedValueOnce([[mockUserData]]);

            const user = await userRepository.getByIdentification(1234567890);

            expect(user).toBeInstanceOf(User);
            expect(user.getRole()).toBe(UserRole.DRIVER);
        });

        it('It should throw a DatabaseException if there is a connection error.', async () => {
            (mockConnection.execute as jest.Mock).mockRejectedValue(new Error('DB Error'));

            await expect(userRepository.getByIdentification(1234567890)).rejects.toThrow(DatabaseException);
        });
    });
});