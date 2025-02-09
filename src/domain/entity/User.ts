import { UserRole } from "../enum/UserRole";
import { Phone } from "../valueObject/Phone";

export class User {
    id?: string;
    identification: number;
    name: string;
    role: UserRole;
    phone?: Phone;
  
    constructor(id: string | undefined, identification: number, name: string, role: UserRole, phone?: Phone) {
      this.id = id; 
      this.identification = identification;
      this.name = name;
      this.role = role;
      this.phone = phone;
    }

    public getId(): string | undefined {
        return this.id;
    }

    public getIdentification(): number{
        return this.identification;
    }

    public getRole(): UserRole {
        return this.role;
    }

    public getPhone(): string | undefined {
        return this.phone?.getValue();
    }

    public getName(): string {
        return this.name;
    }
}


