import {
  Text,
  Text3D,
  Image,
  useTexture,
  Html,
  ScrollControls,
} from "@react-three/drei";
import { fadeOnBeforeCompileFlat } from "../utils/fadeMaterial";
import * as THREE from "three";

export const TextSection = ({
  title,
  subtitle,
  direction,
  image,
  ...props
}) => {
  // const texture = useTexture(
  //   "https://cdn.bsky.social/imgproxy/fgnct5r39k5FRegmTU35eX7jDNplCj2ogI9CWkenfA4/rs:fill:1000:1000:1:0/plain/bafkreiedsuuw4pzwzmsslfshxb7ac7o325ub65p3pfj2xpvrfj4vapcv7u@jpeg"
  // );
  const loader = new THREE.TextureLoader();
  // loader.crossOrigin = "";
  loader.setCrossOrigin("anonymous");
  const mapOverlay = loader.load(
    "https://cdn.bsky.social/imgproxy/fgnct5r39k5FRegmTU35eX7jDNplCj2ogI9CWkenfA4/rs:fill:1000:1000:1:0/plain/bafkreiedsuuw4pzwzmsslfshxb7ac7o325ub65p3pfj2xpvrfj4vapcv7u@jpeg"
  );
  console.log(mapOverlay);
  console.log(props.position);
  return (
    <>
      {" "}
      <group {...props}>
        {/* <Image
          // width="400"
          position-x={0.5}
          position-y={1}
          texture={mapOverlay}
        /> */}
        {/* <Html
          // position-y={props.position.y}
          transform
          // occlude="blending"
          wrapperClass="htmlScreen"
          // distanceFactor={1.17}
          // position={[0, 1.56, -1.4]}
          // // rotation-x={-0.256}
          style={{
            // marginTop: "auto",
            // height: "50px",
            // width: "50px",

            // height: "100vh",
            // width: "50px",
            backgroundImage: `url("https://cdn.bsky.social/imgproxy/fgnct5r39k5FRegmTU35eX7jDNplCj2ogI9CWkenfA4/rs:fill:1000:1000:1:0/plain/bafkreiedsuuw4pzwzmsslfshxb7ac7o325ub65p3pfj2xpvrfj4vapcv7u@jpeg")`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            // position: "fixed",
            // position: "fixed",
          }}
        >
          {/* <div style={{ marginTop: "auto" }}>TESTING</div> */}
        {/* <iframe src="https://resume-site-2d.vercel.app" /> */}
        {/* <img src="https://cdn.bsky.social/imgproxy/fgnct5r39k5FRegmTU35eX7jDNplCj2ogI9CWkenfA4/rs:fill:1000:1000:1:0/plain/bafkreiedsuuw4pzwzmsslfshxb7ac7o325ub65p3pfj2xpvrfj4vapcv7u@jpeg" /> */}
        {/* </Html> */}
        {!!title && (
          <Text
            color="black"
            anchorX={"left"}
            anchorY="bottom"
            fontSize={0.52}
            maxWidth={5}
            lineHeight={1}
            font={"./fonts/bangers-v20-latin-regular.woff"}
          >
            {title}
            <meshStandardMaterial
              color={"white"}
              onBeforeCompile={fadeOnBeforeCompileFlat}
            />
          </Text>
        )}

        <Text
          color="black"
          anchorX={"left"}
          anchorY="top"
          fontSize={0.2}
          maxWidth={2.5}
          font={"./fonts/Inter-Regular.ttf"}
        >
          {subtitle}
          <meshStandardMaterial
            color={"white"}
            onBeforeCompile={fadeOnBeforeCompileFlat}
          />
        </Text>
      </group>
    </>
  );
};
