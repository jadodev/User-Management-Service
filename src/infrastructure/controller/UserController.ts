import express, { Request, Response } from "express";
import { UserApplicationService } from "../../application/service/UserApplication";
import { ValidationError } from "../../exceptions/ValidationError";
import { NotFoundError } from "../../exceptions/NotFoundError";
import { DatabaseException } from "../../exceptions/DatabaseException";

export class UserController {
    constructor( private readonly userservice: UserApplicationService){
        this.router = express.Router();
        this.inicializeRoutes();
    }

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Create a new user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               identification:
     *                 type: integer
     *             required:
     *               - name
     *               - identification
     *     responses:
     *       201:
     *         description: User created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Bad request, validation error
     *       500:
     *         description: Internal server error
     */
    async create(req: Request, res: Response){
        try {
            const user = await this.userservice.execute(req.body);
            res.status(201).json(user);
        } catch (err) {
            this.handleError(err, res)
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Get a user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: The user ID
     *     responses:
     *       200:
     *         description: User found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    private async getUserById(req: Request, res: Response){
        try {
            const id = req.params.id;
            const user = await this.userservice.findById(id);
            res.status(200).json(user);
        } catch (error) {
            this.handleError(error, res)
        }
    }

    /**
     * @swagger
     * /users/user/{identification}:
     *   get:
     *     summary: Get a user by identification number
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: identification
     *         required: true
     *         schema:
     *           type: string
     *         description: The user identification number
     *     responses:
     *       200:
     *         description: User found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       404:
     *         description: User not found
     *       500:
     *         description: Internal server error
     */
    private async getByIdentification(req: Request, res: Response){
        try {
            const identification = req.params.identification;
            const user = await this.userservice.findByIdentification(parseInt(identification));
            res.status(200).json(user);
        } catch (error) {
            this.handleError(error, res);
        }
    }

    private handleError(error: any, res: Response) {
        if (error instanceof ValidationError) {
            res.status(400).json({ message: error.message });
        } else if (error instanceof NotFoundError) {
            res.status(404).json({ message: error.message });
        } else if (error instanceof DatabaseException) {
            res.status(500).json({ message: "Internal server error." });
        } else {
            res.status(500).json({ message: "Unexpected error occurred." });
        }
    }

    private router: express.Router;

    private inicializeRoutes(){
        this.router.post("/", this.create.bind(this));
        this.router.get("/:id", this.getUserById.bind(this));
        this.router.get("/user/:identification", this.getByIdentification.bind(this));
    }

    public getRouter(){
        return this.router;
    }
}
