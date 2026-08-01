import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { articles } from "./data/site";
import { About } from "./pages/About";
import { Article } from "./pages/Article";
import { Blog } from "./pages/Blog";
import { Contact } from "./pages/Contact";
import { Home } from "./pages/Home";

type Page = "home" | "about" | "blog" | "contact" | "article";

function pathToPage(path: string): Page {
  if (path === "/about") return "about";
  if (path === "/blog") return "blog";
  if (path === "/contact") return "contact";
  if (path === "/article") return "article";
  return "home";
}

export function App() {
  const [page, setPage] = useState<Page>(() => pathToPage(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setPage(pathToPage(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (page === "about") return <><Header /><main><About /></main></>;
  if (page === "blog") return <><Header /><main><Blog /></main></>;
  if (page === "contact") return <><Header /><main><Contact /></main></>;
  if (page === "article") {
    const id = new URLSearchParams(window.location.search).get("id");
    return <><Header /><main><Article article={articles.find((article) => article.id === id)} /></main></>;
  }
  return <><Header /><main><Home /></main></>;
}
