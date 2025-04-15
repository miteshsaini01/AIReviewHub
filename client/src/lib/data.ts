import { AiModel, NewsArticle, Review, Reward, User } from "@shared/schema";

// Function to format relative time (e.g., "2 days ago")
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const pastDate = new Date(date);
  const diffInMilliseconds = now.getTime() - pastDate.getTime();
  
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInDays > 0) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return `${diffInSeconds} ${diffInSeconds === 1 ? 'second' : 'seconds'} ago`;
  }
}

// Function to format rating to one decimal place
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

// Function to convert a rating from 0-5 scale to 0-10 scale
export function convertRatingScale(rating: number): number {
  return (rating / 5) * 10;
}

// Function to get CSS width percentage from a rating (0-10)
export function getRatingPercentage(rating: number): string {
  return `${rating * 10}%`;
}

// Function to get user by ID
export async function fetchUserById(userId: number): Promise<User> {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}

// Function to get all AI models
export async function fetchAiModels(category?: string, sortBy?: string): Promise<AiModel[]> {
  let url = '/api/models';
  const params = new URLSearchParams();
  
  if (category) params.append('category', category);
  if (sortBy) params.append('sortBy', sortBy);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch AI models');
  return response.json();
}

// Function to get an AI model by ID
export async function fetchAiModelById(modelId: number): Promise<AiModel> {
  const response = await fetch(`/api/models/${modelId}`);
  if (!response.ok) throw new Error('Failed to fetch AI model');
  return response.json();
}

// Function to get reviews for a specific model
export async function fetchReviewsByModelId(modelId: number, limit?: number): Promise<Review[]> {
  let url = `/api/reviews?modelId=${modelId}`;
  if (limit) url += `&limit=${limit}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
}

// Function to get recent reviews
export async function fetchRecentReviews(limit?: number): Promise<Review[]> {
  let url = '/api/reviews';
  if (limit) url += `?limit=${limit}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch recent reviews');
  return response.json();
}

// Function to get a review by ID
export async function fetchReviewById(reviewId: number): Promise<Review> {
  const response = await fetch(`/api/reviews/${reviewId}`);
  if (!response.ok) throw new Error('Failed to fetch review');
  return response.json();
}

// Function to create a new review
export async function createReview(reviewData: any): Promise<Review> {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData)
  });
  
  if (!response.ok) throw new Error('Failed to create review');
  return response.json();
}

// Function to mark a review as helpful
export async function markReviewAsHelpful(reviewId: number): Promise<Review> {
  const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
    method: 'PATCH'
  });
  
  if (!response.ok) throw new Error('Failed to mark review as helpful');
  return response.json();
}

// Function to get news articles
export async function fetchNewsArticles(limit?: number): Promise<NewsArticle[]> {
  let url = '/api/news';
  if (limit) url += `?limit=${limit}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch news articles');
  return response.json();
}

// Function to get a news article by ID
export async function fetchNewsArticleById(articleId: number): Promise<NewsArticle> {
  const response = await fetch(`/api/news/${articleId}`);
  if (!response.ok) throw new Error('Failed to fetch news article');
  return response.json();
}

// Function to get rewards
export async function fetchRewards(): Promise<Reward[]> {
  const response = await fetch('/api/rewards');
  if (!response.ok) throw new Error('Failed to fetch rewards');
  return response.json();
}

// Function to get site statistics
export async function fetchSiteStats(): Promise<{
  modelCount: number;
  reviewCount: number;
  userCount: number;
  rewardsClaimed: number;
}> {
  const response = await fetch('/api/stats');
  if (!response.ok) throw new Error('Failed to fetch site statistics');
  return response.json();
}
