import { WorkspaceContext } from "../../Contexts/Workspace";
import { useContext } from "react";

// Views
import ProjectView from "../Views/ProjectView";
import Analytics from "../Views/Analytics";
import ScheduledMeetings from "../Views/ScheduledMeetings";

export default function () {
  const { currentView, Views, setSidebar } = useContext(WorkspaceContext);

  switch (currentView) {
    case Views.Project:
      onSwitch();
      return <ProjectView />;
    case Views.ScheduledMeetings:
      onSwitch();
      return <ScheduledMeetings />;
    case Views.Analytics:
      onSwitch();
      return <Analytics />;
    default:
      return <div>{`"${currentView}" IS AN INVALID VIEW VALUE`}</div>;
  }

  function onSwitch() {
    // setSidebar(null);
  }
}
