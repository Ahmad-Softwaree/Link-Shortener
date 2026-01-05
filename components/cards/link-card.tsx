"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Link } from "@/db/schema";
import { ExternalLink, Copy, Trash2, Calendar, Edit } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { LinkForm } from "@/components/forms/link-form";
import { useDeleteLink } from "@/queries/links";
import { motion } from "framer-motion";

interface LinkCardProps {
  link: Link;
}

export function LinkCard({ link }: LinkCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // React Query mutation
  const deleteMutation = useDeleteLink();

  const shortUrl = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/l/${link.shortCode}`;
  const formattedDate = new Date(link.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Link copied to clipboard");
  };

  const handleDelete = () => {
    deleteMutation.mutate(link.id, {
      onSuccess: () => {
        setShowDeleteDialog(false);
      },
    });
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300 }}>
        <Card className="hover:shadow-md transition-shadow h-full">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg font-semibold break-all">
                /{link.shortCode}
              </CardTitle>
              <Badge variant="secondary" className="shrink-0">
                <Calendar className="mr-1 h-3 w-3" />
                {formattedDate}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Original URL</p>
              <p className="text-sm break-all line-clamp-2">
                {link.originalUrl}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Short URL</p>
              <p className="text-sm font-mono text-primary break-all">
                {shortUrl}
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit
                </a>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowEditDialog(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <LinkForm
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        initialData={link}
      />

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Link"
        description={`Are you sure you want to delete the link "/${link.shortCode}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
