import type { ImageProps, MantineColor, MantineGradient } from "@mantine/core";
import {
    Anchor,
    Badge,
    Button,
    Card,
    Group,
    Image as MantineImage,
    SimpleGrid,
    Text,
} from "@mantine/core";
import {
    IconBrandGithub,
    IconBrandGmail,
    IconBrandLinkedin,
} from "@tabler/icons";
import { Fragment, useContext, useEffect, useState } from "react";

import { UIEarthContext } from "@/context/ui-earth-context";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";

// import Earth from '@/components/earth';

interface IProjectBadge {
    text: string;
    color: MantineColor;
}

interface IMyProject {
    projectURL?: string;
    projectTitle: string;
    description: string;
    projectImage?: string;
    noUrl?: boolean;
    imageProps?: Partial<ImageProps>;
    badges?: IProjectBadge[];
}

interface IHomeState {
    helloColor: MantineGradient;
    projects: IMyProject[];
    hoverIndex: number;
}

const colors: string[] = [
    "#E03131",
    "#C2255C",
    "#9C36B5",
    "#6741D9",
    "#3B5BDB",
    "#1971C2",
    "#0C8599",
    "#099268",
    "#2F9E44",
    "#66A80F",
    "#F08C00",
    "#E8590C",
];

const RenderProjectCard = (inputProject: IMyProject) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    return (
        <Card shadow="sm" p="lg" radius="md" withBorder className="max-h-80">
            <Card.Section>
                <MantineImage
                    height={expanded ? 200 : 80}
                    onClick={() => setExpanded((p) => !p)}
                    {...inputProject.imageProps}
                    src={inputProject.projectImage}
                    className="border-purple-600 border"
                    // className="hover:border-purple-600 hover:border transition-colors"
                    alt="proj-img"
                />
            </Card.Section>

            {!expanded ? (
                <>
                    <Text mt="md" weight={500}>
                        {inputProject.projectTitle}
                    </Text>
                    <Group position="left" mb="xs">
                        {inputProject.badges?.map((badge, index) => {
                            return (
                                <Badge
                                    key={index}
                                    color={badge.color}
                                    variant="light"
                                >
                                    {badge.text}
                                </Badge>
                            );
                        })}
                    </Group>

                    <Text size="sm" color="dimmed">
                        {inputProject.description}
                    </Text>

{!inputProject.noUrl &&
                    <Button
                        component="a"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={inputProject.projectURL}
                        variant="light"
                        color="blue"
                        fullWidth
                        mt="md"
                        radius="md"
                        disabled={inputProject.projectURL == null}
                    >
                        {inputProject.projectURL
                            ? "View project"
                            : "Coming soon"}
                    </Button>
}

                </>
            ) : (
                <div className="flex items-center mt-4">
                    <Text weight={500}>{inputProject.projectTitle}</Text>
                    <Group position="left" ml="sm" align="center" noWrap>
                        {inputProject.badges?.map((badge, index) => {
                            return (
                                <Badge
                                    key={index}
                                    color={badge.color}
                                    variant="light"
                                >
                                    {badge.text}
                                </Badge>
                            );
                        })}
                    </Group>
                </div>
            )}
        </Card>
    );
};

const getRandomGradient = (): MantineGradient => {
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    let color2 = colors[Math.floor(Math.random() * colors.length)];
    while (color1 === color2) {
        color2 = colors[Math.floor(Math.random() * colors.length)];
    }

    return { from: color1 || "inherit", to: color2 || "inherit", deg: 45 };
};

