import { User } from "../entity/User";
import { UserInterfacePortIn } from "../port/in/UserInterfacePortIn";
import { UserInterfacePortOut } from "../port/out/UserInterfacePortOut";

export class UserServiceDomain implements UserInterfacePortIn{
    private readonly userRepository: UserInterfacePortOut;
    
    constructor(userRepository: UserInterfacePortOut){
        this.userRepository = userRepository;
    }
    async create( user: User ): Promise<User> {
        return await this.userRepository.save(user);
    }

    async getById(id: string): Promise<User | null> {
        return await this.userRepository.getById(id);
    }

    async getByIdentification(identification: number): Promise<User> {
        return await this.userRepository.getByIdentification(identification);
    }
    
}