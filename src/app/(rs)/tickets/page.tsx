import { Metadata } from "next";
import TicketSearch from "@/app/(rs)/tickets/TicketSearch";
import getTicketSearchResults from "@/lib/queries/getTicketSearchResults";
import getOpenTickets from "@/lib/queries/getOpenTickets";

export const metadata: Metadata = {
  title: "Ticket search",
};

export default async function Tickets({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;

  if (!searchText) {
    // default query results
    const results = await getOpenTickets();
    return (
      <>
        <TicketSearch />
        <p>{JSON.stringify(results, null, 2)}</p>
      </>
    );
  }

  // query results
  const results = await getTicketSearchResults(searchText);

  return (
    <>
      <TicketSearch />
      <p>{JSON.stringify(results, null, 2)}</p>
    </>
  );
}
