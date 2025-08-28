"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import React, { use, useState } from "react";

import { toast } from "@/hooks/use-toast";
import action from "@/lib/handlers/action";
import { formatNumber } from "@/lib/utils";
import { createVote } from "@/lib/actions/vote.action";
interface Params {
  targetType: "question" | "answer";
  targetId: string;
  upvotes: number;
  downvotes: number;
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}
const Votes = ({
  upvotes,
  downvotes,
  hasVotedPromise,
  targetId,
  targetType,
}: Params) => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [isLoading, setIsLoading] = useState(false);
  const { success, data } = use(hasVotedPromise);

  const { hasUpvoted, hasDownvoted } = data || {};
  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      return toast({
        title: "Please login to vote",
        description: "You need to be logged in to cast your vote.",
        variant: "destructive",
      });
    }
    setIsLoading(true);
    try {
      const result = await createVote({
        targetId,
        targetType,
        voteType,
      });
      if (!result.success) {
        return toast({
          title: "Failed to process vote",
          description:
            result.error?.message ||
            "An error occurred while processing your vote.",
          variant: "destructive",
        });
      }
      const successMessage =
        voteType === "upvote"
          ? `Upvote ${hasUpvoted ? "added" : "removed"}`
          : `Downvote ${hasDownvoted ? "added" : "removed"}`;
      toast({
        title: successMessage,
        description: `Your ${voteType} has been successfully processed.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "An error occurred while processing your vote.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
          }
          width={18}
          height={18}
          alt="upvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}
            `}
          aria-label="upvote"
          onClick={() => !isLoading && handleVote("upvote")}
        ></Image>
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(upvotes)}
          </p>
        </div>
      </div>
      <div className="flex-center gap-1.5">
        <Image
          src={
            success && hasDownvoted
              ? "/icons/downvoted.svg"
              : "/icons/downvote.svg"
          }
          width={18}
          height={18}
          alt="downvote"
          className={`cursor-pointer ${isLoading && "opacity-50"}
            `}
          aria-label="downvote"
          onClick={() => !isLoading && handleVote("downvote")}
        ></Image>
        <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
          <p className="subtle-medium text-dark400_light900">
            {formatNumber(downvotes)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Votes;
