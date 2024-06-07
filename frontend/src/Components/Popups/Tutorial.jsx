import { useState, useContext, useEffect } from "react";
import { HelpersContext } from "../../Contexts/Helpers";
import Popup from "../Popup";

import CircleIcon from "@mui/icons-material/Circle";

import tutorial1 from "../../assets/tutorial/tutorial1.gif";
import tutorial2 from "../../assets/tutorial/tutorial2.gif";

export default function () {
  const [page, setPage] = useState(-1);
  const { hideTutorial, showTutorial } = useContext(HelpersContext);

  const nPages = 3;

  useEffect(() => {
    showTutorial().then((st) => {
      if (st) setPage(0);
    });
  }, []);

  if (page != -1)
    return (
      <Popup
        onClose={() => {
          hideTutorial();
          setPage(-1);
        }}
      >
        {
          {
            0: (
              <Page>
                <div className="text-center mt-24">
                  <div className="text-4xl font-black mb-5">
                    <a>Welcome To </a>
                    <a className="bg-gradient-to-r from-violet-600 to-indigo-600 inline-block text-transparent bg-clip-text">
                      Intwine
                    </a>
                  </div>
                  <div className="text-5xl">👋</div>
                  <p className="px-5 my-16">
                    Before we get started there's some things you should know
                    before navigating the app!
                  </p>
                  <ContinueButton />
                </div>
              </Page>
            ),
            1: (
              <GifPage
                title="Creating Cells"
                gif={tutorial1}
                description="Create a cell by right-clicking your workspace, selecting 'Create Cell' from the menu and dragging and dropping a cell from the sidebar."
              />
            ),
            2: (
              <GifPage
                title="Editing Cells"
                gif={tutorial2}
                description="In order to edit a cell, simply click the ellipse in the top-right of the cell and edit its attributes in the sidebar."
              />
            ),
          }[page]
        }
      </Popup>
    );

  function ContinueButton() {
    return (
      <div className="flex justify-center">
        <div
          onClick={() => {
            if (page == nPages - 1) {
              setPage(-1);
              hideTutorial();
              return;
            }
            setPage((p) => (p + 1) % nPages);
          }}
          className="mt-5 bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-lg w-fit px-3 py-1.5 rounded-lg text-white cursor-pointer hover:opacity-50"
        >
          {page < nPages - 1 ? "Continue" : "Get Started"}
        </div>
      </div>
    );
  }

  function Page({ children }) {
    function Circle({ _page }) {
      return (
        <CircleIcon
          style={{
            width: "10px",
            height: "10px",
            opacity: page == _page ? 1 : 0.5,
          }}
          onClick={() => setPage(_page)}
          className="cursor-pointer"
        />
      );
    }

    return (
      <div className="px-5 h-[46vh] w-[500px] flex flex-col justify-between">
        <div>{children}</div>
        <div className="flex justify-center mb-5 space-x-2">
          <Circle _page={0} />
          <Circle _page={1} />
          <Circle _page={2} />
        </div>
      </div>
    );
  }

  function GifPage({ title, description, gif }) {
    return (
      <Page>
        <div className="mt-5">
          <div className="text-xl font-black mb-7">{title}</div>
          <div className="mx-2">
            <img src={gif} className="rounded-lg shadow" />
            <div className="mt-7 mb-2">{description}</div>
            <ContinueButton />
          </div>
        </div>
      </Page>
    );
  }
}
