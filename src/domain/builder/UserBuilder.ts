import { Driver } from "../entity/Driver";
import { Customer } from "../entity/Customer";
import { UserRole } from "../enum/UserRole";
import { User } from "../entity/User";
import { Phone } from "../valueObject/Phone";
import { InvalidUserRoleException } from "../../exceptions/InvalidUserRoleException";

export class UserBuilder {
    private id: string = '';
    private identification: number;
    private name: string = '';
    private role: UserRole = UserRole.CUSTOMER;
    private phone?: Phone;
  
    setId(id: string): this {
      this.id = id;
      return this;
    }
  
    setIdentification( identification: number):this{
      this.identification = identification;
      return this;
    }
  
    setName(name: string): this {
      this.name = name;
      return this;
    }
  
    setPhone(phone: string): this {
      this.phone = new Phone(phone);
      return this;
    }
  
    setRole(role: UserRole): this {
      if (role !== UserRole.CUSTOMER && role !== UserRole.DRIVER) {
        throw new InvalidUserRoleException(role);
      }
      this.role = role;
      return this;
    }
  
    build(): User {
      if (this.role === UserRole.DRIVER) {
        return new Driver(this.id, this.identification, this.name, this.phone!);
      } else if (this.role === UserRole.CUSTOMER) {
        return new Customer(this.id, this.identification, this.name, this.phone!);
      } else {
        throw new Error('Rol de usuario no soportado');
      }
    }
  }
  
  