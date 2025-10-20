const db = require("../models");
const { NotFoundError, BadRequestError } = require("../utils/errors");

class ActorsController {
  /**
   * Get all actors with pagination
   */
  async getAllActors(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        throw new BadRequestError(
          "Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100"
        );
      }

      const { count, rows } = await db.Actor.findAndCountAll({
        limit,
        offset,
        order: [["id", "ASC"]],
      });

      res.json({
        actors: rows,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get actor by ID
   */
  async getActorById(req, res, next) {
    try {
      const actor = await db.Actor.findByPk(req.params.id, {
        include: [
          {
            model: db.Film,
            as: "films",
            through: { attributes: [] },
          },
        ],
      });

      if (!actor) {
        throw new NotFoundError("Actor not found");
      }

      res.json(actor);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new actor
   */
  async createActor(req, res, next) {
    try {
      const { firstName, lastName } = req.body;

      if (!firstName || !lastName) {
        throw new BadRequestError("firstName and lastName are required");
      }

      const actor = await db.Actor.create({ firstName, lastName });
      res.status(201).json(actor);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update an actor
   */
  async updateActor(req, res, next) {
    try {
      const actor = await db.Actor.findByPk(req.params.id);

      if (!actor) {
        throw new NotFoundError("Actor not found");
      }

      const { firstName, lastName } = req.body;
      await actor.update({ firstName, lastName });
      res.json(actor);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an actor
   */
  async deleteActor(req, res, next) {
    try {
      const actor = await db.Actor.findByPk(req.params.id);

      if (!actor) {
        throw new NotFoundError("Actor not found");
      }

      await actor.destroy();
      res.json({ message: "Actor deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ActorsController();
