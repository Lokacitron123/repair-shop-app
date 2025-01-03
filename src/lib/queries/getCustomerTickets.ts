import { db } from "@/db";

import { tickets } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getCustomerTickets(id: number) {
  const results = await db
    .select({
      id: tickets.id,
      customerId: tickets.customerId,
      createdAt: tickets.createdAt,
      updatedAt: tickets.updatedAt,
      description: tickets.description || null,
      title: tickets.title,
      completed: tickets.completed,
      tech: tickets.tech,
    })
    .from(tickets)
    .where(eq(tickets.customerId, id))
    .orderBy(asc(tickets.createdAt));

  return results;
}
