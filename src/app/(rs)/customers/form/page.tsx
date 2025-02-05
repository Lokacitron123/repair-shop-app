import { BackButton } from "@/components/BackButton";
import { getCustomer } from "@/lib/queries/getCustomer";
import CustomerForm from "@/app/(rs)/customers/form/CustomerForm";
import { getCustomerTickets } from "@/lib/queries/getCustomerTickets";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId } = await searchParams;

  if (!customerId)
    return {
      title: "New Customer",
    };

  return {
    title: `Edit Customer #${customerId}`,
  };
}

export default async function CustomerFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { getPermission } = getKindeServerSession();
    const managerPermission = await getPermission("manager");
    const isManager = managerPermission?.isGranted;

    const { customerId } = await searchParams;

    // Edit customer form
    if (customerId) {
      const customer = await getCustomer(parseInt(customerId));
      const customerTickets = await getCustomerTickets(parseInt(customerId));

      if (!customer) {
        return (
          <>
            <h2 className='text-2xl mb-2'>
              Customer ID #{customerId} not found
            </h2>
            <BackButton title='Go Back' variant='default' />
          </>
        );
      }
      console.log(customer);
      // put customer form component
      return (
        <CustomerForm
          customer={customer}
          tickets={customerTickets}
          isManager={isManager}
        />
      );
    } else {
      // new customer form component
      return <CustomerForm isManager={isManager} />;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
}
