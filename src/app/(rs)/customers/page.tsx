import { Metadata } from "next";
import CustomerSearch from "@/app/(rs)/customers/CustomerSearch";
import getCustomerSearchResults from "@/lib/queries/getCustomerSearchResults";
import * as Sentry from "@sentry/nextjs";
import CustomerTable from "./form/CustomerTable";

export const metadata: Metadata = {
  title: "Customer Search",
};

export default async function Customers({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { searchText } = await searchParams;

  if (!searchText) {
    return <CustomerSearch />;
  }

  const span = Sentry.startInactiveSpan({ name: "getCustomerSearchResults-2" }); // Starts a trace that we can see in Sentry dashboard

  const results = await getCustomerSearchResults(searchText);

  span.end(); // Ends trace

  return (
    <>
      <CustomerSearch />
      {results.length ? (
        <CustomerTable data={results} />
      ) : (
        <p className='mt-4'>No results found</p>
      )}
    </>
  );
}
