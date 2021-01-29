import * as React from "react";
import cn from "classnames";
import Link from "next/link";
import useBreakpoint from "../hooks/useBreakpoint";
import { debug } from "console";
import useNavHover from "../hooks/useNavHover";
import { getSections, Section } from "../utils/firestore";

export default function Nav() {
	const [sections, setSections] = React.useState<Section[] | null>(null);
	const [aboutHover, aboutPrimary, aboutSecondary] = useNavHover();
	const [membersHover, membersPrimary, membersSecondary] = useNavHover();
	const [confHover, confPrimary, confSecondary] = useNavHover();
	const [newsHover, newsPrimary, newsSecondary] = useNavHover();
	const breakpoint = useBreakpoint();

	React.useEffect(() => {
		initialize();
	}, []);
	const initialize = async () => {
		const sectionsResult = await getSections();
		setSections(sectionsResult);
	};

	const getSlugs = (section: Section) => {
		const slugs = [];
		for (const slug in section) {
			slugs.push(slug);
		}
		return slugs;
	};

	const getLabels = (section: Section) => {
		const labels = [];
		for (const page in section) {
			labels.push(section[page].label);
		}
		return labels;
	};

	return (
		<div
			className="fixed top-0 flex z-10 items-center justify-between h-16 tablet:h-20 w-full 
		bg-blue-900 bg-blur px-2 tablet:px-8 tablet:bg-transparent"
		>
			<img
				className="h-2/5 tablet:h-3/5"
				alt="NH DECA Logo - White"
				src="/svg/nhdecaWhite.svg"
			/>

			{breakpoint === "phone"
				? null
				: sections && (
						<div className="flex items-center space-x-5 text-white tracking-widest uppercase font-light">
							<NavLink slug="about" hoverProps={aboutPrimary}>
								<NavTooltip
									hoverProps={aboutSecondary}
									hover={aboutHover}
									prefix="about/"
									slugs={getSlugs(sections[0])}
									labels={getLabels(sections[0])}
								/>
							</NavLink>

							<NavLink slug="members" hoverProps={membersPrimary}>
								<NavTooltip
									hoverProps={membersSecondary}
									hover={membersHover}
									prefix="members/"
									slugs={getSlugs(sections[1])}
									labels={getLabels(sections[1])}
								/>
							</NavLink>

							<NavLink slug="conferences" hoverProps={confPrimary}>
								<NavTooltip
									hoverProps={confSecondary}
									hover={confHover}
									prefix="conferences/"
									slugs={getSlugs(sections[2])}
									labels={getLabels(sections[2])}
								/>
							</NavLink>

							<NavLink slug="news" hoverProps={newsPrimary}>
								<NavTooltip
									hoverProps={newsSecondary}
									hover={newsHover}
									prefix="news/"
									slugs={getSlugs(sections[3])}
									labels={getLabels(sections[3])}
								/>
							</NavLink>

							<Link href="/contact">
								<a className="bg-decaBlue px-4 py-2 rounded-md hover:bg-blue-700 transition">
									Contact
								</a>
							</Link>
						</div>
				  )}
		</div>
	);
}

interface NavLinkProps {
	slug: string;
	text?: string;
	isActive?: boolean;
	children: React.ReactChild;
	hoverProps: any;
}

function NavLink({ slug, text, isActive, hoverProps, children }: NavLinkProps) {
	if (!text) {
		text = slug;
	}

	return (
		<div className="h-20 flex items-center" {...hoverProps}>
			<Link href={slug}>
				<a
					className={cn({
						"hover:text-blue-300 transition relative": true,
						"text-blue-300": isActive,
					})}
				>
					<>
						{text}
						{children}
					</>
				</a>
			</Link>
		</div>
	);
}

interface NavTooltipProps {
	prefix: string;
	slugs: string[];
	labels: string[];
	hoverProps: any;
	hover: boolean;
}

function NavTooltip({
	slugs,
	labels,
	prefix,
	hoverProps,
	hover,
}: NavTooltipProps) {
	if (slugs.length !== labels.length) return null;

	return (
		<ul
			className={`flex flex-col space-y-2 absolute top-12 bg-gray-200 rounded-b-lg p-4 w-60 text-black duration-300 transition-opacity ${
				hover ? "opacity-full" : "opacity-0"
			}`}
			{...hoverProps}
		>
			{slugs.map((slug, index) => (
				<li key={slug}>
					<Link href={prefix.concat(slug)}>
						<a className="hover:text-blue-600">{labels[index]}</a>
					</Link>
				</li>
			))}
		</ul>
	);
}
