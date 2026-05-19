import { ForumRepository } from "@/repositories/forum.repository";
import { notFound } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Suspense } from "react";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateCommentForm } from "@/features/forum/components/create-comment-form";
import { VoteButtons } from "@/features/forum/components/vote-buttons";

export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const thread = await ForumRepository.getThreadById(params.id);
    if (!thread) return { title: "Thread Not Found" };
    return { title: `${thread.title} | CampusConnect` };
  } catch {
    return { title: "Thread Error" };
  }
}

export const dynamic = 'force-dynamic';

export default async function ThreadPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  try {
    const thread = await ForumRepository.getThreadById(params.id);

    if (!thread) {
      notFound();
    }

    return (
      <div className="container max-w-4xl py-6 lg:py-10 space-y-8">
        {/* Thread Content */}
        <div className="glass-card p-6">
          <div className="flex gap-6">
            <VoteButtons targetId={thread.id} targetType="THREAD" initialVotes={thread.votes.reduce((acc, vote) => acc + vote.type, 0)} />
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{thread.author?.name || "Unknown User"}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                <span>in</span>
                <Link href={`/forum?category=${thread.category.id}`} className="hover:underline text-primary">
                  {thread.category.name}
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tighter">
                {thread.title}
              </h1>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                {thread.content}
              </div>
              {thread.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4">
                  {thread.tags.map(tag => (
                    <span key={tag.id} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground border-t border-border/50 mt-6">
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{thread._count.comments} comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div id="comments" className="space-y-6">
          <h3 className="text-xl font-semibold">Comments</h3>
          <div className="mb-6">
            <CreateCommentForm threadId={thread.id} />
          </div>
          <Suspense fallback={<LoadingState message="Loading comments..." />}>
            <CommentsList threadId={thread.id} />
          </Suspense>
        </div>
      </div>
    );
  } catch (e) {
    notFound();
  }
}

async function CommentsList({ threadId }: { threadId: string }) {
  try {
    const comments = await ForumRepository.getCommentsByThreadId(threadId);

    if (comments.length === 0) {
      return <EmptyState title="No comments yet" description="Be the first to share your thoughts!" />;
    }

    // Very basic render for now, does not handle deep nesting yet
    return (
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="glass-card p-4">
            <div className="flex gap-4">
              <VoteButtons targetId={comment.id} targetType="COMMENT" initialVotes={comment.votes.reduce((acc, vote) => acc + vote.type, 0)} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{comment.author?.name || "Unknown User"}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  } catch {
    return <EmptyState title="Error" description="Could not load comments" />;
  }
}
