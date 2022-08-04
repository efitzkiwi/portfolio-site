import { useMantineColorScheme } from "@mantine/core";
import { Html, OrbitControls } from "@react-three/drei";
import type { HtmlProps } from "@react-three/drei/web/Html";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  Ref,
  Suspense,
} from "react";
import type { Mesh, Object3D } from "three";
import * as THREE from "three";
import { MeshPhongMaterial, TextureLoader } from "three";
import CustomShaderMaterial from "three-custom-shader-material";

import { UIEarthContext } from "@/context/ui-earth-context";

import styles from "../styles/earth.module.scss";

// https://codesandbox.io/s/priceless-bohr-xlum2?file=/src/models/Earth.js:158-165

const vs = `
uniform vec3 uLight;
varying vec2 vUv2;
varying float vDist;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float normalize(float v) { return map(v, -1.0, 1.0, 0.0, 1.0); }

void main() {
  vUv2 = uv;
  vDist = clamp(pow(normalize(dot(normalize(uLight) * vec3(-1.,1.,-1.) , position) * 2.), 1.), 0., 1.);
}
`;

const fs = `
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform vec3 uLight;
varying vec2 vUv2;
varying float vDist;

void main() {
  vec4 texDay = texture2D(uDay, vUv2);
  vec4 texNight = texture2D(uNight, vUv2);
  float c = vDist;
  vec4 d = mix(texDay,texNight,vDist);
  csm_DiffuseColor = d;
}
`;

interface IMarker extends HtmlProps {
  occludeRef?: Ref<Object3D>[];
}

// Let's make the marker into a component so that we can abstract some shared logic
function Marker(props: IMarker) {
  // This holds the local occluded state
  const [occluded, occlude] = useState<boolean>();
  const earthContext = useContext(UIEarthContext);
  // const {camera} = useThree()

  const toggleLander = () => {
    earthContext.callbackFuncs.toggleLander();
  };

  return (
    <Html
      // @ts-ignore
      occlude={props.occludeRef}
      // Tells us when contents are occluded (or not)
      // @ts-ignore
      onOcclude={occlude}
      // We just interpolate the visible state into css opacity and transforms
      style={{
        transition: "all 0.2s",
        opacity: occluded ? 0 : 1,
        transform: `scale(${occluded ? 0.25 : 1})`,
      }}
      className={"noselect pulsating-circle"}
      {...props}
    >
      <div
        onClick={toggleLander}
        style={{ zIndex: 10000 }}
        className={styles.pulsatingcircle}
      />
      {props.children}
    </Html>
  );
}

// Let's make the marker into a component so that we can abstract some shared logic
function MarkerText(props: IMarker) {
  // This holds the local occluded state
  const [occluded, occlude] = useState<boolean>();

  // const {camera} = useThree()

  return (
    <Html
      transform={false}
      // @ts-ignore
      occlude={props.occludeRef}
      // Tells us when contents are occluded (or not)
      // @ts-ignore
      onOcclude={occlude}
      // We just interpolate the visible state into css opacity and transforms
      style={{
        transition: "all 0.2s",
        opacity: occluded ? 0 : 1,
        transform: `scale(${occluded ? 0.25 : 1})`,
      }}
      className={"noselect"}
      {...props}
    >
      {props.children}
    </Html>
  );
}

function degreesToRadians(degrees: number) {
  const pi = Math.PI;
  return degrees * (pi / 180);
}

function calcPosFromLatLonRad(radius: number, lat: number, lon: number) {
  const spherical = new THREE.Spherical(
    radius,
    degreesToRadians(90 - lon),
    degreesToRadians(lat) + Math.PI * 0.5
  );

  const vector = new THREE.Vector3();
  vector.setFromSpherical(spherical);

  return vector;
}

const CameraWrapper = () => {
  const { camera } = useThree();
  const fullWidth = window.innerWidth;
  const fullHeight = window.innerHeight;
  const xPixels = -600;
  const yPixels = 200;

  camera.setViewOffset(
    fullWidth,
    fullHeight,
    xPixels,
    yPixels,
    fullWidth,
    fullHeight
  );
  return null;
};

function EarthItselfMin(props: any) {
  const [colorMap, nightMap, specMap, displacementMap] = useLoader(
    TextureLoader,
    [
      "/earth/color_min.jpg",
      "/earth/night2.jpg",
      "/earth/earth_spec.jpg",
      "/earth/displacement_alt_min.jpg",
    ]
  );

  const uniforms = useMemo(
    () => ({
      uDay: { value: colorMap },
      uNight: { value: nightMap },
      uLight: { value: new THREE.Vector3(1, 0, 0) },
    }),
    [colorMap, nightMap]
  );

  return (
    <mesh visible scale={10} ref={props.earthRef} receiveShadow={true}>
      <sphereGeometry args={[1, 400, 400]} />

      <CustomShaderMaterial
        ref={props.mat}
        baseMaterial={MeshPhongMaterial}
        vertexShader={vs}
        fragmentShader={fs}
        uniforms={uniforms}
        displacementMap={displacementMap}
        specularMap={specMap}
        displacementScale={0.08}
      />

      {/* <meshPhongMaterial
      map={colorMap}
      displacementMap={displacementMap}
      specularMap={specMap}
      displacementScale={0.08}
      opacity={1}
      transparent={false}
    /> */}
    </mesh>
  );
}

