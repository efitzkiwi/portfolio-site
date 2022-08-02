import * as THREE from "three";
import { createRoot } from "react-dom/client";
import React, {
  Suspense,
  useRef,
  useState,
  Ref,
  useMemo,
  useLayoutEffect,
} from "react";
import {
  Canvas,
  useFrame,
  ThreeElements,
  useLoader,
  useThree,
} from "@react-three/fiber";
import {
  Camera,
  Color,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  Object3D,
  SphereGeometry,
  sRGBEncoding,
  TextureLoader,
} from "three";
import Image from "next/image";
import {
  OrbitControls,
  Stats,
  Html,
  Points,
  PointMaterial,
  ArcballControls,
  Float,
} from "@react-three/drei";
import { GUI } from "dat.gui";
import { HtmlProps } from "@react-three/drei/web/Html";
import { FaMapMarkerAlt } from "react-icons/fa";
import styles from "../styles/earth.module.scss";
import { inSphere } from "maath/random";
import CustomShaderMaterial from "three-custom-shader-material";
import { useContext } from "react";
import { UIEarthContext } from "@/context/ui-earth-context";
import { UIEarthContextProvider } from "@/context/ui-earth-context-provider";

// https://codesandbox.io/s/priceless-bohr-xlum2?file=/src/models/Earth.js:158-165

interface IMarker extends HtmlProps {
  occludeRef?: Ref<Object3D>[];
}

// Let's make the marker into a component so that we can abstract some shared logic
function Marker(props: IMarker) {
  // This holds the local occluded state
  const [occluded, occlude] = useState<boolean>();
  const earthContext = useContext(UIEarthContext)
  // const {camera} = useThree()

  const toggleLander = () => {
    console.log("Lander clicked")
    earthContext.callbackFuncs.toggleLander()
  }

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
      <div onClick={toggleLander} className={styles.pulsatingcircle} />
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

interface XYZ {
  x: number;
  y: number;
  z: number;
}

const getMarkerPositionFromCoordinates = (lat: number, long: number): XYZ => {
  const earthRadius = 1;

  var phi = (90 - lat) * (Math.PI / 180);
  var theta = (long + 180) * (Math.PI / 180);

  const x = -(earthRadius * Math.sin(phi) * Math.cos(theta));
  const z = earthRadius * Math.sin(phi) * Math.sin(theta);
  const y = earthRadius * Math.cos(phi);
  return {
    x,
    y,
    z,
  };
};

function degrees_to_radians(degrees: number) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

function calcPosFromLatLonRad(radius: number, lat: number, lon: number) {
  var spherical = new THREE.Spherical(
    radius,
    degrees_to_radians(90 - lon),
    degrees_to_radians(lat) + Math.PI * 0.5
  );

  var vector = new THREE.Vector3();
  vector.setFromSpherical(spherical);

  return vector;
}

const CameraWrapper = () => {
  const { camera } = useThree();
  var fullWidth = window.innerWidth;
  var fullHeight = window.innerHeight;
  var xPixels = -600;
  var yPixels = 200;

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

function EarthBase(props: any) {
  const displacementMap = useLoader(
    TextureLoader,
    "/earth/displacement_alt.png"
  );
  const colorMap = useLoader(TextureLoader, "/earth/color2.jpg");
  const nightMap = useLoader(TextureLoader, "/earth/night2.jpg");
  // const nightMap = useLoader(TextureLoader, "/earth/test.png");
  const specMap = useLoader(TextureLoader, "/earth/earth_spec.png");
  const earthRef = props.earthRef;
  const washingtonDCCartesianCoords = useMemo(() => {
    return calcPosFromLatLonRad(10, -77.0369, 38.9072);
  }, []);
  const occludeRef = useRef<any>(null!);
  const groupRef = useRef<any>();
  const mat = useRef<any>();
  // const arrowHelperRef = useRef<any>();


  useFrame((state, delta) => {
    groupRef.current.rotation.y += 0.0005;
    if (mat?.current?.uniforms && groupRef.current && props.sunRef.current.position) {

      // get the relative position of the sun
      var v = new THREE.Vector3();
      v.copy(props.sunRef.current?.position);
      props.sunRef.current?.localToWorld(v);
      groupRef.current?.worldToLocal(v);
      // arrowHelperRef.current.setDirection(v)
      mat.current.uniforms.uLight.value = v
    

    }
  });
  const uniforms = useMemo(
    () => ({
      uDay: { value: colorMap },
      uNight: { value: nightMap },
      uLight: { value: new THREE.Vector3(1, 0, 0) },
    }),
    []
  );
  return (
    <group ref={groupRef} rotation={[0, Math.PI, 0]}>
      {/* <arrowHelper ref={arrowHelperRef} args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 15, 'orange']} /> */}
      <mesh visible scale={10} ref={earthRef} receiveShadow={true} onClick={() => console.log("Earth clicked")} >
        <sphereGeometry args={[1, 400, 400]} />

        <CustomShaderMaterial
          ref={mat}
          baseMaterial={MeshPhongMaterial}
          vertexShader={`
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
          `}
          fragmentShader={`
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
          `}
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

      <mesh visible scale={10} ref={occludeRef} castShadow={true}>
        <sphereGeometry args={[1, 50, 50]} />
      </mesh>

      <group position={washingtonDCCartesianCoords}>
        <Marker occludeRef={[occludeRef]}/>
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
            <img src="/me.png" />
          </div>
        </MarkerText>
      </group>
    </group>
  );
}

function EarthClouds() {
  const clouds = useLoader(TextureLoader, "/earth/clouds.png");
  const cloudsRef = useRef<Mesh>(null!);
  useFrame((state, delta) => (cloudsRef.current.rotation.y += 0.00075));
  return (
    <mesh
      visible
      rotation={[0, -Math.PI * 0.5, 0]}
      scale={10.5}
      ref={cloudsRef}
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

function Moon() {
  const displacementMap = useLoader(TextureLoader, "/earth/moon_dis.png");
  const colorMap = useLoader(TextureLoader, "/earth/moon.png");
  const moonParentRef = useRef<any>(null!);
  useFrame((state, delta) => (moonParentRef.current.rotation.y += 0.001));
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
  useLayoutEffect(() => {
    sunMeshRef.current.layers.set(0);
  }, []);
  return (
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
      />
    </group>
  );
}


function Earth() {
  const skybox1 = useLoader(TextureLoader, "/earth/skybox3.jpg");
  const earthRef = useRef<Mesh>(null!);
  const sunRef = useRef<Mesh>(null!);
  const earthUI = useContext(UIEarthContext)
  console.log(earthUI)
  return (
    // <Image src={"/earth/color.png"} alt="me" width="64" height="64"></Image>
    <Canvas
      style={{
        position: "absolute",
        height: "100vh",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
      gl={{ antialias: true, pixelRatio: window.devicePixelRatio, outputEncoding: sRGBEncoding }}
      shadows={true}
      camera={{ fov: 45, position: [-70, 0, -20] }}
    >
      {/* https://github.com/pmndrs/react-three-fiber/issues/262 */}
      <UIEarthContext.Provider value={earthUI}>
        <OrbitControls maxDistance={100} />
        <CameraWrapper />
        <ambientLight intensity={0.15} />

        <EarthBase earthRef={earthRef} sunRef={sunRef} />
        <EarthClouds />
        <Moon />
        <Sun sunRef={sunRef} />
      
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
