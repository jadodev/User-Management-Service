import request from 'supertest';
import express from 'express';
import { UserController } from '../../../../infrastructure/controller/UserController';
import { UserApplicationService } from '../../../../application/service/UserApplication';
import { UserDTO } from '../../../../application/dto/UserDto';
import { UserRole } from '../../../../domain/enum/UserRole';
import { ValidationError } from '../../../../exceptions/ValidationError';
import { DatabaseException } from '../../../../exceptions/DatabaseException';
import { NotFoundError } from '../../../../exceptions/NotFoundError';

const mockUserApplicationService = {
    execute: jest.fn(),
    findById: jest.fn(),
    findByIdentification: jest.fn(),
} as unknown as jest.Mocked<UserApplicationService>;

describe('UserController', () => {
    let app: express.Express;
    let userController: UserController;

    beforeEach(() => {
        jest.clearAllMocks();
        userController = new UserController(mockUserApplicationService);
        app = express();
        app.use(express.json());
        app.use(userController.getRouter());
    });

    describe('POST /', () => {
        it('It should create a user and return 201.', async () => {
            const userDTO: UserDTO = {
                id: '1',
                identification: 1234567890,
                name: 'John Doe',
                role: UserRole.CUSTOMER,
                phone: '1234567890',
            };

            mockUserApplicationService.execute.mockResolvedValue(userDTO);

            const response = await request(app)
                .post('/')
                .send(userDTO)
                .expect(201);

            expect(response.body).toEqual(userDTO);
            expect(mockUserApplicationService.execute).toHaveBeenCalledWith(userDTO);
        });

        it('It should return 400 if the users data is invalid.', async () => {
            const invalidUserDTO = {
                identification: 1234567890,
                name: '',
                role: 'CUSTOMER',
                phone: '1234567890',
            };

            mockUserApplicationService.execute.mockRejectedValue(new ValidationError('User name is required.'));

            const response = await request(app)
                .post('/')
                .send(invalidUserDTO)
                .expect(400);

            expect(response.body).toEqual({ message: 'User name is required.' });
        });

        it('It should return 500 if a database error occurs.', async () => {
            const userDTO: UserDTO = {
                id: '1',
                identification: 1234567890,
                name: 'John Doe',
                role: UserRole.CUSTOMER, 
                phone: '1234567890',
            };

            mockUserApplicationService.execute.mockRejectedValue(new DatabaseException('Error saving user.'));

            const response = await request(app)
                .post('/')
                .send(userDTO)
                .expect(500);

            expect(response.body).toEqual({ message: 'Internal server error.' });
        });
    });

    describe('GET /:id', () => {
        it('It should return a user and a 200 status code if the user exists.', async () => {
            const userDTO: UserDTO = {
                id: '1',
                identification: 1234567890,
                name: 'John Doe',
                role: UserRole.CUSTOMER,
                phone: '1234567890',
            };

            mockUserApplicationService.findById.mockResolvedValue(userDTO);

            const response = await request(app)
                .get('/1')
                .expect(200);

            expect(response.body).toEqual(userDTO);
            expect(mockUserApplicationService.findById).toHaveBeenCalledWith('1');
        });

        it('It should return 404 if the user does not exist.', async () => {
            mockUserApplicationService.findById.mockRejectedValue(new NotFoundError('User with ID 999 not found. NOT_FOUND'));
        
            const response = await request(app)
                .get('/999')
                .expect(404);
        
            expect(response.body).toEqual({ message: 'User with ID 999 not found. NOT_FOUND' });
        });

        it('It should return 500 if a database error occurs.', async () => {
            mockUserApplicationService.findById.mockRejectedValue(new DatabaseException('Error retrieving user.'));

            const response = await request(app)
                .get('/1')
                .expect(500);

            expect(response.body).toEqual({ message: 'Internal server error.' });
        });
    });

    describe('GET /user/:identification', () => {
        it('It should return a user and a 200 status code if the user exists.', async () => {
            const userDTO: UserDTO = {
                id: '1',
                identification: 1234567890,
                name: 'John Doe',
                role: UserRole.CUSTOMER, 
                phone: '1234567890',
            };

            mockUserApplicationService.findByIdentification.mockResolvedValue(userDTO);

            const response = await request(app)
                .get('/user/1234567890')
                .expect(200);

            expect(response.body).toEqual(userDTO);
            expect(mockUserApplicationService.findByIdentification).toHaveBeenCalledWith(1234567890);
        });

        it('It should return 404 if the user does not exist.', async () => {
            mockUserApplicationService.findByIdentification.mockRejectedValue(new NotFoundError('User with identification 999 not found.'));

            const response = await request(app)
                .get('/user/999')
                .expect(404);

            expect(response.body).toEqual({ message: 'User with identification 999 not found.' });
        });

        it('It should return 500 if a database error occurs.', async () => {
            mockUserApplicationService.findByIdentification.mockRejectedValue(new DatabaseException('Error retrieving user.'));

            const response = await request(app)
                .get('/user/1234567890')
                .expect(500);

            expect(response.body).toEqual({ message: 'Internal server error.' });
        });
    });
});