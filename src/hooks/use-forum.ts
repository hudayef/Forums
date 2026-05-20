"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteAction } from "@/actions/forum.actions";

export function useVoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      targetId: string;
      targetType: "THREAD" | "COMMENT";
      value: number;
    }) => voteAction(data),
    onSuccess: (data, variables) => {
      // Optimistic cache invalidation for threads list and specific thread details
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      if (variables.targetType === "THREAD") {
        queryClient.invalidateQueries({
          queryKey: ["thread", variables.targetId],
        });
      }
    },
  });
}
