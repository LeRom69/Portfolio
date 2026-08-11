import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import { LanguageProvider } from "./Languages/LanguageContext";
import PageLoader from "./Component/PageLoader";

const Main = lazy(() => import("./Pages/Main"));
const ProjectShowcaseGrafDis = lazy(() => import("./Pages/ProjectShowcase-GrafDis"));
const ProjectShowcaseUI = lazy(() => import("./Pages/ProjectShowcase-ui"));
const NotFound = lazy(() => import("./Pages/404"));

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename="/Portfolio">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Main />} />

            <Route
              path="/visual-design/:webName"
              element={<ProjectShowcaseGrafDis />}
            />

            <Route
              path="/uiux-design/:webName"
              element={<ProjectShowcaseUI />}
            />

            <Route path="/404" element={<NotFound />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;