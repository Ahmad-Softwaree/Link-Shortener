"use client";

import { useState } from "react";
import { CreateLinkButton } from "@/components/dashboard/create-link-button";
import { LinkCard } from "@/components/cards/link-card";
import { InfiniteList } from "@/components/shared/infinite-list";
import { SearchBar } from "@/components/shared/search-bar";
import { useGetUserLinksInfinite } from "@/queries/links";
import { FileQuestion } from "lucide-react";
import { motion } from "framer-motion";
import type { Link } from "@/db/schema";

export function DashboardContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserLinksInfinite(9, searchQuery);

  return (
    <div className=" mx-auto px-4 py-8">
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

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by URL or short code..."
          className="max-w-md"
        />
      </motion.div>

      <InfiniteList<Link>
        data={data?.items || []}
        renderItem={(link, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}>
            <LinkCard link={link} />
          </motion.div>
        )}
        getItemKey={(link) => link.id}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        error={error}
        emptyState={{
          icon: FileQuestion,
          title: searchQuery ? "No links found" : "No links yet",
          description: searchQuery
            ? `No links match "${searchQuery}". Try a different search term.`
            : "Create your first shortened link to get started. Click the button above to begin.",
        }}
        errorState={{
          title: "Failed to load links",
          message: "There was an error loading your links. Please try again.",
        }}
        loadingState={{
          message: searchQuery
            ? `Searching for "${searchQuery}"...`
            : "Loading your links...",
        }}
        gridClassName="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        loadMoreTrigger="scroll"
      />
    </div>
  );
}
