"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateArticleSchema } from "@/types/article.types";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createArticleAction } from "@/actions/article.actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateArticleForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof CreateArticleSchema>>({
    resolver: zodResolver(CreateArticleSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "DRAFT",
    },
  });

  async function onSubmit(values: z.infer<typeof CreateArticleSchema>) {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("status", values.status);
      if (values.publishAt) {
        formData.append("publishAt", new Date(values.publishAt).toISOString());
      }

      const newArticle = await createArticleAction(formData);
      router.push(`/articles/${newArticle.slug}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create article. Please ensure you are logged in.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="An amazing article title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (Markdown Supported)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="# Introduction\n\nWrite your content here..."
                  className="min-h-[400px] font-mono text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    {...field}
                  >
                    <option value="DRAFT">Save as Draft</option>
                    <option value="PUBLISHED">Publish Now</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Article"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
