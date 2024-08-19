import type { ColorScheme } from '@mantine/core';
import { ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconMoonStars, IconSun } from '@tabler/icons';
import type { ReactNode } from 'react';

import { AppConfig } from '@/utils/AppConfig';

interface WrapperProps {
  theme: ColorScheme;
}

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  return (
    <div className="absolute px-1 antialiased">
      {props.meta}
      <div className="ml-2 max-w-screen-lg">
        <div style={{borderRadius: "5px", marginTop: "8px", padding: "8px", backgroundColor: dark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)'}}>
          {/* <ul className="flex flex-wrap text-xl">
            <li className="mr-6">
            <Link href="/" passHref>
              <Button component="a" variant='subtle'>Home</Button>
            </Link>
            </li>
            <li className="mr-6">
            <Link href="/about/" passHref>
              <Button component="a" variant='subtle'>About me</Button>
            </Link>
            </li>
          </ul> */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{AppConfig.title}</span>
            <ActionIcon
              variant="outline"
              color={dark ? 'yellow' : 'blue'}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
          </div>

          <div className="content py-5 text-xl">{props.children}</div>
          <hr></hr>
          <div className="border-t border-gray-300 py-8 text-center text-sm">
            © Copyright {new Date().getFullYear()} {AppConfig.title}
          </div>
        </div>
      </div>
    </div>
  );
};

export { Main };
