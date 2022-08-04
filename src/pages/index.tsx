import type { MantineColor, MantineGradient } from "@mantine/core";
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
  projectURL: string;
  projectTitle: string;
  description: string;
  projectImage?: string;
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
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section>
        <MantineImage
          src={inputProject.projectImage}
          height={80}
          alt="proj-img"
        />
      </Card.Section>

      <Text mt="md" weight={500}>
        {inputProject.projectTitle}
      </Text>
      <Group position="left" mb="xs">
        {inputProject.badges?.map((badge, index) => {
          return (
            <Badge key={index} color={badge.color} variant="light">
              {badge.text}
            </Badge>
          );
        })}
      </Group>

      <Text size="sm" color="dimmed">
        {inputProject.description}
      </Text>

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
      >
        View project
      </Button>
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
          projectURL: "https://github.com/efitzkiwi/NT8SupplyDemandDTBot",
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
          projectImage: "/bagsbydata.jpg",
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
              color: "orange",
              text: "Python",
            },
            {
              color: "green",
              text: "Django",
            },
            {
              color: "yellow",
              text: "PostgreSQL",
            },
          ],
          description:
            "Stock trading bot written in C# based off supply/demand zones. Fully manages one position with a maximum of 2-bracket OCO orders.",
        },
        {
          projectURL:
            "https://github.com/efitzkiwi/Websocket-Data-Bridge-Public",
          projectTitle: "Websocket Bridge",
          projectImage: "/databridge.jpg",
          badges: [
            {
              text: "Go",
              color: "grape",
            },
            {
              text: "API",
              color: "red",
            },
          ],
          description:
            "Go implementation of a polygon.io stock data API bridge. This bridge allows unlimited clients to connect to a single Polygon.io api connection by routing traffic through a high-speed websocket.",
        },
        {
          projectURL: "https://github.com/efitzkiwi/portfolio-site",
          projectTitle: `My website!`,
          projectImage: "/earth.jpg",
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
              text: "Next JS",
            },
          ],
          description:
            "Combined ThreeJS, react, and NextJS to build this beautiful earth simulation with a responsive UI!",
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
        I am a fullstack software developer based outside of DC. Building
        <Anchor href="https://bagsbydata.com/" target="_blank">
          {" "}
          BagsByData.com{" "}
        </Anchor>
        while working for a well-known aerospace contractor.
      </div>

      <div>Currently practicing Typescript, Python, and Golang</div>

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
          return <Fragment key={index}>{RenderProjectCard(project)}</Fragment>;
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
