import { z } from "zod";

// Create property review schema
export const propertyReviewSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(3, "Name must be at least 3 characters long"),
  propertyId: z.coerce
    .number({
      required_error: "A valid Property ID is required",
      invalid_type_error: "Property ID must be a number",
    })
    .int("Property ID must be an integer")
    .min(1, "Please provide a valid Property ID"),
  comment: z
    .string({
      required_error: "Comment is required",
      invalid_type_error: "Comment must be a string",
    })
    .min(3, "Comment must be at least 3 characters long"),
  location: z
    .string({
      invalid_type_error: "Location must be a string",
    })
    .optional(),
  rating: z.coerce.number().int().min(1).max(5),
});

export type PropertyReviewFormValues = z.infer<typeof propertyReviewSchema>;