import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { customers } from "@/db/schema";

export const insertCustomerSchema = createInsertSchema(customers, {
  firstName: (schema) => schema.firstName.min(1, "First name is required"),
  lastName: (schema) => schema.lastName.min(1, "Last name is required"),
  address1: (schema) => schema.address1.min(1, "Address is required"),
  city: (schema) => schema.city.min(1, "City is required"),
  state: (schema) =>
    schema.state.length(2, "State must be exactly 2 characters"),
  email: (schema) => schema.email.email("Invalid email address").min(1),
  zip: (schema) =>
    schema.zip.regex(
      /^\d{5}(-\d{4})?$/,
      "Invalid Zip code. Use example: 12345 or 12345-6789"
    ),
  phone: (schema) =>
    schema.phone.regex(
      /^\d{3}-\d{3}-\d{4}$/,
      "Invalid phone number format. Use example: 123-456-7890"
    ),
});

export const selectCustomerSchema = createSelectSchema(customers);

export type insertCustomerSchemaType = typeof insertCustomerSchema._type;

export type selectCustomerSchemaType = typeof selectCustomerSchema._type;
