import * as React from "react";
import Nav from "./nav";

interface LayoutProps {
	children: React.ReactChild;
	hero?: string;
}

export default function Layout({ hero, children }: LayoutProps) {
	return (
		<>
			{hero ? (
				<div className="w-full absolute top-0 transform translate-y-20 tablet:transform-none tablet:h-screen-3/4">
					<img
						className="object-cover h-full w-full"
						alt="Hero Image - NH DECA"
						src={hero}
					/>
				</div>
			) : null}
			<Nav />
			<div className="container mx-auto">{children}</div>
		</>
	);
}
