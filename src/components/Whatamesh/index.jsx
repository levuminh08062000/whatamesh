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
import { IoPause, IoPlay } from "react-icons/io5";
import { GoMarkGithub } from "react-icons/go";
import { TbMaximizeOff, TbMaximize } from "react-icons/tb";
import { MdOutlineDarkMode, MdDarkMode } from "react-icons/md";
import { VscDebugStepBack } from "react-icons/vsc";
import { HiOutlineCheckCircle, HiCheckCircle } from "react-icons/hi";
import noiseGif from "./noise.gif";

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
      handle: {
        set: function (parameter) {
          // https://github.com/jordienr/whatamesh/blob/c4dda98a1f72091817bbbb0c317e84e6bfce9a1d/src/components/editor.vue#L107
          setState(randomColor({ ...parameter, count: 4 }));
          Fn.gradient.handle.refresh();
        },

        reset: function () {
          setState(defaultColorPalette);
          Fn.gradient.handle.refresh();
        },

        boolean: {
          // https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
          isNotDefault: function () {
            return (
              JSON.stringify(state) !== JSON.stringify(defaultColorPalette)
            );
          },
        },

        // https://github.com/davidmerfield/randomColor#options
        color: {
          random: function () {
            Fn.colorPalette.handle.set({
              luminosity: "random",
              hue: "random",
            });
          },

          bright: function () {
            Fn.colorPalette.handle.set({ luminosity: "bright" });
          },

          light: function () {
            Fn.colorPalette.handle.set({ luminosity: "light" });
          },

          dark: function () {
            Fn.colorPalette.handle.set({ luminosity: "dark" });
          },

          monochrome: function () {
            Fn.colorPalette.handle.set({ hue: "monochrome" });
          },
        },

        mode: {
          random: {
            on: function () {
              ref4.current = setInterval(
                () => Fn.colorPalette.handle.color.random(),
                1e3
              );
            },

            off: function () {
              clearInterval(ref4.current);
            },
          },
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

  // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
  // useKey("p", callbackFn);

  useFullscreen(ref2, toggle2, {
    onClose: () => setToggle2(false),
  });

  useLockBodyScroll(true);

  useEffect(() => {
    // console.log(ref1.current);
    ref1.current.amp = new Date().getSeconds() % 2 === 0 ? 2e2 : 3e2;
    ref1.current.seed = new Date().getSeconds();
    Fn.gradient.handle.refresh();
  }, []);

  useEffect(() => {
    // ??
    ref3.current !== mouseWheel && !toggle4
      ? Fn.colorPalette.handle.color.random()
      : undefined;
    ref3.current = mouseWheel;
  }, [mouseWheel]);

  useEffect(() => {
    // ??
    // ref1.current.conf.playing
    toggle1 ? ref1.current.play() : ref1.current.pause();
  }, [toggle1]);

  useEffect(() => {
    toggle4 ? Fn.colorPalette.handle.mode.random.on() : undefined;

    return () => Fn.colorPalette.handle.mode.random.off();
  }, [toggle4]);

  return (
    <div
      className={clsx("flex flex-col", {
        "cursor-none": isIdle,
      })}
      ref={ref2}
    >
      <div
        // https://webflow.com/made-in-webflow/website/sinkcolabs-cd9391191d7ce4-4e17312dcf483
        className="pointer-events-none fixed inset-0 z-50 h-screen w-screen overflow-hidden bg-auto bg-center opacity-[.03]"
        style={{
          backgroundImage: `url("${noiseGif}")`,
        }}
      ></div>
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
      {!isIdle ? (
        <div className="fixed">
          <div className="fex-col flex h-screen w-screen p-7 md:p-10">
            <div className="flex w-full flex-col gap-y-3">
              <div className="flex flex-row items-baseline gap-x-0.5">
                <h1 className="text-4xl sm:first-letter:text-8xl">
                  {idCanvas}
                </h1>
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
                  {Fn.colorPalette.handle.boolean.isNotDefault() && !toggle4 ? (
                    <button
                      onClick={Fn.colorPalette.handle.reset}
                      title="reset"
                    >
                      <VscDebugStepBack />
                    </button>
                  ) : undefined}
                </div>
              </div>
              <div className="flex h-full flex-col px-5 sm:px-12">
                {!toggle4 ? (
                  <div className="flex flex-col items-start gap-y-0.5 text-base sm:text-lg">
                    <button onClick={Fn.colorPalette.handle.color.random}>
                      random
                    </button>
                    <button onClick={Fn.colorPalette.handle.color.bright}>
                      bright
                    </button>
                    <button onClick={Fn.colorPalette.handle.color.light}>
                      light
                    </button>
                    <button onClick={Fn.colorPalette.handle.color.dark}>
                      dark
                    </button>
                    <button onClick={Fn.colorPalette.handle.color.monochrome}>
                      monochrome
                    </button>
                  </div>
                ) : undefined}
                <div className="flex grow flex-col items-end justify-end text-xl sm:text-2xl">
                  <a
                    href="https://github.com/shenlong616/whatamesh"
                    target="_blank"
                  >
                    <GoMarkGithub />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : undefined}
    </div>
  );
}
