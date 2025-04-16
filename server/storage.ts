import { 
  users, type User, type InsertUser,
  aiModels, type AiModel, type InsertAiModel,
  reviews, type Review, type InsertReview,
  newsArticles, type NewsArticle, type InsertNewsArticle,
  rewards, type Reward, type InsertReward
} from "@shared/schema";

// Interface for storage methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, pointsToAdd: number): Promise<User | undefined>;
  
  // AI Model methods
  getAiModels(category?: string, sortBy?: string): Promise<AiModel[]>;
  getAiModel(id: number): Promise<AiModel | undefined>;
  createAiModel(model: InsertAiModel): Promise<AiModel>;
  updateModelRatings(modelId: number): Promise<AiModel | undefined>;
  
  // Review methods
  getReviews(modelId?: number, limit?: number): Promise<Review[]>;
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReviewHelpfulVotes(reviewId: number, increment: number): Promise<Review | undefined>;
  
  // News methods
  getNewsArticles(limit?: number): Promise<NewsArticle[]>;
  getNewsArticle(id: number): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  
  // Reward methods
  getRewards(): Promise<Reward[]>;
  getReward(id: number): Promise<Reward | undefined>;
  createReward(reward: InsertReward): Promise<Reward>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private aiModels: Map<number, AiModel>;
  private reviews: Map<number, Review>;
  private newsArticles: Map<number, NewsArticle>;
  private rewards: Map<number, Reward>;
  
  private userIdCounter: number;
  private modelIdCounter: number;
  private reviewIdCounter: number;
  private newsIdCounter: number;
  private rewardIdCounter: number;

  constructor() {
    this.users = new Map();
    this.aiModels = new Map();
    this.reviews = new Map();
    this.newsArticles = new Map();
    this.rewards = new Map();
    
    this.userIdCounter = 1;
    this.modelIdCounter = 1;
    this.reviewIdCounter = 1;
    this.newsIdCounter = 1;
    this.rewardIdCounter = 1;
    
    this.seedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      points: 0,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserPoints(userId: number, pointsToAdd: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      points: user.points + pointsToAdd 
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // AI Model methods
  async getAiModels(category?: string, sortBy: string = 'avgRating'): Promise<AiModel[]> {
    let models = Array.from(this.aiModels.values());
    
    if (category && category !== 'All Categories') {
      models = models.filter(model => model.category === category);
    }
    
    // Sort models based on the sortBy parameter
    switch (sortBy) {
      case 'avgRating':
        models.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case 'reviewCount':
        models.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        models.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        models.sort((a, b) => b.avgRating - a.avgRating);
    }
    
    return models;
  }

  async getAiModel(id: number): Promise<AiModel | undefined> {
    return this.aiModels.get(id);
  }

  async createAiModel(model: InsertAiModel): Promise<AiModel> {
    const id = this.modelIdCounter++;
    const now = new Date();
    const aiModel: AiModel = {
      ...model,
      id,
      avgRating: 0,
      reviewCount: 0,
      accuracyScore: 0,
      easeOfUseScore: 0,
      innovationScore: 0,
      createdAt: now
    };
    this.aiModels.set(id, aiModel);
    return aiModel;
  }
  
  async updateModelRatings(modelId: number): Promise<AiModel | undefined> {
    const model = this.aiModels.get(modelId);
    if (!model) return undefined;
    
    // Get all reviews for this model
    const modelReviews = Array.from(this.reviews.values())
      .filter(review => review.modelId === modelId);
    
    if (modelReviews.length === 0) return model;
    
    // Calculate average scores
    const avgRating = modelReviews.reduce((sum, review) => sum + review.rating, 0) / modelReviews.length;
    const accuracyScore = modelReviews.reduce((sum, review) => sum + review.accuracyRating, 0) / modelReviews.length;
    const easeOfUseScore = modelReviews.reduce((sum, review) => sum + review.easeOfUseRating, 0) / modelReviews.length;
    const innovationScore = modelReviews.reduce((sum, review) => sum + review.innovationRating, 0) / modelReviews.length;
    
    const updatedModel: AiModel = {
      ...model,
      avgRating,
      reviewCount: modelReviews.length,
      accuracyScore,
      easeOfUseScore,
      innovationScore
    };
    
    this.aiModels.set(modelId, updatedModel);
    return updatedModel;
  }
  
  // Review methods
  async getReviews(modelId?: number, limit: number = 10): Promise<Review[]> {
    let modelReviews = Array.from(this.reviews.values());
    
    if (modelId) {
      modelReviews = modelReviews.filter(review => review.modelId === modelId);
    }
    
    // Sort by newest first
    modelReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return modelReviews.slice(0, limit);
  }

  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const now = new Date();
    const newReview: Review = {
      ...review,
      id,
      helpfulVotes: 0,
      commentCount: 0,
      createdAt: now
    };
    this.reviews.set(id, newReview);
    
    // Update the model ratings
    await this.updateModelRatings(review.modelId);
    
    // Add points to user for creating a review
    const pointsForReview = 50;
    const pointsForMedia = review.mediaUrls && review.mediaUrls.length > 0 ? 20 : 0;
    await this.updateUserPoints(review.userId, pointsForReview + pointsForMedia);
    
    return newReview;
  }
  
  async updateReviewHelpfulVotes(reviewId: number, increment: number): Promise<Review | undefined> {
    const review = this.reviews.get(reviewId);
    if (!review) return undefined;
    
    const updatedReview: Review = {
      ...review,
      helpfulVotes: review.helpfulVotes + increment
    };
    this.reviews.set(reviewId, updatedReview);
    
    // Add points to the review author for getting an upvote
    if (increment > 0) {
      await this.updateUserPoints(review.userId, 5);
    }
    
    return updatedReview;
  }
  
  // News methods
  async getNewsArticles(limit: number = 10): Promise<NewsArticle[]> {
    const articles = Array.from(this.newsArticles.values());
    
    // Sort by newest first
    articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return articles.slice(0, limit);
  }

  async getNewsArticle(id: number): Promise<NewsArticle | undefined> {
    return this.newsArticles.get(id);
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const id = this.newsIdCounter++;
    const now = new Date();
    const newsArticle: NewsArticle = {
      ...article,
      id,
      createdAt: now
    };
    this.newsArticles.set(id, newsArticle);
    return newsArticle;
  }
  
  // Reward methods
  async getRewards(): Promise<Reward[]> {
    return Array.from(this.rewards.values());
  }

  async getReward(id: number): Promise<Reward | undefined> {
    return this.rewards.get(id);
  }

  async createReward(reward: InsertReward): Promise<Reward> {
    const id = this.rewardIdCounter++;
    const newReward: Reward = {
      ...reward,
      id
    };
    this.rewards.set(id, newReward);
    return newReward;
  }
  
  // Seed with initial data
  private seedData() {
    // Seed users
    const user1: User = {
      id: this.userIdCounter++,
      username: "alexjohnson",
      password: "password123",
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      points: 750,
      createdAt: new Date()
    };
    
    const user2: User = {
      id: this.userIdCounter++,
      username: "sarahmiller",
      password: "password123",
      name: "Sarah Miller",
      email: "sarah@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
      points: 620,
      createdAt: new Date()
    };
    
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    
    // Seed AI models
    const model1: AiModel = {
      id: this.modelIdCounter++,
      name: "GPT-4",
      description: "Advanced natural language processing model by OpenAI that can understand and generate human-like text.",
      category: "Text Generation",
      provider: "OpenAI",
      imageUrl: "https://images.unsplash.com/photo-1673299293952-5b8e1558dc3d?auto=format&fit=crop&q=80&w=600",
      releaseDate: new Date("2023-03-14"),
      
      // User ratings
      avgRating: 4.9,
      reviewCount: 2341,
      accuracyScore: 9.5,
      easeOfUseScore: 9.0,
      innovationScore: 9.8,
      
      // Technical metrics
      reasoningScore: 9.7,
      knowledgeScore: 9.5, 
      speedScore: 8.8,
      contextWindow: 128000,
      trainingCutoff: "April 2023",
      costPerToken: 0.06,
      
      // Performance metrics
      wordErrorRate: 0.04,
      speedFactor: 165,
      aiScore: 9.6,
      
      // Additional details
      capabilities: ["Text generation", "Code generation", "Data analysis", "Reasoning", "Translation"],
      technicalDetails: {
        parameters: "1.76 trillion",
        architecture: "Transformer",
        training: "Reinforcement Learning from Human Feedback",
        modality: "Text, Image"
      },
      createdAt: new Date()
    };
    
    const model2: AiModel = {
      id: this.modelIdCounter++,
      name: "Midjourney",
      description: "AI-powered text-to-image generator that creates stunning artwork and visual content from text descriptions.",
      category: "Image Generation",
      provider: "Midjourney Inc.",
      imageUrl: "https://images.unsplash.com/photo-1679958157985-8a93c00e731c?auto=format&fit=crop&q=80&w=600",
      releaseDate: new Date("2023-07-27"),
      
      // User ratings
      avgRating: 4.8,
      reviewCount: 1982,
      accuracyScore: 9.2,
      easeOfUseScore: 8.5,
      innovationScore: 9.6,
      
      // Technical metrics
      reasoningScore: 7.2,
      knowledgeScore: 8.9, 
      speedScore: 9.4,
      contextWindow: 0,
      trainingCutoff: "June 2023",
      costPerToken: 0.0,
      
      // Performance metrics
      wordErrorRate: 0.0,
      speedFactor: 132,
      aiScore: 9.2,
      
      // Additional details
      capabilities: ["Image generation", "Style transfer", "Art creation", "Design visualization"],
      technicalDetails: {
        architecture: "Diffusion model",
        training: "Contrastive learning",
        modality: "Text to Image"
      },
      createdAt: new Date()
    };
    
    const model3: AiModel = {
      id: this.modelIdCounter++,
      name: "Claude",
      description: "AI assistant by Anthropic designed to be helpful, harmless, and honest in its responses to complex queries.",
      category: "Text Generation",
      provider: "Anthropic",
      imageUrl: "https://images.unsplash.com/photo-1684391962108-ab2d561846a4?auto=format&fit=crop&q=80&w=600",
      releaseDate: new Date("2023-12-15"),
      
      // User ratings
      avgRating: 4.7,
      reviewCount: 1740,
      accuracyScore: 9.4,
      easeOfUseScore: 9.2,
      innovationScore: 9.3,
      
      // Technical metrics
      reasoningScore: 9.5,
      knowledgeScore: 9.2, 
      speedScore: 9.0,
      contextWindow: 100000,
      trainingCutoff: "January 2023",
      costPerToken: 0.045,
      
      // Performance metrics
      wordErrorRate: 0.038,
      speedFactor: 178,
      aiScore: 9.4,
      
      // Additional details
      capabilities: ["Text generation", "Summarization", "Content creation", "Reasoning", "Translation"],
      technicalDetails: {
        parameters: "1.5 trillion",
        architecture: "Transformer",
        training: "Constitutional AI",
        modality: "Text" 
      },
      createdAt: new Date()
    };
    
    this.aiModels.set(model1.id, model1);
    this.aiModels.set(model2.id, model2);
    this.aiModels.set(model3.id, model3);
    
    // Seed reviews
    const review1: Review = {
      id: this.reviewIdCounter++,
      userId: user1.id,
      modelId: model1.id,
      title: "Revolutionized my workflow completely",
      content: "GPT-4 has significantly improved my content creation process. It helps me draft articles, brainstorm ideas, and even debug code much faster than before. The responses are noticeably more nuanced and accurate than previous versions.",
      rating: 5,
      accuracyRating: 5,
      easeOfUseRating: 4,
      innovationRating: 5,
      mediaUrls: [],
      helpfulVotes: 42,
      commentCount: 12,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    };
    
    const review2: Review = {
      id: this.reviewIdCounter++,
      userId: user2.id,
      modelId: model2.id,
      title: "Amazing creative tool with a learning curve",
      content: "Midjourney creates stunning images that I use for my design projects. The quality is incredible but mastering the prompts takes time. V5 is a huge improvement over previous versions in terms of realism and detail.",
      rating: 4,
      accuracyRating: 4,
      easeOfUseRating: 3,
      innovationRating: 5,
      mediaUrls: [],
      helpfulVotes: 37,
      commentCount: 8,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    };
    
    this.reviews.set(review1.id, review1);
    this.reviews.set(review2.id, review2);
    
    // Seed news articles
    const news1: NewsArticle = {
      id: this.newsIdCounter++,
      title: "OpenAI Releases GPT-4o with Enhanced Multimodal Capabilities",
      content: "OpenAI has released GPT-4o, featuring improved image understanding, audio processing, and faster response times. The model is available to developers and enterprise customers.",
      category: "PRODUCT LAUNCH",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780acdf692?auto=format&fit=crop&q=80&w=600",
      summary: "OpenAI has announced GPT-4o, featuring improved image understanding, audio processing, and faster response times.",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    };
    
    const news2: NewsArticle = {
      id: this.newsIdCounter++,
      title: "EU Announces New AI Regulatory Framework",
      content: "The European Union has unveiled a comprehensive framework for regulating artificial intelligence, focusing on transparency, ethics, and safety. The framework categorizes AI systems based on risk levels.",
      category: "REGULATION",
      imageUrl: "https://images.unsplash.com/photo-1684391962108-ab2d561846a4?auto=format&fit=crop&q=80&w=600",
      summary: "The European Union has revealed a comprehensive framework for regulating artificial intelligence, focusing on transparency and ethics.",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    };
    
    const news3: NewsArticle = {
      id: this.newsIdCounter++,
      title: "Breakthrough in AI Training Reduces Computational Requirements by 70%",
      content: "Researchers have developed a new methodology that significantly reduces the computational resources needed for training large language models, potentially democratizing AI development.",
      category: "RESEARCH",
      imageUrl: "https://images.unsplash.com/photo-1655720036434-905bf347e58a?auto=format&fit=crop&q=80&w=600",
      summary: "Researchers have developed a new training methodology that significantly reduces the computational power needed for AI model training.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    };
    
    this.newsArticles.set(news1.id, news1);
    this.newsArticles.set(news2.id, news2);
    this.newsArticles.set(news3.id, news3);
    
    // Seed rewards
    const reward1: Reward = {
      id: this.rewardIdCounter++,
      name: "AI Conference Ticket Discount",
      description: "Get 50% off on tickets to the Annual AI Innovation Summit",
      pointsCost: 1000,
      imageUrl: "https://example.com/reward1.jpg",
      isAvailable: true
    };
    
    const reward2: Reward = {
      id: this.rewardIdCounter++,
      name: "Premium AI Model Access",
      description: "One month free access to premium features of top AI models",
      pointsCost: 750,
      imageUrl: "https://example.com/reward2.jpg",
      isAvailable: true
    };
    
    this.rewards.set(reward1.id, reward1);
    this.rewards.set(reward2.id, reward2);
  }
}

export const storage = new MemStorage();
