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
    it('debe crear un usuario y retornar un UserDTO', async () => {
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
      
    it('debe lanzar ValidationError si el UserDTO es inválido', async () => {
      const invalidUserDTO = new UserDTO(
        undefined as any,
        '', 
        undefined as any,
        undefined as any 
      );

      await expect(userApplicationService.execute(invalidUserDTO)).rejects.toThrow(ValidationError);
    });

    it('debe lanzar DatabaseException si ocurre un error en el servicio de dominio', async () => {
      const userDTO = new UserDTO(
        1234567890, 
        'John Doe', 
        UserRole.CUSTOMER, 
        '1234567890' 
      );

      mockUserService.create.mockRejectedValue(new Error('Error de base de datos'));

      await expect(userApplicationService.execute(userDTO)).rejects.toThrow(DatabaseException);
    });
  });

  describe('findById', () => {
    it('debe retornar un UserDTO si el usuario existe', async () => {
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

    it('debe lanzar NotFoundError si el usuario no existe', async () => {
        mockUserService.getById.mockResolvedValue(null);
    
        await expect(userApplicationService.findById('999')).rejects.toThrow(NotFoundError);
    });

    it('debe lanzar DatabaseException si ocurre un error en el servicio de dominio', async () => {
      mockUserService.getById.mockRejectedValue(new Error('Error de base de datos'));

      await expect(userApplicationService.findById('1')).rejects.toThrow(DatabaseException);
    });
  });

  describe('findByIdentification', () => {
    it('debe retornar un UserDTO si el usuario existe', async () => {
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

    it('debe lanzar DatabaseException si ocurre un error en el servicio de dominio', async () => {
      mockUserService.getByIdentification.mockRejectedValue(new Error('Error de base de datos'));

      await expect(userApplicationService.findByIdentification(1234567890)).rejects.toThrow(DatabaseException);
    });
  });
});