function EarthItselfMax(props: any) {
  const [colorMap, nightMap, specMap, displacementMap] = useLoader(
    TextureLoader,
    [
      "/earth/color2.jpg",
      "/earth/night2.jpg",
      "/earth/earth_spec.jpg",
      "/earth/displacement_alt.png",
    ]
  );

  const uniforms = useMemo(
    () => ({
      uDay: { value: colorMap },
      uNight: { value: nightMap },
      uLight: { value: new THREE.Vector3(1, 0, 0) },
    }),
    [colorMap, nightMap]
  );

  return (
    <mesh visible scale={10} ref={props.earthRef} receiveShadow={true}>
      <sphereGeometry args={[1, 400, 400]} />

      <CustomShaderMaterial
        ref={props.mat}
        baseMaterial={MeshPhongMaterial}
        vertexShader={vs}
        fragmentShader={fs}
        uniforms={uniforms}
        displacementMap={displacementMap}
        specularMap={specMap}
        displacementScale={0.08}
      />

      {/* <meshPhongMaterial
      map={colorMap}
      displacementMap={displacementMap}
      specularMap={specMap}
      displacementScale={0.08}
      opacity={1}
      transparent={false}
    /> */}
    </mesh>
  );
}

function EarthBase(props: any) {
  const { earthRef } = props;
  const washingtonDCCartesianCoords = useMemo(() => {
    return calcPosFromLatLonRad(10.2, -77.0369, 38.9072);
  }, []);
  const occludeRef = useRef<any>(null!);
  const groupRef = useRef<any>();
  const mat = useRef<any>();
  // const arrowHelperRef = useRef<any>();

  useFrame(() => {
    groupRef.current.rotation.y += 0.0005;
    if (
      mat?.current?.uniforms &&
      groupRef.current &&
      props.sunRef.current.position
    ) {
      // get the relative position of the sun
      const v = new THREE.Vector3();
      v.copy(props.sunRef.current?.position);
      props.sunRef.current?.localToWorld(v);
      groupRef.current?.worldToLocal(v);
      // arrowHelperRef.current.setDirection(v)
      mat.current.uniforms.uLight.value = v;
    }
  });
  return (
    <group ref={groupRef} rotation={[0, Math.PI * 0.5, 0]}>
      {/* <arrowHelper ref={arrowHelperRef} args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 15, 'orange']} /> */}

      <Suspense fallback={<EarthItselfMin mat={mat} earthRef={earthRef} />}>
        <EarthItselfMax mat={mat} earthRef={earthRef} />
      </Suspense>

      <mesh scale={10} ref={occludeRef} castShadow={true}>
        <sphereGeometry args={[1, 50, 50]} />
      </mesh>

      <group position={washingtonDCCartesianCoords}>
        <Marker occludeRef={[occludeRef]} />
        <MarkerText occludeRef={[occludeRef]}>
          <div
            style={{
              position: "absolute",
              right: 14,
              top: -120,
              display: "flex",
              width: "130px",
              overflow: "wrap",
              aspectRatio: "1:1",
            }}
          >
            <img src="/me.png" alt="me" />
          </div>
        </MarkerText>
      </group>
    </group>
  );
}

function CloudsItselfMin(props: any) {
  const clouds = useLoader(TextureLoader, "/earth/clouds_min.jpg");
  return (
    <mesh
      visible
      rotation={[0, -Math.PI * 0.5, 0]}
      scale={10.5}
      ref={props.cloudsRef}
      receiveShadow={true}
    >
      <sphereGeometry args={[1, 100, 100]} />
      <meshStandardMaterial
        map={clouds}
        alphaMap={clouds}
        opacity={0.8}
        transparent={true}
      />
    </mesh>
  );
}

function CloudsItselfMax(props: any) {
  const clouds = useLoader(TextureLoader, "/earth/clouds.jpg");
  return (
    <mesh
      visible
      rotation={[0, -Math.PI * 0.5, 0]}
      scale={10.5}
      ref={props.cloudsRef}
      receiveShadow={true}
    >
      <sphereGeometry args={[1, 100, 100]} />
      <meshStandardMaterial
        map={clouds}
        alphaMap={clouds}
        opacity={0.8}
        transparent={true}
      />
    </mesh>
  );
}

function EarthClouds() {
  const cloudsRef = useRef<Mesh>(null!);
  useFrame(() => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.00075;
    }
  });
  return (
    <Suspense fallback={<CloudsItselfMin />}>
      <CloudsItselfMax cloudsRef={cloudsRef} />
    </Suspense>
  );
}

