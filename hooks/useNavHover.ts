import { useEffect, useState } from "react";

const useNavHover = (): [boolean, any, any] => {
	const [hover, setHover] = useState(false);
	const [primaryHover, setPrimaryHover] = useState(false);
	const [secondaryHover, setSecondaryHover] = useState(false);

	const primaryProps = {
		onMouseOver: () => {
			setPrimaryHover(true);
		},
		onMouseOut: () => {
			setPrimaryHover(false);
		},
	};

	const secondaryProps = {
		onMouseOver: () => {
			setSecondaryHover(true);
		},
		onMouseOut: () => {
			setSecondaryHover(false);
		},
	};

	useEffect(() => {
		if (primaryHover || secondaryHover) setHover(true);
		else setHover(false);
	}, [primaryHover, secondaryHover]);

	return [hover, primaryProps, secondaryProps];
};
export default useNavHover;
