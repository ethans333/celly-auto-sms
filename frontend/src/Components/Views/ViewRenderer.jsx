import { WorkspaceContext } from "../../Contexts/Workspace";
import { useContext } from "react";

// Views
import ProjectView from "../Views/ProjectView";
import Analytics from "../Views/Analytics";
import ScheduledMeetings from "../Views/ScheduledMeetings";

export default function () {
  const { currentView, Views } = useContext(WorkspaceContext);

  switch (currentView) {
    case Views.Project:
      return <ProjectView />;
    case Views.ScheduledMeetings:
      return <ScheduledMeetings />;
    case Views.Analytics:
      return <Analytics />;
    default:
      return <div>{`"${currentView}" IS AN INVALID VIEW VALUE`}</div>;
  }
}
