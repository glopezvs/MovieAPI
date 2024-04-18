import { Express } from "express";
import swaggerJSDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export default function setupSwagger(app: Express) {
  // Swagger options
  const swaggerOptions: Options = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "API Documentation",
        version: "1.0.0",
        description: "API documentation for the User and Movie APIs",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
        schemas: {
          UserInput: {
            type: "object",
            properties: {
              name: {
                type: "string",
              },
              email: {
                type: "string",
                format: "email",
              },
              password: {
                type: "string",
                format: "password",
              },
              avatar: {
                type: "string",
              },
              role: {
                type: "string",
              },
              isActive: { type: "boolean", default: false },
            },
            required: ["name", "email", "password", "role"],
          },
          MovieInput: {
            type: "object",
            properties: {
              title: {
                type: "string",
              },
              year: {
                type: "number",
              },
              description: {
                type: "string",
              },
              genre: {
                type: "array",
                items: {
                  type: "string",
                },
              },
              trailer: {
                type: "string",
              },
              image: {
                type: "string",
              },
              rating: {
                type: "object",
                properties: {
                  imdb: {
                    type: "number",
                  },
                  rottenTomatoes: {
                    type: "number",
                  },
                },
              },
            },
            required: ["title", "year", "genre", "trailer", "image"],
          },
        },
      },
    },
    apis: ["./src/controllers/*.ts"],
  };

  // Initialize Swagger-jsdoc
  const swaggerSpecs = swaggerJSDoc(swaggerOptions);

  // Serve Swagger UI with the generated Swagger specification
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
}
