"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LinkForm } from "@/components/forms/link-form";
import { Plus } from "lucide-react";

export function CreateLinkButton() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Create Link
      </Button>

      <LinkForm open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
}
