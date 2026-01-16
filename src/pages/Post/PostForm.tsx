
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

import {
  useAddPostMutation,
  useUpdatePostMutation,
} from "../../services/Post/postApi";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import type { Post } from "../../services/Post/postTypes";

const postSchema = z.object({
  //userId: z.coerce.number().int().min(1, "Doit être supérieur à 0"),
  userId: z.number().int().min(1, "Doit être supérieur à 0"),
  title: z.string().min(10, "Minimum 10 caractères"),
  description: z.string().min(100, "Minimum 100 caractères"),
});

export type PostSchemaType = z.infer<typeof postSchema>;

type PostPageState = { post?: Post; disabled?: boolean };

const PostForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as Location & { state?: PostPageState };

  const post = location?.state?.post;
  const disabled = Boolean(location?.state?.disabled);

  const [addPost, { isLoading: adding }] = useAddPostMutation();
  const [updatePost, { isLoading: updating }] = useUpdatePostMutation();

  const form = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      userId: post?.userId ?? 1, 
      title: post?.title ?? "",
      description: post?.body ?? "", 
    },
 
  });

  const { control, reset, handleSubmit } = form;

  useEffect(() => {
    if (post) {
      reset({
        userId: post.userId,
        title: post.title,
        description: post.body,
      });
    } else {
      reset({
        userId: 1,
        title: "",
        description: "",
      });
    }
  }, [post, reset]);

  const onSubmit = async (data: PostSchemaType) => {
    try {
      if (post?.id) {
        await updatePost({ ...post, ...data, body: data.description }).unwrap();
      } else {
        await addPost({
          ...data,
          body: data.description,
        }).unwrap();
      }
      navigate("/");
    } catch (e) {
      console.error("Échec de la soumission:", e);
    }
  };

  const isSubmitting = adding || updating;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-[#0070AD] hover:underline"
      >
        ← Retour
      </button>

      <h2 className="text-2xl font-semibold text-[#015C8E] mb-6">
        {post ? (disabled ? "Détail du post" : "Modifier le post") : "Ajouter un post"}
      </h2>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-disabled={disabled}>
          <FormField
            control={control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#015C8E] font-semibold">
                  Id de l'utilisateur
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={disabled}
                    min={1}
                    className="border-[#D0D7DE] focus-visible:ring-[#0070AD] focus-visible:border-[#0070AD] disabled:bg-[#F3F6F9] disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#015C8E] font-semibold">Titre du post</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={disabled}
                    className="border-[#D0D7DE] focus-visible:ring-[#0070AD] focus-visible:border-[#0070AD] disabled:bg-[#F3F6F9] disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#015C8E] font-semibold">Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={6}
                    disabled={disabled}
                    className="border-[#D0D7DE] focus-visible:ring-[#0070AD] focus-visible:border-[#0070AD] disabled:bg-[#F3F6F9] disabled:text-[#9CA3AF] disabled:cursor-not-allowed"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          {!disabled && (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0070AD] text-white px-6 py-2 rounded-md hover:bg-[#015C8E] active:bg-[#014C72] transition-colors"
            >
              {isSubmitting ? "Enregistrement…" : post ? "Mettre à jour" : "Ajouter"}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default PostForm;
