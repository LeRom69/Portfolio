import { BrowserRouter, Routes, Route } from "react-router-dom";

import Main from "./Pages/Main";
import ProjectShowcaseGrafDis from "./Pages/ProjectShowcase-GrafDis";
import ProjectShowcaseUI from "./Pages/ProjectShowcase-ui";
import NotFound from "./Pages/404";

import { LanguageProvider } from "./Languages/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter basename="/Portfolio">
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
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
