import { UserDTO } from "../../../../application/dto/UserDto";
import { UserApplicationService } from "../../../../application/service/UserApplication";
import { User } from "../../../../domain/entity/User";
import { UserRole } from "../../../../domain/enum/UserRole";
import { UserInterfacePortIn } from "../../../../domain/port/in/UserInterfacePortIn";
import { Phone } from "../../../../domain/valueObject/Phone";
import { DatabaseException } from "../../../../exceptions/DatabaseException";
import { NotFoundError } from "../../../../exceptions/NotFoundError";
import { ValidationError } from "../../../../exceptions/ValidationError";

const mockUserService: jest.Mocked<UserInterfacePortIn> = {
  create: jest.fn(),
  getById: jest.fn(),
  getByIdentification: jest.fn(),
};

describe('UserApplicationService', () => {
  let userApplicationService: UserApplicationService;

  beforeEach(() => {
    jest.clearAllMocks();
    userApplicationService = new UserApplicationService(mockUserService);
  });

  describe('execute', () => {
    it('should create a user and return a UserDTO', async () => {
        const userDTO = new UserDTO(
          1234567890, 
          'John Doe', 
          UserRole.CUSTOMER,
          '1234567890' 
        );
      
        const mockUser = new User(
          '1',
          1234567890,
          'John Doe',
          UserRole.CUSTOMER,
          new Phone('1234567890')
        );
      
        mockUserService.create.mockResolvedValue(mockUser);
      
        const result = await userApplicationService.execute(userDTO);
      
        expect(result).toBeInstanceOf(UserDTO);
        expect(result.identification).toBe(userDTO.identification);
        expect(result.name).toBe(userDTO.name);
        expect(result.role).toBe(userDTO.role);
        expect(result.phone).toBe(userDTO.phone);
      });
      
    it('should throw ValidationError if the UserDTO is invalid', async () => {
      const invalidUserDTO = new UserDTO(
        undefined as any,
        '', 
        undefined as any,
        undefined as any 
      );

      await expect(userApplicationService.execute(invalidUserDTO)).rejects.toThrow(ValidationError);
    });

    it('should throw DatabaseException if there is an error in the domain service', async () => {
      const userDTO = new UserDTO(
        1234567890, 
        'John Doe', 
        UserRole.CUSTOMER, 
        '1234567890' 
      );

      mockUserService.create.mockRejectedValue(new Error('Database error'));

      await expect(userApplicationService.execute(userDTO)).rejects.toThrow(DatabaseException);
    });
  });

  describe('findById', () => {
    it('should return a UserDTO if the user exists', async () => {
      const mockUser = new User(
        '1',
        1234567890,
        'John Doe',
        UserRole.CUSTOMER,
        new Phone('1234567890')
      );

      mockUserService.getById.mockResolvedValue(mockUser);

      const result = await userApplicationService.findById('1');

      expect(result).toBeInstanceOf(UserDTO);
      expect(result.identification).toBe(1234567890);
      expect(result.name).toBe('John Doe');
      expect(result.role).toBe(UserRole.CUSTOMER);
      expect(result.phone).toBe('1234567890');
      expect(mockUserService.getById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundError if the user does not exist', async () => {
        mockUserService.getById.mockResolvedValue(null);
    
        await expect(userApplicationService.findById('999')).rejects.toThrow(NotFoundError);
    });

    it('should throw DatabaseException if there is an error in the domain service', async () => {
      mockUserService.getById.mockRejectedValue(new Error('Database error'));

      await expect(userApplicationService.findById('1')).rejects.toThrow(DatabaseException);
    });
  });

  describe('findByIdentification', () => {
    it('should return a UserDTO if the user exists', async () => {
      const mockUser = new User(
        '1',
        1234567890,
        'John Doe',
        UserRole.CUSTOMER,
        new Phone('1234567890')
      );

      mockUserService.getByIdentification.mockResolvedValue(mockUser);

      const result = await userApplicationService.findByIdentification(1234567890);

      expect(result).toBeInstanceOf(UserDTO);
      expect(result.identification).toBe(1234567890);
      expect(result.name).toBe('John Doe');
      expect(result.role).toBe(UserRole.CUSTOMER);
      expect(result.phone).toBe('1234567890');
      expect(mockUserService.getByIdentification).toHaveBeenCalledWith(1234567890);
    });

    it('should throw DatabaseException if there is an error in the domain service', async () => {
      mockUserService.getByIdentification.mockRejectedValue(new Error('Database error'));

      await expect(userApplicationService.findByIdentification(1234567890)).rejects.toThrow(DatabaseException);
    });
  });
});
