export class User {
    id: string;
    identification: number;
    name: string;
    phone?: string;
  
    constructor(id: string, identification: number, name: string, phone?: string) {
      this.id = id;
      this.identification = identification;
      this.name = name;
      this.phone = phone;
    }

    public getId(): string {
        return this.id;
    }

    public getIdentification(): number{
        return this.identification;
    }


    public getName(): string {
        return this.name;
    }
}