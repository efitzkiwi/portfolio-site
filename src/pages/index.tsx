import type { MantineGradient } from '@mantine/core';
import {
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  Image as MantineImage,
  SimpleGrid,
  Text,
} from '@mantine/core';
import { useHover } from '@mantine/hooks';
import {
  IconBrandGithub,
  IconBrandGmail,
  IconBrandLinkedin,
} from '@tabler/icons';
import { Fragment, useContext, useEffect, useState } from 'react';

import { UIEarthContext } from '@/context/ui-earth-context';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

// import Earth from '@/components/earth';

interface IProjectBadge {
  text: string;
  color: string;
}

interface IMyProject {
  projectURL: string;
  projectTitle: string;
  projectImage?: string;
  badges?: IProjectBadge[];
}

interface IHomeState {
  helloColor: MantineGradient;
  projects: IMyProject[];
}

const colors: string[] = [
  '#E03131',
  '#C2255C',
  '#9C36B5',
  '#6741D9',
  '#3B5BDB',
  '#1971C2',
  '#0C8599',
  '#099268',
  '#2F9E44',
  '#66A80F',
  '#F08C00',
  '#E8590C',
];

const RenderProjectCard = (inputProject: IMyProject) => {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section>
        <MantineImage
          src="https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          height={160}
          alt="Norway"
        />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>Norway Fjord Adventures</Text>
        <Badge color="pink" variant="light">
          On Sale
        </Badge>
      </Group>

      <Text size="sm" color="dimmed">
        With Fjord Tours you can explore more of the magical fjord landscapes
        with tours and activities on and around the fjords of Norway
      </Text>

      <Button variant="light" color="blue" fullWidth mt="md" radius="md">
        Book classic tour now
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

  return { from: color1 || 'inherit', to: color2 || 'inherit', deg: 45 };
};

const Index = () => {
  const earthState = useContext(UIEarthContext);

  const [homeState, setHomeState] = useState<IHomeState>({
    helloColor: { from: 'inherit', to: 'inherit', deg: 45 },
    projects: [
      {
        projectURL: 'maksmda',
        projectTitle: 'Hello wtf',
        projectImage: 'asdasdsa',
        badges: [],
      },
      {
        projectURL: 'maksmda',
        projectTitle: 'Hello wtf',
        projectImage: 'asdasdsa',
        badges: [],
      },
      {
        projectURL: 'maksmda',
        projectTitle: 'Hello wtf',
        projectImage: 'asdasdsa',
        badges: [],
      },
      {
        projectURL: 'maksmda',
        projectTitle: 'Hello wtf',
        projectImage: 'asdasdsa',
        badges: [],
      },
      {
        projectURL: 'maksmda',
        projectTitle: 'Hello wtf',
        projectImage: 'asdasdsa',
        badges: [],
      },
    ],
  });
  const { hovered, ref } = useHover();

  useEffect(() => {
    setHomeState((prev) => ({
      ...prev,
      helloColor: getRandomGradient(),
    }));
  }, []);

  useEffect(() => {
    setHomeState((prev) => ({
      ...prev,
      helloColor: getRandomGradient(),
    }));
  }, [hovered]);

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
            ref={ref}
          >
            HOWDY,
          </Text>{' '}
          I'M EOIN
        </h1>
      </div>

      <div>
        I'm a fullstack software developer based outside of DC. I'm building
        <Anchor href="https://bagsbydata.com/" target="_blank">
          {' '}
          BagsByData.com{' '}
        </Anchor>
        while working for a well-known aerospace contractor.
      </div>

      <div>Currently practicing Typescript, Python, and Golang</div>

      <h3>Projects</h3>
      <SimpleGrid
        cols={3}
        spacing={'md'}
        breakpoints={[
          { maxWidth: 766, cols: 2, spacing: 'sm' },
          { maxWidth: 600, cols: 1, spacing: 'sm' },
        ]}
      >
        {homeState.projects.map((project, index) => {
          return <Fragment key={index}>{RenderProjectCard(project)}</Fragment>;
        })}
      </SimpleGrid>

      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
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