const Index = () => {
    const earthState = useContext(UIEarthContext);

    const [homeState, setHomeState] = useState<IHomeState>({
        helloColor: { from: "inherit", to: "inherit", deg: 45 },
        projects: [],
        hoverIndex: 0,
    });

    useEffect(() => {
        setHomeState((prev) => ({
            ...prev,
            helloColor: getRandomGradient(),
            projects: [
                {
                    // projectURL: "https://scanr.ai",
                    projectTitle: "Scanr.ai",
                    projectImage: "/scanrai-charts.png",
                    badges: [
                        {
                            color: "blue",
                            text: "Typescript",
                        },
                        {
                            color: "teal",
                            text: "React",
                        },
                        {
                            color: "gray",
                            text: "NextJS 14",
                        },
                        {
                            color: "yellow",
                            text: "PostgreSQL",
                        },
                        {
                            color: "orange",
                            text: "SST",
                        },
                    ],
                    description:
                        "Written Typescript NextJS, Scanr.ai offers an advanced stock market scanner using user-defined filters which support nesting and saving.",
                },
                {
                    projectTitle: "BagsByData - Leviathan API",
                    projectImage: "/leviathan-kraken-logo.png",
                    noUrl: true,
                    imageProps: {
                        fit: "contain",
                    },
                    badges: [
                        {
                            color: "purple",
                            text: "Go",
                        },
                        {
                            color: "yellow",
                            text: "PostgreSQL",
                        },
                        {
                            color: "green",
                            text: "AWS ECS",
                        },
                        {
                            color: "orange",
                            text: "python",
                        },
                    ],
                    description: "Written in Go, the Leviathan API is a comprehensive, stock market API. A hybrid microservice approach was taken to maximize performance and minimize complexity. \
                    Ingestion is handled by multiple ingress APIs (Intrinio, others) along with cron jobs to update stocks & indices data in a PostgreSQL database.",
                },
                {
                    projectURL:
                        "https://github.com/efitzkiwi/NT8SupplyDemandDTBot",
                    projectTitle: "NT8SupplyDemandBot",
                    projectImage: "/ninjatrader.jpg",
                    badges: [
                        {
                            text: "C#",
                            color: "lime",
                        },
                    ],
                    description:
                        "Stock trading bot written in C# based off supply/demand zones. Fully manages one position with a maximum of 2-bracket OCO orders.",
                },
                {
                    projectURL: "https://bagsbydata.com",
                    projectTitle: "BagsByData.com",

                    projectImage: "/bbd.com.png",
                    badges: [
                        {
                            color: "blue",
                            text: "Typescript",
                        },
                        {
                            color: "teal",
                            text: "React",
                        },
                        {
                            color: "red",
                            text: "Astro",
                        },
                    ],
                    description:
                        "SaaS stock market analytics parent website. Tailored for retail traders and institutions alike.\
                        Built using Astro, React and Typescript",
                },
                {
                    projectTitle: `My website!`,
                    projectImage: "/earth.jpg",
                    noUrl: true,
                    badges: [
                        {
                            color: "blue",
                            text: "Typescript",
                        },
                        {
                            color: "teal",
                            text: "React",
                        },
                        {
                            color: "gray",
                            text: "NextJS",
                        },
                    ],
                    description:
                        "Combined ThreeJS, react, and NextJS to build this beautiful earth simulation with a responsive UI! Launched via AWS Amplify.",
                },
            ],
        }));
    }, []);

    useEffect(() => {
        setHomeState((prev) => ({
            ...prev,
            helloColor: getRandomGradient(),
        }));
    }, [homeState.hoverIndex]);

    return (
        <Main meta={<Meta title="Home" description="Eoin's website" />}>
            {earthState.landerOpen && <div>Hello!</div>}

            <div className="grid place-items-center">
                <h1>
                    <Text
                        component="span"
                        align="center"
                        variant="gradient"
                        gradient={homeState.helloColor}
                        onMouseEnter={() =>
                            setHomeState((prev) => ({
                                ...prev,
                                hoverIndex: prev.hoverIndex + 1,
                            }))
                        }
                    >
                        HOWDY,
                    </Text>{" "}
                    I'M EOIN
                </h1>
            </div>

            <div>
                I am a fullstack software developer living in Baltimore.
                Currently building
                <Anchor href="https://bagsbydata.com/" target="_blank">
                    {" "}
                    BagsByData.com
                </Anchor>
                's suite of products while working remotely as a software
                engineer.
            </div>

            <div className="pt-2">
                Currently practicing Go, Typescript, and Python. ✔️
            </div>
            <ul></ul>
            <div>Learning Rust, Kubernetes, and machine learning techniques 🧠💡</div>

            <h2 className="grid mt-8 text-3xl place-items-center">Projects</h2>
            <SimpleGrid
                cols={2}
                spacing={"lg"}
                breakpoints={[
                    { maxWidth: 766, cols: 2, spacing: "md" },
                    { maxWidth: 600, cols: 1, spacing: "sm" },
                ]}
            >
                {homeState.projects.map((project, index) => {
                    return (
                        <Fragment key={index}>
                            {<RenderProjectCard {...project} />}
                        </Fragment>
                    );
                })}
            </SimpleGrid>

            <div
                style={{
                    display: "flex",
                    gap: "5px",
                    justifyContent: "center",
                    marginTop: "50px",
                }}
            >
                <Button
                    variant="gradient"
                    gradient={homeState.helloColor}
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://github.com/efitzkiwi"
                    leftIcon={<IconBrandGithub size={18} />}
                    compact={true}
                >
                    Github
                </Button>

                <Button
                    variant="gradient"
                    gradient={homeState.helloColor}
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.linkedin.com/in/efitz1/"
                    leftIcon={<IconBrandLinkedin size={18} />}
                    compact={true}
                >
                    LinkedIn
                </Button>

                <Button
                    variant="gradient"
                    gradient={homeState.helloColor}
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="mailto:eoinmikefitz@gmail.com"
                    type="button"
                    leftIcon={<IconBrandGmail size={18} />}
                    compact={true}
                >
                    gmail
                </Button>
            </div>
        </Main>
    );
};

export default Index;
