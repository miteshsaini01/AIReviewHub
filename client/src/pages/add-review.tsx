import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchAiModelById, createReview } from "@/lib/data";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Rating } from "@/components/ui/rating";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form schema
const reviewSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),
  content: z.string().min(20, "Review must be at least 20 characters").max(1000, "Review must be less than 1000 characters"),
  rating: z.number().min(1, "Please provide an overall rating").max(5),
  accuracyRating: z.number().min(1, "Please rate accuracy").max(5),
  easeOfUseRating: z.number().min(1, "Please rate ease of use").max(5),
  innovationRating: z.number().min(1, "Please rate innovation").max(5),
  modelId: z.number().min(1)
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

const AddReview = () => {
  const [, setLocation] = useLocation();
  const [, params] = useRoute<{ modelId?: string }>("/add-review");
  const { toast } = useToast();
  
  // Get modelId from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const modelIdParam = urlParams.get('modelId') || params?.modelId || "";
  
  const [selectedModelId, setSelectedModelId] = useState<number>(
    modelIdParam ? parseInt(modelIdParam) : 0
  );
  
  // Fetch the model if we have an ID
  const { data: model, isLoading: isModelLoading } = useQuery({
    queryKey: [`/api/models/${selectedModelId}`],
    queryFn: () => fetchAiModelById(selectedModelId),
    enabled: selectedModelId > 0
  });
  
  // Fetch all models for the dropdown
  const { data: models, isLoading: isModelsLoading } = useQuery({
    queryKey: ['/api/models'],
    queryFn: () => fetchAiModels()
  });
  
  // Form setup
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: "",
      content: "",
      rating: 0,
      accuracyRating: 0,
      easeOfUseRating: 0,
      innovationRating: 0,
      modelId: selectedModelId || 0
    }
  });
  
  // Update form when model is selected
  const onModelSelect = (modelId: string) => {
    const id = parseInt(modelId);
    setSelectedModelId(id);
    form.setValue("modelId", id);
  };
  
  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: (data: ReviewFormValues) => {
      // In a real app, this would be the logged-in user's ID
      const userId = 1;
      return createReview({ ...data, userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/models'] });
      queryClient.invalidateQueries({ queryKey: ['/api/reviews'] });
      queryClient.invalidateQueries({ queryKey: [`/api/models/${selectedModelId}`] });
      
      toast({
        title: "Review submitted successfully",
        description: "Thank you for your contribution!",
      });
      
      // Redirect to model page
      setLocation(`/model/${selectedModelId}`);
    },
    onError: (error) => {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Form submission handler
  const onSubmit = (data: ReviewFormValues) => {
    submitMutation.mutate(data);
  };

  return (
    <div className="bg-neutral-50 text-neutral-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">Add Review</CardTitle>
            <CardDescription>
              Share your experience with an AI model and help others make informed decisions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Model Selection */}
                <FormField
                  control={form.control}
                  name="modelId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select AI Model</FormLabel>
                      <Select
                        value={selectedModelId.toString()}
                        onValueChange={onModelSelect}
                        disabled={isModelsLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a model to review" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isModelsLoading ? (
                            <div className="p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : models && models.length > 0 ? (
                            models.map((model) => (
                              <SelectItem key={model.id} value={model.id.toString()}>
                                {model.name}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-neutral-500">No models available</div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Model Info */}
                {selectedModelId > 0 && (
                  <div className="bg-neutral-50 p-4 rounded-md">
                    {isModelLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ) : model ? (
                      <div>
                        <h3 className="font-bold text-lg">{model.name}</h3>
                        <p className="text-sm text-neutral-600">{model.description}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-500">Model information not available</p>
                    )}
                  </div>
                )}
                
                {/* Review Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Summarize your experience in a title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Review Content */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Review</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your experience with this AI model..."
                          className="min-h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Explain what you liked or disliked, specific use cases, and any tips for others.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Overall Rating */}
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overall Rating</FormLabel>
                      <FormControl>
                        <div>
                          <Rating 
                            value={field.value} 
                            readOnly={false}
                            onChange={field.onChange}
                            size="lg"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Rating Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Accuracy Rating */}
                  <FormField
                    control={form.control}
                    name="accuracyRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accuracy</FormLabel>
                        <FormControl>
                          <div>
                            <Rating 
                              value={field.value} 
                              readOnly={false}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Ease of Use Rating */}
                  <FormField
                    control={form.control}
                    name="easeOfUseRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ease of Use</FormLabel>
                        <FormControl>
                          <div>
                            <Rating 
                              value={field.value} 
                              readOnly={false}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Innovation Rating */}
                  <FormField
                    control={form.control}
                    name="innovationRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Innovation</FormLabel>
                        <FormControl>
                          <div>
                            <Rating 
                              value={field.value} 
                              readOnly={false}
                              onChange={field.onChange}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={submitMutation.isPending || !selectedModelId}
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddReview;
