"use client";

import { LinkList } from "@/components/dashboard/link-list";
import { CreateLinkButton } from "@/components/dashboard/create-link-button";
import type { Link } from "@/db/schema";
import { motion } from "framer-motion";

interface DashboardContentProps {
  links: Link[];
}

export function DashboardContent({ links }: DashboardContentProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold mb-2">
            Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground">
            Manage your shortened links
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}>
          <CreateLinkButton />
        </motion.div>
      </motion.div>

      <LinkList links={links} />
    </div>
  );
}
