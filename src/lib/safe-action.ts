import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";

export const actionClient = createSafeActionClient({
  // Defines the schema for metadata associated with safe actions.
  // In this case, it ensures that metadata includes a string field called "actionName".
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },

  // Handles server-side errors that occur during the execution of safe actions.
  // The `handleServerError` function logs the error using Sentry and provides a user-friendly message if needed.
  handleServerError(e, utils) {
    const { clientInput, metadata } = utils;

    // Logs the exception to Sentry, attaching additional context for debugging.
    Sentry.captureException(e, (scope) => {
      scope.clear(); // Clears any existing scope data for a fresh context.
      scope.setContext("serverError", { message: e.message }); // Adds the error message to the context.
      scope.setContext("metadata", { actionName: metadata?.actionName }); // Includes the action name metadata.
      scope.setContext("clientInput", { clientInput }); // Adds input data from the client for context.
      return scope;
    });

    // Checks if the error is a specific type (e.g., DatabaseError) and returns a custom message.
    // Prevents leaking sensitive details about the database in the error response.
    if (e.constructor.name === "DatabaseError") {
      return "Database Error: Your data did not save. Support will be notified.";
    }

    // For other errors, the error message is returned (e.g., generic or less sensitive messages).
    return e.message;
  },
});
