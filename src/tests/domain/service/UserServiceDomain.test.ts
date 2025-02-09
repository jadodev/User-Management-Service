import { UserServiceDomain } from '../../../domain/service/UserServiceDomain';
import { User } from '../../../domain/entity/User';
import { UserInterfacePortOut } from '../../../domain/port/out/UserInterfacePortOut';
import { UserRole } from '../../../domain/enum/UserRole';
import { Phone } from '../../../domain/valueObject/Phone';

const mockUserRepository: jest.Mocked<UserInterfacePortOut> = {
  save: jest.fn(),
  getById: jest.fn(),
  getByIdentification: jest.fn(),
};

describe('UserServiceDomain', () => {
  let userService: UserServiceDomain;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserServiceDomain(mockUserRepository);
  });

  describe('create', () => {
    it('debe guardar y retornar un usuario', async () => {
      const mockUser = new User(
        '1',
        1234567890,
        'John Doe',
        UserRole.CUSTOMER,
        new Phone('1234567890')
      );

      mockUserRepository.save.mockResolvedValue(mockUser);

      const result = await userService.create(mockUser);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getById', () => {
    it('debe retornar un usuario si existe', async () => {
      const mockUser = new User(
        '1',
        1234567890,
        'John Doe',
        UserRole.CUSTOMER,
        new Phone('1234567890')
      );

      mockUserRepository.getById.mockResolvedValue(mockUser);

      const result = await userService.getById('1');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.getById).toHaveBeenCalledWith('1');
    });

    it('debe retornar null si el usuario no existe', async () => {
      mockUserRepository.getById.mockResolvedValue(null);

      const result = await userService.getById('999');

      expect(result).toBeNull();
      expect(mockUserRepository.getById).toHaveBeenCalledWith('999');
    });
  });

  describe('getByIdentification', () => {
    it('debe retornar un usuario por identificación', async () => {
      const mockUser = new User(
        '1',
        1234567890,
        'John Doe',
        UserRole.CUSTOMER,
        new Phone('1234567890')
      );

      mockUserRepository.getByIdentification.mockResolvedValue(mockUser);

      const result = await userService.getByIdentification(1234567890);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.getByIdentification).toHaveBeenCalledWith(1234567890);
    });
  });
});