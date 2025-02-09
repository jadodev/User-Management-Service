import { User } from "./User";

export class Customer extends User {

    constructor(id: string, identification:number, name: string, phone?:string) {
      super(id, identification, name, phone!);
    }
  }
  