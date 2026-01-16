

import { useNavigate } from "react-router-dom";
import PostsPage from "../Post";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* En-tête de section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#015C8E] tracking-wide">
          Liste des articles
        </h2>

        <button
          type="button"
          onClick={() =>
            navigate("/post", { state: { toCreate: true } })
          }
          className="inline-flex items-center gap-2 rounded-md border border-[#0070AD] 
                     bg-[#0070AD] px-4 py-2 text-sm font-medium text-white 
                     hover:bg-[#015C8E] active:bg-[#015C8E] transition-colors"
        >
          Nouveau
        </button>
      </div>

      {/* Carte qui contient la liste (PostsPage) si tu veux un fond blanc propre */}
      <div className="rounded-md border border-[#D0D7DE] bg-white">
        <div className="p-4">
          <PostsPage />
        </div>
      </div>
    </>
  );
}
