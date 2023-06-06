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
  const loader = new THREE.TextureLoader();

  return (
    <>
      {" "}
      <group {...props}>
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
