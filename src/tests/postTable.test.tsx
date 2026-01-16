
// tests/PostTable.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PostTable from "../pages/Post/PostTable";


const mockUseGetPostsQuery = vi.fn();
const mockDeletePost = vi.fn(() => Promise.resolve({ data: { success: true } }));

vi.mock("../src/services/Post/postApi", () => ({
  useGetPostsQuery: (arg?: any) => mockUseGetPostsQuery(arg),
  useDeletePostMutation: () => [mockDeletePost, { isLoading: false }],
}));


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


vi.mock("../src/features/Datatable", () => ({
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

    render(<PostTable />);
    expect(screen.getByText(/Chargement des posts…/i)).toBeInTheDocument();
  });

  it("affiche l'état d'erreur", () => {
    mockUseGetPostsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { status: 500, data: { message: "Oops" } },
    });

    render(<PostTable />);
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

    render(<PostTable />);
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

    render(<PostTable />);

    expect(screen.getByTestId("rows-count").textContent).toBe("2");
    expect(screen.getByText("Post A")).toBeInTheDocument();
    expect(screen.getByText("Post B")).toBeInTheDocument();


    const voirBtnRow1 = screen
      .getByTestId("actions-1")
      .querySelector('button[title="Voir"]') as HTMLButtonElement;
    fireEvent.click(voirBtnRow1);
    expect(mockNavigate).toHaveBeenCalledWith("/post", {
      state: { post: rows[0], toCreate: true, disabled: true },
    });

  
    const editBtnRow2 = screen
      .getByTestId("actions-2")
      .querySelector('button[title="Modifier"]') as HTMLButtonElement;
    fireEvent.click(editBtnRow2);
    expect(mockNavigate).toHaveBeenCalledWith("/post", {
      state: { post: rows[1], toCreate: true },
    });


    const deleteBtnRow1 = screen
      .getByTestId("actions-1")
      .querySelector('button[title="Supprimer"]') as HTMLButtonElement;
    fireEvent.click(deleteBtnRow1);

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockDeletePost).toHaveBeenCalledWith(1);

    confirmSpy.mockRestore();
  });
});
