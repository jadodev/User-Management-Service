import request from "supertest";
import express from "express";
import { NotFoundError } from "../../exceptions/NotFoundError";
import { ValidationError } from "../../exceptions/ValidationError";
import { UserApplicationService } from "../../application/service/UserApplication";
import { UserController } from "../../infrastructure/controller/UserController";


const mockUserService: Partial<UserApplicationService> = {
    execute: jest.fn(),
    findById: jest.fn(),
    findByIdentification: jest.fn()
};

const app = express();
app.use(express.json());
const userController = new UserController(mockUserService as UserApplicationService);
app.use("/users", userController.getRouter());

describe("UserController Integration Tests", () => {
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should create a user and return 201", async () => {
        const mockUser = { id: "1", identification: 1234567890, name: "John Doe", role: "CUSTOMER" };
        (mockUserService.execute as jest.Mock).mockResolvedValue(mockUser);

        const response = await request(app)
            .post("/users")
            .send({ identification: 1234567890, name: "John Doe", role: "CUSTOMER" });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockUser);
    });

    it("should return 400 if there is a validation error", async () => {
        (mockUserService.execute as jest.Mock).mockRejectedValue(new ValidationError("Invalid data"));

        const response = await request(app)
            .post("/users")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Invalid data" });
    });

    it("should get a user by ID and return 200", async () => {
        const mockUser = { id: "1", identification: 1234567890, name: "John Doe", role: "CUSTOMER" };
        (mockUserService.findById as jest.Mock).mockResolvedValue(mockUser);

        const response = await request(app).get("/users/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    it("should return 404 if the user is not found by ID", async () => {
        (mockUserService.findById as jest.Mock).mockRejectedValue(new NotFoundError("User not found"));

        const response = await request(app).get("/users/999");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "User not found" });
    });

    it("should get a user by identification and return 200", async () => {
        const mockUser = { id: "1", identification: 1234567890, name: "John Doe", role: "CUSTOMER" };
        (mockUserService.findByIdentification as jest.Mock).mockResolvedValue(mockUser);

        const response = await request(app).get("/users/user/1234567890");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    it("should return 404 if the user is not found by identification", async () => {
        (mockUserService.findByIdentification as jest.Mock).mockRejectedValue(new NotFoundError("User not found"));

        const response = await request(app).get("/users/user/999");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "User not found" });
    });

});
