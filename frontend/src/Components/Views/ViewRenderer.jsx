import { WorkspaceContext } from "../../Contexts/Workspace";
import { useContext } from "react";

// Views
import ProjectView from "../Views/ProjectView";
import Analytics from "../Views/Analytics";
import RegisteredNumbers from "../Views/RegisteredNumbers";

export default function () {
  const { currentView, Views } = useContext(WorkspaceContext);

  switch (currentView) {
    case Views.Project:
      return <ProjectView />;
    case Views.RegisteredNumbers:
      return <RegisteredNumbers />;
    case Views.Analytics:
      return <Analytics />;
    default:
      return <div>{`"${currentView}" IS AN INVALID VIEW VALUE`}</div>;
  }
}
