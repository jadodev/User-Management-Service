import { IsString, MaxLength, Min } from "class-validator";
import { UserRole } from "../../domain/enum/UserRole";

export class UserDTO {
    @IsString()
    @Min(1)
    id: string;
    
    identification: number;
    
    @IsString()
    name: string;

    role: UserRole;

    @IsString()
    @MaxLength(50, { message: "Name cannot exceed 50 characters" })
    phone?: string | undefined;
  
    constructor( identification: number, name: string, role: UserRole, phone?: string | undefined) {
      this.identification = identification;
      this.name = name;
      this.role = role;
      this.phone = phone;
    }
  }