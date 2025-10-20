const db = require("../../src/models");
const actorsController = require("../../src/controllers/actorsController");

describe("Actors API Integration Tests", () => {
  let testActorId;

  // Setup: Create a test actor before tests
  beforeAll(async () => {
    console.log("Running migrations and syncing database...", process.env.NODE_ENV);
    await db.sequelize.sync({ alter: true });
  });

  // Cleanup: Remove test data after all tests
  afterAll(async () => {
    if (testActorId) {
      await db.Actor.destroy({ where: { id: testActorId } });
    }
    await db.sequelize.close();
  });

  describe("GET /api/actors - getAllActors", () => {
    it("should return list of actors with pagination", async () => {
      const req = {
        query: { page: 1, limit: 10 },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.getAllActors(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          actors: expect.any(Array),
          pagination: expect.objectContaining({
            page: 1,
            limit: 10,
            total: expect.any(Number),
            totalPages: expect.any(Number),
          }),
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    it("should handle pagination parameters correctly", async () => {
      const req = {
        query: { page: 1, limit: 5 },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.getAllActors(req, res, next);

      const response = res.json.mock.calls[0][0];
      expect(response.pagination.page).toBe(1);
      expect(response.pagination.limit).toBe(5);
      expect(response.actors.length).toBeLessThanOrEqual(5);
    });

    it("should reject invalid pagination parameters", async () => {
      const req = {
        query: { page: 1, limit: 101 }, // limit > 100
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.getAllActors(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: expect.stringContaining("Invalid pagination parameters"),
        })
      );
    });

    it("should use default pagination when not provided", async () => {
      const req = {
        query: {},
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.getAllActors(req, res, next);

      const response = res.json.mock.calls[0][0];
      expect(response.pagination.page).toBe(1);
      expect(response.pagination.limit).toBe(10);
    });
  });

  describe("POST /api/actors - createActor", () => {
    it("should create a new actor", async () => {
      const req = {
        body: {
          firstName: "Test",
          lastName: "Actor",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.createActor(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: expect.any(String),
          lastName: expect.any(String),
          id: expect.any(Number),
        })
      );

      // Save the ID for cleanup
      testActorId = res.json.mock.calls[0][0].id;
    });

    it("should reject creation without required fields", async () => {
      const req = {
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.createActor(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: expect.stringContaining("required"),
        })
      );
    });

    it("should reject creation with only firstName", async () => {
      const req = {
        body: { firstName: "Test" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.createActor(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
        })
      );
    });

    it("should reject creation with only lastName", async () => {
      const req = {
        body: { lastName: "Actor" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.createActor(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
        })
      );
    });
  });

  describe("GET /api/actors/:id - getActorById", () => {
    let createdActorId;

    beforeAll(async () => {
      // Create an actor for testing
      const actor = await db.Actor.create({
        firstName: "Get",
        lastName: "Test",
      });
      createdActorId = actor.id;
    });

    afterAll(async () => {
      if (createdActorId) {
        await db.Actor.destroy({ where: { id: createdActorId } });
      }
    });

    it("should return a single actor by id", async () => {
      const req = {
        params: { id: createdActorId },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.getActorById(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: createdActorId,
          firstName: expect.any(String),
          lastName: expect.any(String),
        })
      );
    });

    it("should return 404 for non-existent actor", async () => {
      const req = {
        params: { id: 999999 },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.getActorById(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: "Actor not found",
        })
      );
    });
  });

  describe("PUT /api/actors/:id - updateActor", () => {
    let createdActorId;

    beforeAll(async () => {
      const actor = await db.Actor.create({
        firstName: "Update",
        lastName: "Test",
      });
      createdActorId = actor.id;
    });

    afterAll(async () => {
      if (createdActorId) {
        await db.Actor.destroy({ where: { id: createdActorId } });
      }
    });

    it("should update an existing actor", async () => {
      const req = {
        params: { id: createdActorId },
        body: {
          firstName: "Updated",
          lastName: "Name",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.updateActor(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: createdActorId,
          firstName: expect.stringContaining("Updated"),
          lastName: expect.stringContaining("Name"),
        })
      );
    });

    it("should return 404 when updating non-existent actor", async () => {
      const req = {
        params: { id: 999999 },
        body: {
          firstName: "Test",
          lastName: "Test",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.updateActor(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: "Actor not found",
        })
      );
    });

    it("should allow partial updates (firstName only)", async () => {
      const req = {
        params: { id: createdActorId },
        body: {
          firstName: "PartialUpdate",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.updateActor(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: createdActorId,
          firstName: expect.stringContaining("PartialUpdate"),
        })
      );
    });

    it("should allow partial updates (lastName only)", async () => {
      const req = {
        params: { id: createdActorId },
        body: {
          lastName: "PartialLast",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.updateActor(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: createdActorId,
          lastName: expect.stringContaining("PartialLast"),
        })
      );
    });
  });

  describe("DELETE /api/actors/:id - deleteActor", () => {
    it("should delete an existing actor", async () => {
      // Create an actor to delete
      const actor = await db.Actor.create({
        firstName: "Delete",
        lastName: "Test",
      });

      const req = {
        params: { id: actor.id },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.deleteActor(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        message: "Actor deleted successfully",
      });

      // Verify deletion
      const deletedActor = await db.Actor.findByPk(actor.id);
      expect(deletedActor).toBeNull();
    });

    it("should return 404 when deleting non-existent actor", async () => {
      const req = {
        params: { id: 999999 },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.deleteActor(req, res, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: "Actor not found",
        })
      );
    });
  });

  describe("Edge Cases and Data Validation", () => {
    it("should handle actors with films association", async () => {
      const req = {
        query: { page: 1, limit: 10 },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      await actorsController.getAllActors(req, res, next);

      const response = res.json.mock.calls[0][0];
      expect(response.actors).toBeDefined();
      expect(Array.isArray(response.actors)).toBe(true);
    });

    it("should maintain data integrity after CRUD operations", async () => {
      // Create
      const createReq = {
        body: { firstName: "Integrity", lastName: "Test" },
      };
      const createRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await actorsController.createActor(createReq, createRes, jest.fn());
      const createdActor = createRes.json.mock.calls[0][0];

      // Read
      const getReq = {
        params: { id: createdActor.id },
      };
      const getRes = {
        json: jest.fn(),
      };

      await actorsController.getActorById(getReq, getRes, jest.fn());
      const retrievedActor = getRes.json.mock.calls[0][0];

      expect(retrievedActor.id).toBe(createdActor.id);
      expect(retrievedActor.firstName).toContain("Integrity");

      // Update
      const updateReq = {
        params: { id: createdActor.id },
        body: { firstName: "Updated", lastName: "Integrity" },
      };
      const updateRes = {
        json: jest.fn(),
      };

      await actorsController.updateActor(updateReq, updateRes, jest.fn());
      const updatedActor = updateRes.json.mock.calls[0][0];

      expect(updatedActor.firstName).toContain("Updated");

      // Delete
      const deleteReq = {
        params: { id: createdActor.id },
      };
      const deleteRes = {
        json: jest.fn(),
      };

      await actorsController.deleteActor(deleteReq, deleteRes, jest.fn());
      expect(deleteRes.json).toHaveBeenCalledWith({
        message: "Actor deleted successfully",
      });
    });
  });
});
