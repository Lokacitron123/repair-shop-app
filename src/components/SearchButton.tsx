"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchButton() {
  const status = useFormStatus();

  return (
    <Button type='submit' disabled={status.pending} className='w-20'>
      {status.pending ? <Loader2 className='animate-spin' /> : "Search"}
    </Button>
  );
}
