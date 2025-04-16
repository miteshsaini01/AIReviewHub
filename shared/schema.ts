import { pgTable, text, serial, integer, boolean, timestamp, json, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  points: integer("points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI Models table
export const aiModels = pgTable("ai_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  provider: text("provider").notNull().default("Unknown"),
  imageUrl: text("image_url"),
  releaseDate: timestamp("release_date").defaultNow(),
  
  // User ratings
  avgRating: real("avg_rating").default(0),
  reviewCount: integer("review_count").default(0),
  accuracyScore: real("accuracy_score").default(0),
  easeOfUseScore: real("ease_of_use_score").default(0),
  innovationScore: real("innovation_score").default(0),
  
  // Technical metrics
  reasoningScore: real("reasoning_score").default(0),
  knowledgeScore: real("knowledge_score").default(0), 
  speedScore: real("speed_score").default(0),
  contextWindow: integer("context_window").default(0), // in tokens
  trainingCutoff: text("training_cutoff").default("Unknown"),
  costPerToken: real("cost_per_token").default(0), // in USD per 1000 tokens
  
  // Performance metrics
  wordErrorRate: real("word_error_rate").default(0),
  speedFactor: real("speed_factor").default(0),
  aiScore: real("ai_score").default(0), // Combined score for ranking
  
  // Additional details
  capabilities: json("capabilities").$type<string[]>().default([]),
  technicalDetails: json("technical_details").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  modelId: integer("model_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  accuracyRating: integer("accuracy_rating").notNull(),
  easeOfUseRating: integer("ease_of_use_rating").notNull(),
  innovationRating: integer("innovation_rating").notNull(),
  mediaUrls: json("media_urls").$type<string[]>().default([]),
  helpfulVotes: integer("helpful_votes").default(0),
  commentCount: integer("comment_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// News articles table
export const newsArticles = pgTable("news_articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Rewards table
export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pointsCost: integer("points_cost").notNull(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").default(true),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  points: true,
  createdAt: true,
});

export const insertAiModelSchema = createInsertSchema(aiModels).omit({
  id: true,
  // User ratings
  avgRating: true,
  reviewCount: true,
  accuracyScore: true,
  easeOfUseScore: true,
  innovationScore: true,
  
  // Omit auto-calculated metrics
  reasoningScore: true,
  knowledgeScore: true,
  speedScore: true,
  wordErrorRate: true,
  speedFactor: true,
  aiScore: true,
  
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  helpfulVotes: true,
  commentCount: true,
  createdAt: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAiModel = z.infer<typeof insertAiModelSchema>;
export type AiModel = typeof aiModels.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;

export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewards.$inferSelect;
