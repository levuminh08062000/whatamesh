// https://github.com/jordienr/whatamesh/blob/master/src/components/editor.vue
import { Gradient } from "whatamesh";
import { useEffect, useState, useRef } from "react";
import { randomColor } from "randomcolor";
import clsx from "clsx";
import {
  useIdle,
  useToggle,
  useFullscreen,
  useKey,
  useLockBodyScroll,
  useMouseWheel,
} from "react-use";
import { Transition } from "@headlessui/react";
import { IoPause, IoPlay } from "react-icons/io5";
import { GoMarkGithub } from "react-icons/go";
import { TbMaximizeOff, TbMaximize } from "react-icons/tb";
import { MdOutlineDarkMode, MdDarkMode } from "react-icons/md";

export default function () {
  const idCanvas = "Whatamesh";

  const defaultColorPalette = ["#000000", "#111111", "#222222", "#333333"];

  const ref1 = useRef(new Gradient());

  const ref2 = useRef();

  const ref3 = useRef(useMouseWheel());

  const mouseWheel = useMouseWheel();

  const isIdle = useIdle(3e3);

  const [state, setState] = useState(defaultColorPalette);

  const [toggle1, setToggle1] = useToggle(true);

  const [toggle2, setToggle2] = useToggle(false);

  const [toggle3, setToggle3] = useToggle(false);

  // https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
  const isNotDefaultColorPalette =
    JSON.stringify(state) !== JSON.stringify(defaultColorPalette);

  function handleRefreshGradient() {
    ref1.current.initGradient(`#${idCanvas}`);
    setToggle1(true); // ??
  }

  function handleDarkenTopGradient() {
    setToggle3();
    handleRefreshGradient();
  }

  function setColorPalette(parameter) {
    setState(randomColor({ ...parameter, count: 4 }));
    handleRefreshGradient();
  }

  function resetColorPalette() {
    setState(defaultColorPalette);
    handleRefreshGradient();
  }

  // https://github.com/davidmerfield/randomColor#options
  function randomColorPalette() {
    setColorPalette({
      luminosity: "random",
      hue: "random",
    });
  }

  function brightColorPalette() {
    setColorPalette({ luminosity: "bright" });
  }

  function lightColorPalette() {
    setColorPalette({ luminosity: "light" });
  }

  function darkColorPalette() {
    setColorPalette({ luminosity: "dark" });
  }

  function handleWindowBlur() {
    setToggle1(false);
  }

  function handleWindowFocus() {
    setToggle1(true);
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
  useKey("p", setToggle1);
  useKey(" ", setToggle1);
  useKey("f", setToggle2);
  useKey("Enter", setToggle2);
  useKey("Control", handleDarkenTopGradient);
  useKey("r", resetColorPalette);

  useFullscreen(ref2, toggle2, {
    onClose: () => setToggle2(false),
  });

  useLockBodyScroll(true);

  useEffect(() => {
    handleRefreshGradient();
  }, []);

  useEffect(() => {
    // ??
    ref3.current !== mouseWheel ? randomColorPalette() : undefined;
    ref3.current = mouseWheel;
  }, [mouseWheel]);

  useEffect(() => {
    toggle1 ? ref1.current.play() : ref1.current.pause(); // ??
  }, [toggle1]);

  useEffect(() => {
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  return (
    <div
      className={clsx("flex flex-col", {
        "cursor-none": isIdle,
      })}
      ref={ref2}
    >
      <canvas
        id={idCanvas}
        style={{
          "--gradient-color-1": state[0],
          "--gradient-color-2": state[1],
          "--gradient-color-3": state[2],
          "--gradient-color-4": state[3],
        }}
        className="h-screen w-screen"
        // https://github.com/jordienr/whatamesh/blob/c4dda98a1f72091817bbbb0c317e84e6bfce9a1d/src/components/editor.vue#L186
        data-js-darken-top={toggle3 ? "" : false}
        data-transition-in=""
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
        <div className="fex-col flex h-screen w-screen p-7 md:p-10">
          <div className="flex flex-col gap-y-1">
            <div className="flex flex-row items-baseline gap-x-1">
              <h1 className="font-serif text-5xl sm:first-letter:text-8xl">
                {idCanvas}
              </h1>
              <div className="flex flex-row items-baseline text-xs sm:text-sm">
                <button
                  onClick={setToggle1}
                  title={!toggle1 ? "play" : "pause"}
                >
                  {!toggle1 ? <IoPlay /> : <IoPause />}
                </button>
                <button
                  onClick={setToggle2}
                  title={!toggle2 ? "fullscreen" : "fullscreen exit"}
                >
                  {!toggle2 ? <TbMaximize /> : <TbMaximizeOff />}
                </button>
                <button
                  onClick={handleDarkenTopGradient}
                  title="toggle darken top"
                >
                  {toggle3 ? <MdDarkMode /> : <MdOutlineDarkMode />}
                </button>
              </div>
            </div>
            <div className="flex flex-col items-start gap-y-1 px-5 text-xl sm:px-12 sm:text-2xl">
              <button onClick={randomColorPalette}>random</button>
              <button onClick={brightColorPalette}>bright</button>
              <button onClick={lightColorPalette}>light</button>
              <button onClick={darkColorPalette}>dark</button>
              {isNotDefaultColorPalette ? (
                <button onClick={resetColorPalette}>reset</button>
              ) : undefined}
            </div>
          </div>
          <div className="flex w-full flex-row justify-end self-end text-xl sm:text-2xl">
            <a href="https://github.com/shenlong616/whatamesh" target="_blank">
              <GoMarkGithub />
            </a>
          </div>
        </div>
      </Transition>
    </div>
  );
}