function Moon() {
  // const displacementMap = useLoader(TextureLoader, '/earth/moon_dis.jpg');
  // const colorMap = useLoader(TextureLoader, '/earth/moon.jpg');

  const [colorMap, displacementMap] = useLoader(TextureLoader, [
    "/earth/moon.jpg",
    "/earth/moon_dis.jpg",
  ]);

  const moonParentRef = useRef<any>(null!);
  useFrame(() => {
    moonParentRef.current.rotation.y += 0.001;
  });
  return (
    <group ref={moonParentRef}>
      <mesh
        visible
        rotation={[0, -Math.PI * 0.5, 0]}
        scale={3}
        position={[30, 0, 0]}
        receiveShadow={true}
      >
        <sphereGeometry args={[1, 600, 600]} />
        <meshPhongMaterial
          map={colorMap}
          displacementMap={displacementMap}
          displacementScale={0.15}
          opacity={1}
          transparent={false}
        />
      </mesh>
      <mesh
        visible
        rotation={[0, -Math.PI * 0.5, 0]}
        scale={3}
        position={[30, 0, 0]}
        castShadow={true}
      >
        <sphereGeometry args={[1, 100, 100]} />
      </mesh>
    </group>
  );
}

function Sun(props: any) {
  const colorMap = useLoader(TextureLoader, "/earth/sun.jpg");
  // useFrame((state, delta) => (sunParentRef.current.rotation.y += 0.001))\
  const sunMeshRef = useRef<any>();
  const globalSunRef = useRef<any>();
  const [lightRotation, setLightRotation] = useState<THREE.Euler>(
    new THREE.Euler(0, 0, 0)
  );
  const [darkRotation, setDarkRotation] = useState<THREE.Euler>(
    new THREE.Euler(0, Math.PI, 0)
  );

  const [startRotation, setStartRotation] = useState<THREE.Euler>(
    props.theme === "dark" ? darkRotation : lightRotation
  );
  const [desitnationRotation, setDesitnationRotation] =
    useState<THREE.Quaternion>(
      new THREE.Quaternion().setFromEuler(startRotation)
    );

  const zAxis = useMemo(() => new THREE.Vector3(0, 0, 1), []);

  useLayoutEffect(() => {
    sunMeshRef.current.layers.set(0);
  }, []);

  useEffect(() => {
    console.log("new scheme", props.theme);
    if (props.theme === "light") {
      setDesitnationRotation(
        new THREE.Quaternion().setFromEuler(lightRotation)
      );
    } else if (props.theme === "dark") {
      setDesitnationRotation(new THREE.Quaternion().setFromEuler(darkRotation));
    }
  }, [props.theme]);

  useFrame(() => {
    if (!globalSunRef.current.quaternion.equals(desitnationRotation)) {
      // console.log(globalSunRef.current.quaternion, newQat)
      globalSunRef.current.quaternion.slerp(desitnationRotation, 0.01);
    }
  });

  return (
    <group ref={globalSunRef} position={[0, 0, 0]} rotation={[0, 0, 0]}>
      <group ref={props.sunRef} position={[150, 0, 0]}>
        <mesh visible scale={5} ref={sunMeshRef}>
          <sphereGeometry args={[1, 200, 200]} />
          <meshLambertMaterial emissiveMap={colorMap} emissive={"white"} />
        </mesh>
        <pointLight
          color={"white"}
          intensity={3}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-darkness={2}
          shadow-bias={0.00001}
          shadow-cameraVisible={true}
          castShadow={true}
        ></pointLight>
      </group>
    </group>
  );
}

function Earth() {
  const skybox1 = useLoader(TextureLoader, "/earth/skybox3.jpg");
  const earthRef = useRef<Mesh>(null!);
  const sunRef = useRef<Mesh>(null!);
  const earthUI = useContext(UIEarthContext);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Canvas
      style={{
        position: "absolute",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
      gl={{
        antialias: true,
      }}
      shadows={true}
      camera={{ fov: 45, position: [30, 20, 0] }}
    >
      {/* https://github.com/pmndrs/react-three-fiber/issues/262 */}
      <UIEarthContext.Provider value={earthUI}>
        <OrbitControls maxDistance={100} enablePan={false} />
        <CameraWrapper />
        <ambientLight intensity={0.15} />

        <EarthBase earthRef={earthRef} sunRef={sunRef} />
        <EarthClouds />
        <Moon />
        <Sun sunRef={sunRef} theme={colorScheme} />

        {/* <CityLights /> */}

        <mesh>
          <sphereGeometry args={[200, 200, 200]} />
          <meshBasicMaterial map={skybox1} side={THREE.BackSide} />
        </mesh>
      </UIEarthContext.Provider>
    </Canvas>
  );
}

export default Earth;
