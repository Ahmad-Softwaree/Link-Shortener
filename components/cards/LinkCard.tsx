"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Link } from "@/lib/db/schema";
import { ExternalLink, Copy, Trash2, Calendar, Edit } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useModalStore } from "@/lib/store/modal.store";
import { useDeleteData } from "@/lib/react-query/queries/query";
import { links } from "@/lib/db/schema";
import { QUERY_KEYS } from "@/lib/react-query/keys";
import ActionTooltip from "@/components/shared/ActionTooltip";
import { formatDate } from "@/lib/functions";

interface LinkCardProps {
  link: Link;
}

export function LinkCard({ link }: LinkCardProps) {
  const { t } = useTranslation();
  const { openModal } = useModalStore();
  const deleteMutation = useDeleteData({
    table: links,
    queryKey: [QUERY_KEYS.LINKS.ALL],
    successMessage: t("toast.link_deleted"),
  });

  const shortUrl = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/l/${link.shortCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success(t("link.copied"));
    } catch (error) {
      toast.error(t("toast.error_occurred"));
    }
  };

  const handleEdit = () => {
    openModal({
      type: "update",
      modalData: link,
    });
  };

  const handleDelete = () => {
    openModal({
      type: "delete",
      id: link.id,
      modalData: link,
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/50 bg-card/50 backdrop-blur-sm h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold break-all text-foreground group-hover:text-primary transition-colors">
            /{link.shortCode}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0 shadow-sm">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDate(link.createdAt)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1 font-medium">
            {t("link.original_url")}
          </p>
          <p className="text-sm break-all line-clamp-2 text-foreground/90">
            {link.originalUrl}
          </p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1 font-medium">
            {t("link.short_url")}
          </p>
          <p className="text-sm font-mono text-primary break-all font-semibold">
            {shortUrl}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <ActionTooltip label={t("tooltip.copy")}>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
              onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              {t("link.copy")}
            </Button>
          </ActionTooltip>

          <ActionTooltip label={t("tooltip.visit")}>
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500 transition-all"
              asChild>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t("link.visit")}
              </a>
            </Button>
          </ActionTooltip>

          <ActionTooltip label={t("tooltip.update")}>
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500 transition-all"
              onClick={handleEdit}>
              <Edit className="h-4 w-4" />
            </Button>
          </ActionTooltip>

          <ActionTooltip label={t("tooltip.delete")}>
            <Button
              size="sm"
              variant="destructive"
              className="hover:bg-destructive/90 transition-all"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </ActionTooltip>
        </div>
      </CardContent>
    </Card>
  );
}
