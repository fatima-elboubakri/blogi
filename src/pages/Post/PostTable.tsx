
import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../features/Datatable";
import {
  useDeletePostMutation,
  useGetPostsQuery,
} from "../../services/Post/postApi";
import type { Post } from "../../services/Post/postTypes";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye } from "lucide-react";
import type { PostSchemaType } from "./PostForm";
import { capBtn } from "../../utils/constants";

type RowType = Post & Partial<PostSchemaType>;

function PostTable() {
  const navigate = useNavigate();

  const { data: posts = [], isLoading, isFetching, isError, error } = useGetPostsQuery();
  const [deletePost, { isLoading: deleting }] = useDeletePostMutation();

  const handleView = React.useCallback(
    (post: Post) =>
      navigate("/post", {
        state: { post, toCreate: true, disabled: true },
      }),
    [navigate]
  );

  const handleEdit = React.useCallback(
    (post: Post) =>
      navigate("/post", {
        state: { post, toCreate: true },
      }),
    [navigate]
  );

  const handleDelete = React.useCallback(
    async (id: number) => {
      if (!window.confirm("Supprimer ce post ?")) return;
      try {
        await deletePost(id).unwrap(); // ✅ gestion d'erreur correcte
      } catch (e) {
        console.error("Delete failed:", e);
      }
    },
    [deletePost]
  );

  const rows: RowType[] = React.useMemo(
    () =>
      posts.map((post) => ({
        ...post,
        description: post.body, 
      })),
    [posts]
  );

  const columns = React.useMemo<ColumnDef<RowType>[]>(
    () => [
      {
        accessorKey: "id",
        header: () => <span className="text-[#015C8E] font-semibold">#</span>,
        cell: ({ row }) => (
          <span className="flex text-[#0F172A]">{row.original.id}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "userId",
        header: () => (
          <span className="text-[#015C8E] font-semibold">Utilisateur</span>
        ),
        cell: ({ row }) => (
          <span className="flex text-[#0F172A]">{row.original.userId}</span>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "title",
        header: () => (
          <span className="text-[#015C8E] font-semibold">Titre</span>
        ),
        cell: ({ row }) => (
          <span className="flex text-[#334155] text-start items-start">
            {row.original.title}
          </span>
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        header: () => (
          <span className="text-[#015C8E] font-semibold">Actions</span>
        ),
        cell: ({ row }) => {
          const post = row.original as Post;
          return (
            <div className="flex items-center gap-2">
              <button
                className={`${capBtn.base} ${capBtn.ghost}`}
                title="Voir"
                aria-label="Voir le post"
                onClick={() => handleView(post)}
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                className={`${capBtn.base} ${capBtn.primary}`}
                title="Modifier"
                aria-label="Modifier le post"
                onClick={() => handleEdit(post)}
              >
                <Edit className="w-4 h-4" />
              </button>

              <button
                className={`${capBtn.base} ${capBtn.danger}`}
                title="Supprimer"
                aria-label="Supprimer le post"
                onClick={() => handleDelete(post.id)}
                disabled={deleting}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [handleDelete, handleEdit, handleView, deleting]
  );

  if (isLoading) {
    return (
      <div className="rounded-md border border-[#D0D7DE] bg-white p-6 text-[#475569]">
        Chargement des posts…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-[#D0D7DE] bg-white p-6 text-red-600">
        Une erreur est survenue lors du chargement des posts.
        <pre className="mt-2 text-xs text-[#475569]">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-[#D0D7DE] bg-white p-6 text-[#475569]">
        Aucun post disponible.
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={rows}
      isLoading={isLoading || isFetching}
      isError={isError}
      error={error}
    />
  );
}

export default React.memo(PostTable);
