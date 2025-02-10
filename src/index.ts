import express, { Request, Response, NextFunction } from "express";
import { UserRepository } from "./infrastructure/repository/UserRepository";
import { UserServiceDomain } from "./domain/service/UserServiceDomain";
import { UserApplicationService } from "./application/service/UserApplication";
import { UserController } from "./infrastructure/controller/UserController";
import { Database } from "./infrastructure/config/DataBase";
import { errorHandler } from "./infrastructure/middleware/errorHandler";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const PORT = 9000;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      description: 'API for user management',
      version: '1.0.0',
      contact: {
        name: 'Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./src/infrastructure/controller/*.ts', './src/routes/*.ts'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

const initializeServer = async () => {
  try {
    await Database.initialize();

    const userRepository = new UserRepository();
    const userServiceDomain = new UserServiceDomain(userRepository);
    const userServiceApplication = new UserApplicationService(userServiceDomain);
    const userController = new UserController(userServiceApplication);

    app.use(express.json());
    app.use("/", userController.getRouter());

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });

  } catch (err) {
    console.error("Error initializing database or starting server:", err);
    process.exit(1);
  }
};

initializeServer();
