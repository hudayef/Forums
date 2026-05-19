"use client";

import { useVoteMutation } from "@/hooks/use-forum";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";

interface VoteButtonsProps {
  targetId: string;
  targetType: "THREAD" | "COMMENT";
  initialVotes: number;
  // Note: in a real app, we'd also pass initialUserVote (1, -1, or 0)
  // to light up the active button. Keeping simple for now based on schema.
}

export function VoteButtons({ targetId, targetType, initialVotes }: VoteButtonsProps) {
  const [votes, setVotes] = useState(initialVotes);
  const voteMutation = useVoteMutation();

  const handleVote = (value: number) => {
    // Optimistic local update (simplified, assumes we just add the value)
    // A robust version would check previous vote state
    setVotes((prev) => prev + value);

    voteMutation.mutate({ targetId, targetType, value });
  };

  return (
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <button
        onClick={() => handleVote(1)}
        className="hover:text-primary transition-colors disabled:opacity-50"
        disabled={voteMutation.isPending}
      >
        <ArrowUp className="h-6 w-6" />
      </button>
      <span className="text-lg font-bold">{votes}</span>
      <button
        onClick={() => handleVote(-1)}
        className="hover:text-destructive transition-colors disabled:opacity-50"
        disabled={voteMutation.isPending}
      >
        <ArrowDown className="h-6 w-6" />
      </button>
    </div>
  );
}
