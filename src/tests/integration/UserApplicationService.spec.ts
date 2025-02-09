import { UserDTO } from "../../application/dto/UserDto";
import { UserApplicationService } from "../../application/service/UserApplication";
import { User } from "../../domain/entity/User";
import { UserRole } from "../../domain/enum/UserRole";
import { UserInterfacePortIn } from "../../domain/port/in/UserInterfacePortIn";
import { Phone } from "../../domain/valueObject/Phone";
import { DatabaseException } from "../../exceptions/DatabaseException";
import { NotFoundError } from "../../exceptions/NotFoundError";
import { ValidationError } from "../../exceptions/ValidationError";

const mockUserService: jest.Mocked<UserInterfacePortIn> = {
    create: jest.fn(),
    getById: jest.fn(),
    getByIdentification: jest.fn(),
};

const userAppService = new UserApplicationService(mockUserService);

describe("UserApplicationService Integration Tests", () => {
    const sampleUserDTO = new UserDTO(123456789, "John Doe", UserRole.CUSTOMER, "3101234567");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should create a user successfully", async () => {
        const mockUser = new User(
            "1",
            sampleUserDTO.identification,
            sampleUserDTO.name,
            sampleUserDTO.role,
            new Phone(sampleUserDTO.phone)
        );
    
        mockUserService.create.mockResolvedValue(mockUser);
        
        const result = await userAppService.execute(sampleUserDTO);
        
        expect(mockUserService.create).toHaveBeenCalledWith(expect.objectContaining({
            identification: sampleUserDTO.identification,
        }));
        expect(result.name).toBe(sampleUserDTO.name);
    });

    test("should throw validation error when creating a user with missing data", async () => {
        await expect(userAppService.execute(new UserDTO(0, "", UserRole.CUSTOMER, "")))
            .rejects.toThrow(ValidationError);
    });

    test("should find a user by identification successfully", async () => {
        const mockUser = new User(
            "1",
            sampleUserDTO.identification,
            sampleUserDTO.name,
            sampleUserDTO.role,
            new Phone(sampleUserDTO.phone)
        );
    
        mockUserService.getByIdentification.mockResolvedValue(mockUser);
        
        const result = await userAppService.findByIdentification(123456789);
        
        expect(mockUserService.getByIdentification).toHaveBeenCalledWith(123456789);
        expect(result.identification).toBe(123456789);
    });

    test("should throw NotFoundError when user is not found by identification", async () => {
        mockUserService.getByIdentification.mockResolvedValue(null);
        
        await expect(userAppService.findByIdentification(99999))
            .rejects.toThrow(NotFoundError);
    });

    test("should throw DatabaseException when there is an error in persistence layer", async () => {
        mockUserService.create.mockRejectedValue(new Error("DB error"));
        
        await expect(userAppService.execute(sampleUserDTO))
            .rejects.toThrow(DatabaseException);
    });
});
