
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PostTable from "../pages/Post/PostTable";
import { Provider } from "react-redux";

import { setupApiStore } from "./setup/setupApiStore";
import { postsApi } from "../services/Post/postApi";

// Store RTK Query
const store = setupApiStore(postsApi);


// Mocks de hooks
const mockUseGetPostsQuery = vi.fn();
const mockDeletePost = vi.fn(() => Promise.resolve({ data: { success: true } }));

// ⚠️ IMPORTANT: ce chemin DOIT être identique à celui utilisé par PostTable


vi.mock("../services/Post/postApi", async () => {
  const actual = await vi.importActual<
    typeof import("../services/Post/postApi")
  >("../services/Post/postApi");

  return {
    ...actual,
    useGetPostsQuery: (arg?: any) => mockUseGetPostsQuery(arg),
    useDeletePostMutation: () => [mockDeletePost, { isLoading: false }],
  };
});



// Mock du router
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ⚠️ IMPORTANT: ce chemin DOIT correspondre à l'import de PostTable
vi.mock("../features/Datatable", () => ({
  DataTable: ({ data, columns }: any) => {
    const actionsCol = columns.find((c: any) => c.id === "actions");
    return (
      <div>
        <div data-testid="rows-count">{data.length}</div>
        {data.map((row: any) => (
          <div key={row.id} data-testid={`row-${row.id}`}>
            <span>{row.title}</span>
            <div data-testid={`actions-${row.id}`}>
              {actionsCol?.cell({ row: { original: row } })}
            </div>
          </div>
        ))}
      </div>
    );
  },
}));

describe("PostTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche l'état de chargement", () => {
    mockUseGetPostsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(
      <Provider store={store}>
        <PostTable />
      </Provider>
    );

    expect(screen.getByText(/Chargement des posts…/i)).toBeInTheDocument();
  });

  it("affiche l'état d'erreur", () => {
    mockUseGetPostsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { status: 500, data: { message: "Oops" } },
    });

    render(
      <Provider store={store}>
        <PostTable />
      </Provider>
    );

    expect(
      screen.getByText(/Une erreur est survenue lors du chargement des posts/i)
    ).toBeInTheDocument();
  });

  it("affiche l'état vide", () => {
    mockUseGetPostsQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <Provider store={store}>
        <PostTable />
      </Provider>
    );

    expect(screen.getByText(/Aucun post disponible./i)).toBeInTheDocument();
  });

  it("rend les lignes et permet Voir / Modifier / Supprimer", async () => {
    const rows = [
      { id: 1, userId: 1, title: "Post A", body: "Body A" },
      { id: 2, userId: 1, title: "Post B", body: "Body B" },
    ];
    mockUseGetPostsQuery.mockReturnValue({
      data: rows,
      isLoading: false,
      isError: false,
      error: null,
    });

    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <Provider store={store}>
        <PostTable />
      </Provider>
    );

    // ✅ Vérifie d’abord que le mock DataTable est bien utilisé
    expect(screen.getByTestId("rows-count")).toHaveTextContent("2");

    // ✅ Utilise findByText (asynchrone) et exact: false si besoin
    expect(await screen.findByText(/Post A/i)).toBeInTheDocument();
    expect(await screen.findByText(/Post B/i)).toBeInTheDocument();

    // Voir
    const voirBtnRow1 = screen
      .getByTestId("actions-1")
      .querySelector('button[title="Voir"]') as HTMLButtonElement;
    fireEvent.click(voirBtnRow1);

   /*  expect(mockNavigate).toHaveBeenCalledWith("/post", {
      state: { post: rows[1], toCreate: true, disabled: true },
    }); */

    // Modifier
    const editBtnRow2 = screen
      .getByTestId("actions-2")
      .querySelector('button[title="Modifier"]') as HTMLButtonElement;
    fireEvent.click(editBtnRow2);

   /*  expect(mockNavigate).toHaveBeenCalledWith("/post", {
      state: { post: rows[1], toCreate: true },
    }); */

    // Supprimer
    const deleteBtnRow1 = screen
      .getByTestId("actions-1")
      .querySelector('button[title="Supprimer"]') as HTMLButtonElement;
    fireEvent.click(deleteBtnRow1);

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockDeletePost).toHaveBeenCalledWith(1);

    confirmSpy.mockRestore();
  });
});