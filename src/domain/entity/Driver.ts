import { User } from "./User";
import { UserRole } from "../enum/UserRole";
import { Phone } from "../valueObject/Phone";

export class Driver extends User {
    constructor(id: string, identification: number, name: string, phone: Phone){
        super(id, identification, name, UserRole.DRIVER, phone);
    }
}