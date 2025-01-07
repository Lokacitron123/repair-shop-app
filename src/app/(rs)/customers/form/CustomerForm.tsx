"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { SelectWithLabel } from "@/components/inputs/SelectWithLabel";
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel";

import {
  insertCustomerSchema,
  type insertCustomerSchemaType,
  type selectCustomerSchemaType,
} from "@/zod-schemas/customer";

import { RegionsArray } from "@/constants/StatesArray";
import { useAction } from "next-safe-action/hooks";
import { saveCustomerAction } from "@/app/actions/saveCustomerACtion";
import { useToast } from "@/hooks/use-toast";
import { DisplayServerActionResponse } from "@/components/DisplayServerActionResponse";
import { selectTicketSchemaType } from "@/zod-schemas/ticket";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Props = {
  customer?: selectCustomerSchemaType;
  tickets?: selectTicketSchemaType[];
  isManager?: boolean | undefined;
};

export default function CustomerForm({
  customer,
  tickets,
  isManager = false,
}: Props) {
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const hasCustomerId = searchParams.has("customerId");

  const emptyValues: insertCustomerSchemaType = {
    id: 0,
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    notes: "",
    active: true,
  };

  const defaultValues: insertCustomerSchemaType = hasCustomerId
    ? {
        id: customer?.id ?? 0,
        firstName: customer?.firstName ?? "",
        lastName: customer?.lastName ?? "",
        address1: customer?.address1 ?? "",
        address2: customer?.address2 ?? "",
        city: customer?.city ?? "",
        state: customer?.state ?? "",
        zip: customer?.zip ?? "",
        phone: customer?.phone ?? "",
        email: customer?.email ?? "",
        notes: customer?.notes ?? "",
        active: customer?.active ?? true,
      }
    : emptyValues;

  const form = useForm<insertCustomerSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertCustomerSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(hasCustomerId ? defaultValues : emptyValues);
  }, [hasCustomerId]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    execute: executeSave,
    result: saveResult,
    isPending: isSaving,
    reset: resetSaveAction,
  } = useAction(saveCustomerAction, {
    onSuccess({ data }) {
      if (data?.message) {
        toast({
          variant: "default",
          title: "Success! 🎉",
          description: data?.message,
        });
      }
    },
    onError({ error }) {
      toast({
        variant: "destructive",
        title: "Error! ☹",
        description: "Save failed",
      });
    },
  });

  async function submitForm(data: insertCustomerSchemaType) {
    executeSave(data);
  }

  return (
    <div className='flex flex-col sm:flex-row justify-center w-full '>
      <div className='flex flex-col  gap-1 mb-10 sm:mb-0 mx-4 sm:px-8  sm:w-2/3 '>
        <DisplayServerActionResponse result={saveResult} />
        <div>
          <h2 className='text-2xl font-bold'>
            {customer?.id ? "Edit" : "New"} Customer{" "}
            {customer?.id ? `# ${customer.id}` : "Form"}
          </h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitForm)}
            className='flex flex-col md:flex-row gap-4 md:gap-8'
          >
            <div className='flex flex-col gap-4 w-full max-w-xs'>
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='First Name'
                nameInSchema='firstName'
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Last Name'
                nameInSchema='lastName'
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Address 1'
                nameInSchema='address1'
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Address 2'
                nameInSchema='address2'
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='City'
                nameInSchema='city'
              />

              {/* Select */}
              <SelectWithLabel<insertCustomerSchemaType>
                fieldTitle='State'
                nameInSchema='state'
                data={RegionsArray}
              />
            </div>
            <div className='flex flex-col gap-4 w-full max-w-xs'>
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Zip Code'
                nameInSchema='zip'
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Email'
                nameInSchema='email'
              />
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle='Phone'
                nameInSchema='phone'
              />

              {/* Text area */}
              <TextAreaWithLabel<insertCustomerSchemaType>
                fieldTitle='Notes'
                nameInSchema='notes'
                className='h-40'
              />

              {isManager && customer?.id ? (
                <CheckboxWithLabel<insertCustomerSchemaType>
                  fieldTitle='Active'
                  nameInSchema='active'
                  message='Yes'
                />
              ) : null}

              <div className='flex gap-2'>
                <Button
                  type='submit'
                  className='w-3/4'
                  variant={"default"}
                  title='Save'
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className='animate-spin' /> Saving{" "}
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  type='button'
                  variant={"destructive"}
                  title='Reset'
                  onClick={() => {
                    form.reset(defaultValues);
                    resetSaveAction();
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <div className='flex flex-col gap-1 sm:px-8 sm:w-1/3'>
        <h2 className='text-2xl font-bold'>Customer&apos;s Open Tickets</h2>
        <div className='flex flex-col gap-3'>
          {tickets?.length
            ? tickets.map((ticket) => (
                <div key={ticket.id}>
                  <h3>Ticket #{ticket.id}</h3>
                  <h4>{ticket.title}</h4>

                  <p>{}</p>
                  <hr className='divide-y-2 py-1' />
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
