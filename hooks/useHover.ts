import { useState } from "react";

const useHover = () => {
	const [hover, setHover] = useState(false);

	const props = {
		onMouseOver: () => setHover(true),
		onMouseOut: () => setHover(false),
	};

	return [hover, props];
};
export default useHover;
