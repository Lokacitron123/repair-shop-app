import { Metadata } from "next";
import TicketSearch from "@/app/(rs)/tickets/TicketSearch";
import getTicketSearchResults from "@/lib/queries/getTicketSearchResults";
import getOpenTickets from "@/lib/queries/getOpenTickets";
import TicketTable from "./TicketTable";

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
        {results.length ? (
          <TicketTable data={results} />
        ) : (
          <p className='mt-4'>No open tickets found</p>
        )}
      </>
    );
  }

  // query results
  const results = await getTicketSearchResults(searchText);

  return (
    <>
      <TicketSearch />
      {results.length ? (
        <TicketTable data={results} />
      ) : (
        <p className='mt-4'>No results found</p>
      )}
    </>
  );
}
