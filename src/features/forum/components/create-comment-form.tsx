"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCommentSchema } from "@/types/forum.types";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { createCommentAction } from "@/actions/forum.actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateCommentForm({ threadId, parentId }: { threadId: string; parentId?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateCommentSchema>>({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      content: "",
      threadId,
      parentId,
    },
  });

  async function onSubmit(values: z.infer<typeof CreateCommentSchema>) {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("content", values.content);
      formData.append("threadId", values.threadId);
      if (values.parentId) {
        formData.append("parentId", values.parentId);
      }

      await createCommentAction(formData);
      form.reset();
      router.refresh(); // Refresh page to see new comments
    } catch (error) {
      console.error(error);
      alert("Failed to submit comment. Please ensure you are logged in.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Write a comment..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
