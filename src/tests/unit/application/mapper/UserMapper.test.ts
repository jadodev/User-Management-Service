import { Phone } from '../../domain/valueObject/Phone';
import { UserRole } from '../../domain/enum/UserRole';
import { User } from '../../domain/entity/User';
import { UserDTO } from '../../../application/dto/UserDto';
import { UserMapper } from '../../../application/mapper/UserMapper';

describe('UserMapper', () => {
    describe('toUserDTO', () => {
      it('debe convertir un User a UserDTO correctamente', () => {
        const user = new User(
          '1', 
          1234567890,
          'John Doe',
          UserRole.CUSTOMER,
          new Phone('1234567890')
        );
  
        const userDTO = UserMapper.toUserDTO(user);
  
        expect(userDTO).toBeInstanceOf(UserDTO);
        expect(userDTO.identification).toBe(user.identification);
        expect(userDTO.name).toBe(user.name);
        expect(userDTO.role).toBe(user.role);
        expect(userDTO.phone).toBe(user.getPhone());
      });
  
      it('debe manejar un User sin teléfono correctamente', () => {
        const user = new User(
          '1',
          1234567890,
          'John Doe',
          UserRole.CUSTOMER
        );
  
        const userDTO = UserMapper.toUserDTO(user);
  
        expect(userDTO.phone).toBeUndefined();
      });
    });
  
    describe('toEntity', () => {
      it('debe convertir un UserDTO a User correctamente', () => {
        const userDTO = new UserDTO(
          1234567890, 
          'John Doe', 
          UserRole.CUSTOMER, 
          '1234567890' 
        );
  
        const user = UserMapper.toEntity(userDTO);
  
        expect(user).toBeInstanceOf(User);
        expect(user.identification).toBe(userDTO.identification);
        expect(user.name).toBe(userDTO.name);
        expect(user.role).toBe(userDTO.role);
        expect(user.getPhone()).toBe(userDTO.phone);
      });
  
      it('debe manejar un UserDTO sin teléfono correctamente', () => {
        const userDTO = new UserDTO(
          1234567890,
          'John Doe',
          UserRole.CUSTOMER,
          undefined 
        );
  
        const user = UserMapper.toEntity(userDTO);
  
        expect(user.getPhone()).toBeUndefined();
      });
  
      it('debe lanzar un error si el rol no es válido', () => {
        const userDTO = new UserDTO(
          1234567890, 
          'John Doe', 
          'INVALID_ROLE' as UserRole,
          '1234567890'
        );
  
        expect(() => UserMapper.toEntity(userDTO)).toThrowError('Rol de usuario no soportado');
      });
    });
  });