// https://github.com/jordienr/whatamesh/blob/master/src/components/editor.vue
import { Gradient } from "whatamesh";
import { useEffect, useState, useRef } from "react";
import { randomColor } from "randomcolor";
import clsx from "clsx";
import {
  useIdle,
  useToggle,
  useFullscreen,
  useLockBodyScroll,
  useMouseWheel,
} from "react-use";
import { Transition } from "@headlessui/react";
import { IoPause, IoPlay } from "react-icons/io5";
import { GoMarkGithub } from "react-icons/go";
import { TbMaximizeOff, TbMaximize } from "react-icons/tb";
import { MdOutlineDarkMode, MdDarkMode } from "react-icons/md";
import { VscDebugStepBack } from "react-icons/vsc";
import { HiOutlineCheckCircle, HiCheckCircle } from "react-icons/hi";

export default function () {
  const idCanvas = "Whatamesh";

  const defaultColorPalette = ["#000000", "#111111", "#222222", "#333333"];

  const ref1 = useRef(new Gradient());

  const ref2 = useRef();

  const ref3 = useRef(useMouseWheel());

  const ref4 = useRef();

  const mouseWheel = useMouseWheel();

  const isIdle = useIdle(3e3);

  const [state, setState] = useState(defaultColorPalette);

  const [toggle1, setToggle1] = useToggle(true);

  const [toggle2, setToggle2] = useToggle(false);

  const [toggle3, setToggle3] = useToggle(false);

  const [toggle4, setToggle4] = useToggle(false);

  const Fn = {
    colorPalette: {
      boolean: {
        // https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
        isNotDefault: function () {
          return JSON.stringify(state) !== JSON.stringify(defaultColorPalette);
        },
      },

      handle: {
        set: function (parameter) {
          setState(randomColor({ ...parameter, count: 4 }));
          Fn.gradient.handle.refresh();
        },
      },
    },

    gradient: {
      handle: {
        refresh: function () {
          ref1.current.initGradient(`#${idCanvas}`);
          setToggle1(true); // ??
        },

        darkenTop: function () {
          setToggle3();
          Fn.gradient.handle.refresh();
        },
      },
    },
  };

  function resetColorPalette() {
    setState(defaultColorPalette);
    Fn.gradient.handle.refresh();
  }

  function handleRandomColorModeOn() {
    ref4.current = setInterval(() => randomColorPalette(), 1e3);
  }

  function handleRandomColorModeOff() {
    clearInterval(ref4.current);
  }

  // https://github.com/davidmerfield/randomColor#options
  function randomColorPalette() {
    Fn.colorPalette.handle.set({
      luminosity: "random",
      hue: "random",
    });
  }

  function brightColorPalette() {
    Fn.colorPalette.handle.set({ luminosity: "bright" });
  }

  function lightColorPalette() {
    Fn.colorPalette.handle.set({ luminosity: "light" });
  }

  function darkColorPalette() {
    Fn.colorPalette.handle.set({ luminosity: "dark" });
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
  // useKey("p", callbackFn);

  useFullscreen(ref2, toggle2, {
    onClose: () => setToggle2(false),
  });

  useLockBodyScroll(true);

  useEffect(() => {
    // console.log(ref1.current);
    ref1.current.amp = new Date().getSeconds() % 2 === 0 ? 3e2 : 4e2;
    ref1.current.seed = new Date().getSeconds();
    Fn.gradient.handle.refresh();
  }, []);

  useEffect(() => {
    // ??
    ref3.current !== mouseWheel && !toggle4 ? randomColorPalette() : undefined;
    ref3.current = mouseWheel;
  }, [mouseWheel]);

  useEffect(() => {
    // ??
    // ref1.current.conf.playing
    toggle1 ? ref1.current.play() : ref1.current.pause();
  }, [toggle1]);

  useEffect(() => {
    toggle4 ? handleRandomColorModeOn() : undefined;

    return () => handleRandomColorModeOff();
  }, [toggle4]);

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
          <div className="flex flex-col gap-y-1.5">
            <div className="flex flex-row items-baseline gap-x-0.5">
              <h1 className="text-5xl sm:first-letter:text-8xl">{idCanvas}</h1>
              <div className="flex flex-row items-baseline text-sm sm:text-sm">
                {!toggle4 ? (
                  <button
                    onClick={setToggle1}
                    title={!toggle1 ? "play" : "pause"}
                  >
                    {!toggle1 ? <IoPlay /> : <IoPause />}
                  </button>
                ) : undefined}
                <button onClick={setToggle2} title="toggle fullscreen">
                  {!toggle2 ? <TbMaximize /> : <TbMaximizeOff />}
                </button>
                <button
                  onClick={Fn.gradient.handle.darkenTop}
                  title="toggle darken top"
                >
                  {toggle3 ? <MdDarkMode /> : <MdOutlineDarkMode />}
                </button>
                <button onClick={setToggle4} title="toggle random color mode">
                  {!toggle4 ? <HiOutlineCheckCircle /> : <HiCheckCircle />}
                </button>
                {Fn.colorPalette.boolean.isNotDefault() && !toggle4 ? (
                  <button onClick={resetColorPalette} title="reset">
                    <VscDebugStepBack />
                  </button>
                ) : undefined}
              </div>
            </div>
            {!toggle4 ? (
              <div className="flex flex-col items-start gap-y-0.5 px-5 text-lg sm:px-12 sm:text-xl">
                <button onClick={randomColorPalette}>random</button>
                <button onClick={brightColorPalette}>bright</button>
                <button onClick={lightColorPalette}>light</button>
                <button onClick={darkColorPalette}>dark</button>
              </div>
            ) : undefined}
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
