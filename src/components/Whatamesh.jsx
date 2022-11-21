import { Gradient } from "../library/Gradient";
import { useEffect, useState, useRef } from "react";
import { randomColor } from "randomcolor";
import clsx from "clsx";
import { useIdle, useToggle } from "react-use";
import { Transition } from "@headlessui/react";
import { IoPause, IoPlay } from "react-icons/io5";
import { GoMarkGithub } from "react-icons/go";

export default function () {
  const idElement = "Whatamesh";

  const ref = useRef(new Gradient());

  const defaultColor = ["#000000", "#111111", "#222222", "#333333"];

  const [state, setState] = useState(defaultColor);

  const isIdle = useIdle(3e3);

  const [boolean, toggle] = useToggle(true);

  function refInitGradient() {
    ref.current.initGradient(`#${idElement}`);
    toggle(true);
  }

  function setRandomColor(parameter) {
    setState(randomColor({ ...parameter, count: 4 }));
    refInitGradient();
  }

  function resetColor() {
    setState(defaultColor);
    refInitGradient();
  }

  useEffect(() => {
    refInitGradient();
  }, []);

  useEffect(() => {
    boolean ? ref.current.play() : ref.current.pause();
  }, [boolean]);

  function function1(parameter) {
    return (
      <div className="flex flex-row items-baseline">
        <button onClick={() => setRandomColor({ hue: parameter })}>
          {parameter}
        </button>
        <button
          onClick={() => setRandomColor({ hue: parameter, luminosity: "dark" })}
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
              <h1 className="cursor-pointer text-3xl" onClick={resetColor}>
                {idElement}
              </h1>
              <button onClick={toggle} className="text-sm">
                {boolean ? <IoPause /> : <IoPlay />}
              </button>
            </div>
            <div className="flex flex-col items-start gap-y-1 pl-3.5">
              {/* https://github.com/davidmerfield/randomColor#options */}
              <button
                onClick={() =>
                  setRandomColor({
                    luminosity: "random",
                    hue: "random",
                  })
                }
              >
                random
              </button>
              <button onClick={() => setRandomColor({ luminosity: "bright" })}>
                bright
              </button>
              <button onClick={() => setRandomColor({ luminosity: "light" })}>
                light
              </button>
              <button onClick={() => setRandomColor({ luminosity: "dark" })}>
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
              className="animate-pulse text-lg"
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
