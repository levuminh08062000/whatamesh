import { Gradient } from "../library/Gradient";
import { useEffect, useState, useRef } from "react";
import { randomColor } from "randomcolor";
import clsx from "clsx";
import { useIdle, useToggle, useFullscreen } from "react-use";
import { Transition } from "@headlessui/react";
import { IoPause, IoPlay } from "react-icons/io5";
import { GoMarkGithub } from "react-icons/go";
import { AiOutlineFullscreenExit, AiOutlineFullscreen } from "react-icons/ai";

export default function () {
  const idElement = "Whatamesh";

  const defaultColor = ["#000000", "#111111", "#222222", "#333333"];

  const ref1 = useRef(new Gradient());

  const ref2 = useRef(null);

  const [state, setState] = useState(defaultColor);

  const isIdle = useIdle(3e3);

  const [toggle1, setToggle1] = useToggle(true);

  const [toggle2, setToggle2] = useToggle(false);

  useFullscreen(ref2, toggle2, {
    onClose: () => setToggle2(false),
  });

  function refInitGradient() {
    ref1.current.initGradient(`#${idElement}`);
    setToggle1(true); // ??
  }

  function setRandomColorGradient(parameter) {
    setState(randomColor({ ...parameter, count: 4 }));
    refInitGradient();
  }

  function resetColorGradient() {
    setState(defaultColor);
    refInitGradient();
  }

  useEffect(() => {
    refInitGradient();
  }, []);

  // useEffect(() => {
  //   setRandomColorGradient({
  //     luminosity: "random",
  //     hue: "random",
  //   });
  // }, [useMouseWheel()]);

  useEffect(() => {
    toggle1 ? ref1.current.play() : ref1.current.pause(); // ??
  }, [toggle1]);

  function function1(parameter) {
    return (
      <div className="flex flex-row items-baseline">
        <button onClick={() => setRandomColorGradient({ hue: parameter })}>
          {parameter}
        </button>
        <button
          onClick={() =>
            setRandomColorGradient({ hue: parameter, luminosity: "dark" })
          }
        >
          Dark
        </button>
      </div>
    );
  }

  return (
    <div
      className={clsx("flex flex-col", {
        "cursor-none": isIdle,
      })}
      ref={ref2}
    >
      <canvas
        id={idElement}
        style={{
          "--gradient-color-1": state[0],
          "--gradient-color-2": state[1],
          "--gradient-color-3": state[2],
          "--gradient-color-4": state[3],
        }}
        className="h-screen w-screen select-none"
      ></canvas>
      <Transition
        show={!isIdle}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-75"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed"
      >
        <div className="fex-col flex h-screen w-screen p-5">
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-row items-baseline gap-x-1">
              <h1
                className="cursor-pointer text-5xl"
                onClick={resetColorGradient}
              >
                {idElement}
              </h1>
              <div className="flex flex-row items-baseline text-xs">
                <button onClick={setToggle1} title={toggle1 ? "Pause" : "Play"}>
                  {toggle1 ? <IoPause /> : <IoPlay />}
                </button>
                <button
                  onClick={setToggle2}
                  title={!toggle2 ? "Fullscreen" : "Fullscreen exit"}
                >
                  {!toggle2 ? (
                    <AiOutlineFullscreen />
                  ) : (
                    <AiOutlineFullscreenExit />
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col items-start gap-y-1 pl-5">
              {/* https://github.com/davidmerfield/randomColor#options */}
              <button
                onClick={() =>
                  setRandomColorGradient({
                    luminosity: "random",
                    hue: "random",
                  })
                }
              >
                random
              </button>
              <button
                onClick={() => setRandomColorGradient({ luminosity: "bright" })}
              >
                bright
              </button>
              <button
                onClick={() => setRandomColorGradient({ luminosity: "light" })}
              >
                light
              </button>
              <button
                onClick={() => setRandomColorGradient({ luminosity: "dark" })}
              >
                dark
              </button>
              {function1("red")}
              {function1("orange")}
              {function1("yellow")}
              {function1("green")}
              {function1("blue")}
              {function1("purple")}
              {function1("pink")}
              {function1("monochrome")}
            </div>
          </div>
          <div className="flex w-full flex-col items-end self-end">
            <a
              className="text-lg"
              href="https://github.com/shenlong616/whatamesh"
              target="_blank"
            >
              <GoMarkGithub />
            </a>
          </div>
        </div>
      </Transition>
    </div>
  );
}
