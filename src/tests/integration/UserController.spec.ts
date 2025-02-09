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

    it("debe crear un usuario y devolver 201", async () => {
        const mockUser = { id: "1", identification: 1234567890, name: "John Doe", role: "CUSTOMER" };
        (mockUserService.execute as jest.Mock).mockResolvedValue(mockUser);

        const response = await request(app)
            .post("/users")
            .send({ identification: 1234567890, name: "John Doe", role: "CUSTOMER" });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockUser);
    });

    it("debe devolver 400 si hay un error de validación", async () => {
        (mockUserService.execute as jest.Mock).mockRejectedValue(new ValidationError("Datos inválidos"));

        const response = await request(app)
            .post("/users")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Datos inválidos" });
    });

    it("debe obtener un usuario por ID y devolver 200", async () => {
        const mockUser = { id: "1", identification: 1234567890, name: "John Doe", role: "CUSTOMER" };
        (mockUserService.findById as jest.Mock).mockResolvedValue(mockUser);

        const response = await request(app).get("/users/1");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    it("debe devolver 404 si el usuario no se encuentra por ID", async () => {
        (mockUserService.findById as jest.Mock).mockRejectedValue(new NotFoundError("Usuario no encontrado"));

        const response = await request(app).get("/users/999");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Usuario no encontrado" });
    });

    it("debe obtener un usuario por identificación y devolver 200", async () => {
        const mockUser = { id: "1", identification: 1234567890, name: "John Doe", role: "CUSTOMER" };
        (mockUserService.findByIdentification as jest.Mock).mockResolvedValue(mockUser);

        const response = await request(app).get("/users/user/1234567890");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    it("debe devolver 404 si el usuario no se encuentra por identificación", async () => {
        (mockUserService.findByIdentification as jest.Mock).mockRejectedValue(new NotFoundError("Usuario no encontrado"));

        const response = await request(app).get("/users/user/999");

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Usuario no encontrado" });
    });

});
