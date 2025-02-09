import { UserRepository } from '../../../infrastructure/repository/UserRepository';
import { User } from '../../domain/entity/User';
import { UserRole } from '../../domain/enum/UserRole';
import { Database } from '../../../infrastructure/config/DataBase';
import { InvalidUserRoleException } from '../../../exceptions/InvalidRoleError';
import { NotFoundError } from '../../../exceptions/NotFoundError';
import { DatabaseException } from '../../../exceptions/DatabaseException';
import { PoolConnection } from 'mysql2/promise';

jest.mock('../../../infrastructure/config/DataBase');
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

        it('debe lanzar InvalidUserRoleException si el rol es inválido', async () => {
            const user = new User('1', 1234567890, 'John Doe', 'INVALID_ROLE' as UserRole);

            await expect(userRepository.save(user)).rejects.toThrow(InvalidUserRoleException);
        });
    });

    describe('getById', () => {
        it('debe retornar un CUSTOMER si existe', async () => {
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

        it('debe lanzar NotFoundError si el usuario no existe', async () => {
            (mockConnection.execute as jest.Mock)
                .mockResolvedValueOnce([[]])
                .mockResolvedValueOnce([[]]); 

            await expect(userRepository.getById('999')).rejects.toThrow(NotFoundError);
        });
    });

    describe('getByIdentification', () => {
        it('debe retornar un DRIVER si existe', async () => {
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

        it('debe lanzar DatabaseException si hay un error de conexión', async () => {
            (mockConnection.execute as jest.Mock).mockRejectedValue(new Error('DB Error'));

            await expect(userRepository.getByIdentification(1234567890)).rejects.toThrow(DatabaseException);
        });
    });
});