import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import { Suspense, useEffect, useState, useContext } from 'react';
import { UIEarthContext } from '@/context/ui-earth-context';
// import Earth from '@/components/earth';

const Index = () => {
  const router = useRouter();
  const earthState = useContext(UIEarthContext)

  console.log(earthState)


  return (
    <Main
      meta={
        <Meta
          title="Eoin Fitzpatrick"
          description="Eoin's website"
        />
      }
    >
      {earthState.landerOpen && 
        <div>
          Hello!
        </div>      
      }


      
    </Main>
  );
};

export default Index;
