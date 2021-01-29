import { useEffect, useState } from "react";

function throttle(callback: () => void, limit: number) {
	var waiting = false;
	return function () {
		if (!waiting) {
			callback();
			waiting = true;
			setTimeout(function () {
				waiting = false;
			}, limit);
		}
	};
}

type Breakpoint = "phone" | "tablet" | "desktop";

function getDeviceConfig(width: number): Breakpoint {
	if (width < 760) {
		return "phone";
	} else if (width < 1280) {
		return "tablet";
	} else {
		return "desktop";
	}
}

const useBreakpoint = () => {
	if (typeof window !== "undefined") {
		const [breakpoint, setBreakpoint] = useState(() =>
			getDeviceConfig(window.innerWidth)
		);

		useEffect(() => {
			const calcInnerWidth = throttle(() => {
				setBreakpoint(getDeviceConfig(window.innerWidth));
			}, 200);
			window.addEventListener("resize", calcInnerWidth);
			return () => window.removeEventListener("resize", calcInnerWidth);
		});

		return breakpoint;
	}
};
export default useBreakpoint;
