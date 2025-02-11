# User-Management-Service

## Documentación de la API con Swagger

La aplicación incluye documentación interactiva de la API generada con Swagger. Una vez que la aplicación esté en ejecución, puedes acceder a la documentación abriendo tu navegador y navegando a:

**http://localhost:4001/api-docs**

Asegúrate de que la aplicación se esté ejecutando en el puerto configurado para Swagger. Si necesitas cambiar el puerto, actualiza la configuración correspondiente en el archivo de entorno o en el archivo `docker-compose.yml`.


```plaintext
\---src
    |   index.ts
    |
    +---application
    |   +---dto
    |   |       UserDto.ts
    |   |
    |   +---mapper
    |   |       UserMapper.ts
    |   |
    |   \---service
    |           UserApplication.ts
    |
    +---domain
    |   +---builder
    |   |       UserBuilder.ts
    |   |
    |   +---entity
    |   |       Customer.ts
    |   |       Driver.ts
    |   |       User.ts
    |   |
    |   +---enum
    |   |       UserRole.ts
    |   |
    |   +---port
    |   |   +---in
    |   |   |       UserInterfacePortIn.ts
    |   |   |
    |   |   \---out
    |   |           UserInterfacePortOut.ts
    |   |
    |   +---service
    |   |       UserServiceDomain.ts
    |   |
    |   \---valueObject
    |           Phone.ts
    |
    +---exceptions
    |       BaseError.ts
    |       DatabaseException.ts
    |       InvalidRoleError.ts
    |       InvalidUserRoleException.ts
    |       NotFoundError.ts
    |       ValidationError.ts
    |
    +---infrastructure
    |   +---config
    |   |       DataBase.ts
    |   |
    |   +---controller
    |   |       UserController.ts
    |   |
    |   +---middleware
    |   |       errorHandler.ts
    |   |       validateDTO.ts
    |   |
    |   \---repository
    |           UserRepository.ts
    |
    +---tests
    |   +---integration
    |   |       UserApplicationService.spec.ts
    |   |       UserController.spec.ts
    |   |       UserRepository.spec.ts
    |   |
    |   \---unit
    |       +---application
    |       |   +---mapper
    |       |   |       UserMapper.test.ts
    |       |   |
    |       |   \---service
    |       |           UserApplication.test.ts
    |       |
    |       +---domain
    |       |   \---service
    |       |           UserServiceDomain.test.ts
    |       |
    |       \---infrastructure
    |           +---controller
    |           |       UserController.test.ts
    |           |
    |           \---repository
    |                   UserRepository.test.ts
    |
    \---types
            swagger-ui-express.d.ts

