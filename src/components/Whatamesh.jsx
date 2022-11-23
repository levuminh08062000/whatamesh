// https://github.com/jordienr/whatamesh/blob/master/src/components/editor.vue
import { Gradient } from "whatamesh";
import { useEffect, useState, useRef } from "react";
import { randomColor } from "randomcolor";
import clsx from "clsx";
import { useIdle, useToggle, useFullscreen, useKey } from "react-use";
import { Transition } from "@headlessui/react";
import { IoPause, IoPlay } from "react-icons/io5";
import { GoMarkGithub } from "react-icons/go";
import { AiOutlineFullscreenExit, AiOutlineFullscreen } from "react-icons/ai";
import {
  MdFlashlightOff,
  MdFlashlightOn,
  MdFormatColorReset,
} from "react-icons/md";

export default function () {
  const idCanvas = "Whatamesh";

  const defaultColorPalette = ["#000000", "#111111", "#222222", "#333333"];

  const ref1 = useRef(new Gradient());

  const ref2 = useRef(null);

  const isIdle = useIdle(3e3);

  const [state, setState] = useState(defaultColorPalette);

  const [toggle1, setToggle1] = useToggle(true);

  const [toggle2, setToggle2] = useToggle(false);

  const [toggle3, setToggle3] = useToggle(false);

  // https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
  const isNotDefaultColorPalette =
    JSON.stringify(state) !== JSON.stringify(defaultColorPalette);

  function refreshGradient() {
    ref1.current.initGradient(`#${idCanvas}`);
    setToggle1(true); // ??
  }

  function setDarkenTopGradient() {
    setToggle3();
    refreshGradient();
  }

  function setRandomColorPallete(parameter) {
    setState(randomColor({ ...parameter, count: 4 }));
    refreshGradient();
  }

  function setDefaultColorPalette() {
    setState(defaultColorPalette);
    refreshGradient();
  }

  // https://github.com/davidmerfield/randomColor#options
  function randomColorPallete() {
    setRandomColorPallete({
      luminosity: "random",
      hue: "random",
    });
  }

  function brightColorPallete() {
    setRandomColorPallete({ luminosity: "bright" });
  }

  function lightColorPallete() {
    setRandomColorPallete({ luminosity: "light" });
  }

  function darkColorPallete() {
    setRandomColorPallete({ luminosity: "dark" });
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
  useKey("p", setToggle1);
  useKey(" ", setToggle1);
  useKey("f", setToggle2);
  useKey("Enter", setToggle2);
  useKey("Control", setDarkenTopGradient);
  useKey("Shift", setDarkenTopGradient);
  useKey("r", randomColorPallete);
  useKey("b", brightColorPallete);
  useKey("l", lightColorPallete);
  useKey("d", darkColorPallete);

  useFullscreen(ref2, toggle2, {
    onClose: () => setToggle2(false),
  });

  useEffect(() => {
    refreshGradient();
  }, []);

  // useEffect(randomColorPallete, [useMouseWheel()]);

  useEffect(() => {
    toggle1 ? ref1.current.play() : ref1.current.pause(); // ??
  }, [toggle1]);

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
        className="h-screen w-screen select-none"
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
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-row items-baseline gap-x-1">
              <h1 className="font-serif text-5xl sm:first-letter:text-8xl">
                {idCanvas}
              </h1>
              <div className="flex flex-row items-baseline text-xs sm:text-sm">
                {isNotDefaultColorPalette ? (
                  <button onClick={setDefaultColorPalette} title="color reset">
                    <MdFormatColorReset />
                  </button>
                ) : undefined}
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
                  {!toggle2 ? (
                    <AiOutlineFullscreen />
                  ) : (
                    <AiOutlineFullscreenExit />
                  )}
                </button>
                <button
                  onClick={setDarkenTopGradient}
                  title="toggle darken top"
                >
                  {!toggle3 ? <MdFlashlightOn /> : <MdFlashlightOff />}
                </button>
              </div>
            </div>
            <div className="flex flex-col items-start gap-y-1 pl-5 text-xl sm:pl-10 sm:text-2xl">
              <button onClick={randomColorPallete}>random</button>
              <button onClick={brightColorPallete}>bright</button>
              <button onClick={lightColorPallete}>light</button>
              <button onClick={darkColorPallete}>dark</button>
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
