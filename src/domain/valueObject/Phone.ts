export class Phone {
    private readonly value: string;

    constructor(value: any) {
        const valueAsString = String(value);

        if (typeof valueAsString !== 'string' || valueAsString.length < 10) {
            throw new Error("Phone number invalid");
        }

        this.value = valueAsString;
    }

    public getValue(): string {
        return this.value;
    }
}
