const actorsController = require("../../../src/controllers/actorsController");
const db = require("../../../src/models");
const { NotFoundError, BadRequestError } = require("../../../src/utils/errors");

// Mock the database models
jest.mock("../../../src/models", () => ({
  Actor: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe("ActorsController Unit Tests", () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      query: {},
      params: {},
      body: {},
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("getAllActors", () => {
    it("should return paginated actors list", async () => {
      const mockActors = [
        { actor_id: 1, first_name: "John", last_name: "Doe" },
        { actor_id: 2, first_name: "Jane", last_name: "Smith" },
      ];

      db.Actor.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockActors,
      });

      mockReq.query = { page: 1, limit: 10 };

      await actorsController.getAllActors(mockReq, mockRes, mockNext);

      expect(db.Actor.findAndCountAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
        order: [["id", "ASC"]],
      });

      expect(mockRes.json).toHaveBeenCalledWith({
        actors: mockActors,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });
    });

    it("should use default pagination values when not provided", async () => {
      db.Actor.findAndCountAll.mockResolvedValue({
        count: 0,
        rows: [],
      });

      mockReq.query = {};

      await actorsController.getAllActors(mockReq, mockRes, mockNext);

      expect(db.Actor.findAndCountAll).toHaveBeenCalledWith({
        limit: 10,
        offset: 0,
        order: [["id", "ASC"]],
      });
    });

    it("should throw BadRequestError for invalid page number", async () => {
      mockReq.query = { page: -1, limit: 10 };

      try {
        await actorsController.getAllActors(mockReq, mockRes, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
      }
    });

    it("should throw BadRequestError for invalid limit", async () => {
      mockReq.query = { page: 1, limit: 101 };

      try {
        await actorsController.getAllActors(mockReq, mockRes, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
      }
    });

    it("should throw BadRequestError for negative limit", async () => {
      mockReq.query = { page: 1, limit: -1 };

      try {
        await actorsController.getAllActors(mockReq, mockRes, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
      }
    });

    it("should calculate correct offset for page 2", async () => {
      db.Actor.findAndCountAll.mockResolvedValue({
        count: 20,
        rows: [],
      });

      mockReq.query = { page: 2, limit: 10 };

      await actorsController.getAllActors(mockReq, mockRes, mockNext);

      expect(db.Actor.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 10,
        })
      );
    });

    it("should calculate correct totalPages", async () => {
      db.Actor.findAndCountAll.mockResolvedValue({
        count: 25,
        rows: [],
      });

      mockReq.query = { page: 1, limit: 10 };

      await actorsController.getAllActors(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: expect.objectContaining({
            totalPages: 3,
          }),
        })
      );
    });
  });

  describe("getActorById", () => {
    it("should return actor with films", async () => {
      const mockActor = {
        actor_id: 1,
        first_name: "John",
        last_name: "Doe",
        films: [],
      };

      db.Actor.findByPk.mockResolvedValue(mockActor);

      mockReq.params = { id: 1 };

      await actorsController.getActorById(mockReq, mockRes, mockNext);

      expect(db.Actor.findByPk).toHaveBeenCalledWith(1, {
        include: expect.any(Array),
      });

      expect(mockRes.json).toHaveBeenCalledWith(mockActor);
    });

    it("should throw NotFoundError when actor does not exist", async () => {
      db.Actor.findByPk.mockResolvedValue(null);

      mockReq.params = { id: 999 };

      try {
        await actorsController.getActorById(mockReq, mockRes, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.message).toBe("Actor not found");
      }
    });
  });

  describe("createActor", () => {
    it("should create a new actor", async () => {
      const mockNewActor = {
        actor_id: 1,
        first_name: "New",
        last_name: "Actor",
        created_at: new Date(),
        updated_at: new Date(),
      };

      db.Actor.create.mockResolvedValue(mockNewActor);

      mockReq.body = {
        firstName: "New",
        lastName: "Actor",
      };

      await actorsController.createActor(mockReq, mockRes, mockNext);

      expect(db.Actor.create).toHaveBeenCalledWith({
        firstName: "New",
        lastName: "Actor",
      });

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockNewActor);
    });

    it("should throw BadRequestError when firstName is missing", async () => {
      mockReq.body = {
        lastName: "Actor",
      };

      try {
        await actorsController.createActor(mockReq, mockRes, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toContain("required");
      }
    });

    it("should throw BadRequestError when lastName is missing", async () => {
      mockReq.body = {
        firstName: "New",
      };

      try {
        await actorsController.createActor(mockReq, mockRes, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
      }
    });

    it("should throw BadRequestError when both fields are missing", async () => {
      mockReq.body = {};

      try {
        await actorsController.createActor(mockReq, mockRes, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
      }
    });
  });

  describe("updateActor", () => {
    it("should update an existing actor", async () => {
      const mockActor = {
        actor_id: 1,
        first_name: "Old",
        last_name: "Name",
        update: jest.fn().mockResolvedValue(true),
      };

      db.Actor.findByPk.mockResolvedValue(mockActor);

      mockReq.params = { id: 1 };
      mockReq.body = {
        firstName: "Updated",
        lastName: "Name",
      };

      await actorsController.updateActor(mockReq, mockRes, mockNext);

      expect(mockActor.update).toHaveBeenCalledWith({
        firstName: "Updated",
        lastName: "Name",
      });

      expect(mockRes.json).toHaveBeenCalledWith(mockActor);
    });

    it("should throw NotFoundError when actor does not exist", async () => {
      db.Actor.findByPk.mockResolvedValue(null);

      mockReq.params = { id: 999 };
      mockReq.body = {
        firstName: "Test",
        lastName: "Test",
      };

      try {
        await actorsController.updateActor(mockReq, mockRes, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
      }
    });

    it("should allow partial update with only firstName", async () => {
      const mockActor = {
        actor_id: 1,
        first_name: "Old",
        last_name: "Name",
        update: jest.fn().mockResolvedValue(true),
        reload: jest.fn().mockResolvedValue({
          actor_id: 1,
          first_name: "Updated",
          last_name: "Name",
        }),
      };

      db.Actor.findByPk.mockResolvedValue(mockActor);

      mockReq.params = { id: 1 };
      mockReq.body = {
        firstName: "Updated",
      };

      await actorsController.updateActor(mockReq, mockRes, mockNext);

      expect(mockActor.update).toHaveBeenCalledWith({
        firstName: "Updated",
        lastName: undefined,
      });
    });

    it("should allow partial update with only lastName", async () => {
      const mockActor = {
        actor_id: 1,
        first_name: "Name",
        last_name: "Old",
        update: jest.fn().mockResolvedValue(true),
      };

      db.Actor.findByPk.mockResolvedValue(mockActor);

      mockReq.params = { id: 1 };
      mockReq.body = {
        lastName: "Updated",
      };

      await actorsController.updateActor(mockReq, mockRes, mockNext);

      expect(mockActor.update).toHaveBeenCalledWith({
        firstName: undefined,
        lastName: "Updated",
      });
    });
  });

  describe("deleteActor", () => {
    it("should delete an existing actor", async () => {
      const mockActor = {
        actor_id: 1,
        destroy: jest.fn().mockResolvedValue(true),
      };

      db.Actor.findByPk.mockResolvedValue(mockActor);

      mockReq.params = { id: 1 };

      await actorsController.deleteActor(mockReq, mockRes, mockNext);

      expect(mockActor.destroy).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Actor deleted successfully",
      });
    });

    it("should throw NotFoundError when actor does not exist", async () => {
      db.Actor.findByPk.mockResolvedValue(null);

      mockReq.params = { id: 999 };

      try {
        await actorsController.deleteActor(mockReq, mockRes, mockNext);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.message).toBe("Actor not found");
      }
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors in getAllActors", async () => {
      const dbError = new Error("Database connection failed");
      db.Actor.findAndCountAll.mockRejectedValue(dbError);

      mockReq.query = { page: 1, limit: 10 };

      await actorsController.getAllActors(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(dbError);
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it("should handle database errors in createActor", async () => {
      const dbError = new Error("Constraint violation");
      db.Actor.create.mockRejectedValue(dbError);

      mockReq.body = { firstName: "Test", lastName: "Test" };

      await actorsController.createActor(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(dbError);
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });
});
