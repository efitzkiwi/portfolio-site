import Link from 'next/link';
import type { ReactNode } from 'react';

import { AppConfig } from '@/utils/AppConfig';
import styled from 'styled-components'
import { Button } from '@mantine/core';

const Wrapper = styled.div`
  background-color: rgba(40, 40, 40, 0.5);
  border-radius: 5px;
  margin-top: 8px;
  padding: 8px;
`

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="px-1 antialiased absolute">
    {props.meta}
    <div className="ml-2 max-w-screen-lg">

    <Wrapper>
        <ul className="flex flex-wrap text-xl">
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
        </ul>
        {AppConfig.title}
        <div className="content py-5 text-xl">{props.children}</div>

        <div className="border-t border-gray-300 py-8 text-center text-sm">
          © Copyright {new Date().getFullYear()} {AppConfig.title}
        </div>
    </Wrapper>



    </div>      

  </div>
);

export { Main };
