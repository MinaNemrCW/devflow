"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import React, { use, useState } from "react";

import { toast } from "@/hooks/use-toast";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";

const SaveQuestion = ({
  questionId,
  hasSavedQuestionPromise,
}: {
  questionId: string;
  hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>>;
}) => {
  const session = useSession();
  const userId = session?.data?.user?.id;
  const { data } = use(hasSavedQuestionPromise);
  const { saved: hasSaved } = data || {};
  const [isLoading, setisLoading] = useState(false);
  const handleSave = async () => {
    if (isLoading) return;
    if (!userId)
      return toast({
        title: "You need to be logged in to save questions.",
        variant: "destructive",
      });
    setisLoading(true);
    try {
      const { success, data, error } = await toggleSaveQuestion({
        questionId,
      });
      if (!success) {
        throw new Error(error?.message || "Failed to save question.");
      }
      toast({
        title: `Question ${data?.saved ? "saved" : "unsaved"} successfully!`,
      });
    } catch (error) {
      toast({
        title: "Failed to save question.",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setisLoading(false);
    }
  };
  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="save"
      className={`cursor-pointer ${isLoading && "opacity-50"}`}
      aria-label="save question"
      onClick={handleSave}
    ></Image>
  );
};

export default SaveQuestion;
