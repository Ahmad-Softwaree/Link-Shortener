"use client";

import { LinkCard } from "@/components/cards/link-card";
import type { Link } from "@/db/schema";
import { FileQuestion, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LinkListProps {
  links: Link[];
  isLoading?: boolean;
}

export function LinkList({ links, isLoading }: LinkListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
          <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-semibold mb-2">
          No links yet
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground max-w-md">
          Create your first shortened link to get started. Click the button
          above to begin.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {links.map((link, index) => (
        <motion.div
          key={link.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}>
          <LinkCard link={link} />
        </motion.div>
      ))}
    </div>
  );
}
