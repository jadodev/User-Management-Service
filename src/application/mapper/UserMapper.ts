import { User } from "../../domain/entity/User";
import { UserRole } from "../../domain/enum/UserRole";
import { Phone } from "../../domain/valueObject/Phone";
import { UserDTO } from "../dto/UserDto";

export class UserMapper {
    public static toUserDTO(user: User): UserDTO {
        return new UserDTO(
          user.identification,
          user.name,
          user.role,
          user.getPhone(),
        );
    }

    public static toEntity(userDTO: UserDTO): User {
        const phone = userDTO.phone ? new Phone(userDTO.phone) : undefined;
        const role = userDTO.role as UserRole;

        if (role !== UserRole.CUSTOMER && role !== UserRole.DRIVER) {
          throw new Error('Rol de usuario no soportado');
      }
      
        return new User(
          userDTO.id,
          userDTO.identification,
          userDTO.name,
          role,
          phone
        );
      }
}


