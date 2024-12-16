import { BackButton } from "@/components/BackButton";
import { getCustomer } from "@/lib/queries/getCustomer";

export default async function CustomerFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { customerId } = await searchParams;

    if (customerId) {
      const customer = await getCustomer(parseInt(customerId));
      console.log("customer: ", customer);
      if (!customer) {
        return (
          <>
            <h2 className='text-2xl mb-2'>
              CustomerID ${customerId} not found
            </h2>
            <BackButton title='Go Back' variant={"default"} />
          </>
        );
      } else {
        return (
          <>
            <h2 className='text-2xl mb-2'>Edit Customer #{customerId}</h2>
          </>
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
}
