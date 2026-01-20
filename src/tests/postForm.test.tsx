

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostForm from "../pages/Post/PostForm";
import { Provider } from "react-redux";
import { setupApiStore } from "./setup/setupApiStore";
import { postsApi } from "../services/Post/postApi";

const store = setupApiStore(postsApi);
// ---- Mocks RTK Query hooks ----

const mockAddPost = vi.fn(() => ({
  unwrap: () => Promise.resolve({ id: 101 }),
}));

const mockUpdatePost = vi.fn(() => ({
  unwrap: () => Promise.resolve({ id: 7 }),
}));

vi.mock("@/services/Post/postApi", async () => {
  const actual = await vi.importActual<
    typeof import("@/services/Post/postApi")
  >("@/services/Post/postApi");

  return {
    ...actual,
    useCreatePostMutation: () => [mockAddPost, { isLoading: false }],
    useUpdatePostMutation: () => [mockUpdatePost, { isLoading: false }],
  };
});


const mockNavigate = vi.fn();
const mockUseLocation = vi.fn(() => ({ state: null }));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockUseLocation(),
  };
});



describe("PostForm", () => {

  it("rend les champs du formulaire", { skip: false }, () => {
    render(<Provider store={store}><PostForm /></Provider>);

    expect(screen.getByText(/Retour/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Ajouter un post/i })).toBeInTheDocument();

    expect(screen.getByLabelText("Id de l'utilisateur")).toBeInTheDocument();
    expect(screen.getByLabelText("Titre du post")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("affiche les erreurs de validation si on soumet vide",{ skip: false }, async () => {
    render(<Provider store={store}><PostForm /></Provider>);

    fireEvent.click(screen.getByRole("button", { name: /Ajouter/i }));

    expect(await screen.findByText(/Minimum 10 caractères/i)).toBeInTheDocument();
    expect(await screen.findByText(/Minimum 100 caractères/i)).toBeInTheDocument();
  });

  it("soumet en mode création (addPost) et navigue",{ skip: true }, async () => {
    render(<Provider store={store}><PostForm /></Provider>);

    fireEvent.change(screen.getByLabelText("Id de l'utilisateur"), {
      target: { value: 1 },
    });

    fireEvent.change(screen.getByLabelText("Titre du post"), {
      target: { value: "Un super titre valide" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: {
        value:
          "Une description suffisamment longue pour dépasser 100 caractères ................................................................",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /Ajouter/i }));

    await waitFor(() => {
      expect(mockAddPost).toHaveBeenCalledTimes(1);
    });

    expect(mockAddPost).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.any(String),
        userId: 1,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("pré-remplit les champs en mode édition et soumet updatePost",{ skip: false }, async () => {
    const post = {
      id: 7,
      userId: 2,
      title: "Titre existant",
      body: "Body existant ....",
    };
    mockUseLocation.mockReturnValue({ state: { post } });

    render(<Provider store={store}><PostForm /></Provider>);

  
    const titleInput = screen.getByLabelText("Titre du post") as HTMLInputElement;
    expect(titleInput.value).toBe("Titre existant");

    fireEvent.change(titleInput, {
      target: { value: "Titre modifié et valide" },
    });

    fireEvent.change(screen.getByLabelText("Description"), {
      target: {
        value:
          "Nouvelle description suffisamment longue pour passer la validation ................................................................",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: /Mettre à jour/i }));

    await waitFor(() => {
      expect(mockUpdatePost).toHaveBeenCalledTimes(1);
    });

    expect(mockUpdatePost).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 7,
        body: expect.any(String), 
        title: "Titre modifié et valide",
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("désactive les champs et masque le bouton en mode détail (disabled)",{ skip: false }, () => {
    const post = { id: 1, userId: 1, title: "T", body: "B" };
    mockUseLocation.mockReturnValue({ state: { post, disabled: true } });

    render(<Provider store={store}><PostForm /></Provider>);

    expect(
      screen.getByRole("heading", { name: /Détail du post/i })
    ).toBeInTheDocument();

    const userIdInput = screen.getByLabelText("Id de l'utilisateur");
    const titleInput = screen.getByLabelText("Titre du post");
    const descInput = screen.getByLabelText("Description");

    expect(userIdInput).toBeDisabled();
    expect(titleInput).toBeDisabled();
    expect(descInput).toBeDisabled();
    expect(screen.queryByRole("button", { name: /Ajouter|Mettre à jour/ })).toBeNull();
  });
});
