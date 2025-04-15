import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertAiModelSchema, 
  insertReviewSchema, 
  insertNewsArticleSchema, 
  insertRewardSchema 
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();
  
  // User routes
  apiRouter.post("/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });
  
  apiRouter.get("/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user" });
    }
  });
  
  // AI Model routes
  apiRouter.get("/models", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const sortBy = req.query.sortBy as string | undefined;
      
      const models = await storage.getAiModels(category, sortBy);
      res.json(models);
    } catch (error) {
      res.status(500).json({ message: "Error fetching AI models" });
    }
  });
  
  apiRouter.get("/models/:id", async (req: Request, res: Response) => {
    try {
      const modelId = parseInt(req.params.id);
      const model = await storage.getAiModel(modelId);
      
      if (!model) {
        return res.status(404).json({ message: "AI model not found" });
      }
      
      res.json(model);
    } catch (error) {
      res.status(500).json({ message: "Error fetching AI model" });
    }
  });
  
  apiRouter.post("/models", async (req: Request, res: Response) => {
    try {
      const modelData = insertAiModelSchema.parse(req.body);
      const model = await storage.createAiModel(modelData);
      res.status(201).json(model);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid model data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating AI model" });
    }
  });
  
  // Review routes
  apiRouter.get("/reviews", async (req: Request, res: Response) => {
    try {
      const modelId = req.query.modelId ? parseInt(req.query.modelId as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const reviews = await storage.getReviews(modelId, limit);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });
  
  apiRouter.get("/reviews/:id", async (req: Request, res: Response) => {
    try {
      const reviewId = parseInt(req.params.id);
      const review = await storage.getReview(reviewId);
      
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: "Error fetching review" });
    }
  });
  
  apiRouter.post("/reviews", async (req: Request, res: Response) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      
      // Verify the model exists
      const model = await storage.getAiModel(reviewData.modelId);
      if (!model) {
        return res.status(404).json({ message: "AI model not found" });
      }
      
      // Verify the user exists
      const user = await storage.getUser(reviewData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating review" });
    }
  });
  
  apiRouter.patch("/reviews/:id/helpful", async (req: Request, res: Response) => {
    try {
      const reviewId = parseInt(req.params.id);
      const review = await storage.getReview(reviewId);
      
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      
      const updatedReview = await storage.updateReviewHelpfulVotes(reviewId, 1);
      res.json(updatedReview);
    } catch (error) {
      res.status(500).json({ message: "Error updating review helpful votes" });
    }
  });
  
  // News Article routes
  apiRouter.get("/news", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const articles = await storage.getNewsArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news articles" });
    }
  });
  
  apiRouter.get("/news/:id", async (req: Request, res: Response) => {
    try {
      const articleId = parseInt(req.params.id);
      const article = await storage.getNewsArticle(articleId);
      
      if (!article) {
        return res.status(404).json({ message: "News article not found" });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Error fetching news article" });
    }
  });
  
  apiRouter.post("/news", async (req: Request, res: Response) => {
    try {
      const articleData = insertNewsArticleSchema.parse(req.body);
      const article = await storage.createNewsArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid news article data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating news article" });
    }
  });
  
  // Reward routes
  apiRouter.get("/rewards", async (req: Request, res: Response) => {
    try {
      const rewards = await storage.getRewards();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Error fetching rewards" });
    }
  });
  
  apiRouter.get("/rewards/:id", async (req: Request, res: Response) => {
    try {
      const rewardId = parseInt(req.params.id);
      const reward = await storage.getReward(rewardId);
      
      if (!reward) {
        return res.status(404).json({ message: "Reward not found" });
      }
      
      res.json(reward);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reward" });
    }
  });
  
  apiRouter.post("/rewards", async (req: Request, res: Response) => {
    try {
      const rewardData = insertRewardSchema.parse(req.body);
      const reward = await storage.createReward(rewardData);
      res.status(201).json(reward);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid reward data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating reward" });
    }
  });
  
  // Stats route
  apiRouter.get("/stats", async (req: Request, res: Response) => {
    try {
      const models = await storage.getAiModels();
      const reviews = await storage.getReviews(undefined, 1000); // Get a large number to count
      const users = [];
      for (let i = 1; i <= 1000; i++) {
        const user = await storage.getUser(i);
        if (user) users.push(user);
      }
      
      // Calculate total rewards claimed (dummy value for now)
      const rewardsClaimed = 9845;
      
      res.json({
        modelCount: models.length,
        reviewCount: reviews.length,
        userCount: users.length,
        rewardsClaimed
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  });

  app.use("/api", apiRouter);
  
  const httpServer = createServer(app);
  return httpServer;
}
