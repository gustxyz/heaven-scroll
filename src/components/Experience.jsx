import {
  Float,
  PerspectiveCamera,
  useScroll,
  Image,
  Html,
  Sparkles,
  useTexture,
  Trail,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useLayoutEffect, useMemo, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Euler, Group, Vector3 } from "three";
import { fadeOnBeforeCompile } from "../utils/fadeMaterial";
// import { Airplane } from "./Airplane";
import { Background } from "./Background";
import { Cloud } from "./Cloud";
import { TextSection } from "./TextSection";
// import { Butterfly } from "./Butterfly";
import { Dog } from "./Dog";
import { AtpAgent } from "@atproto/api";

const LINE_NB_POINTS = 5000;
const CURVE_DISTANCE = 250;
const CURVE_AHEAD_CAMERA = 0.008;
const CURVE_AHEAD_AIRPLANE = 0.02;
const AIRPLANE_MAX_ANGLE = 35;
const FRICTION_DISTANCE = 42;

function isEven(n) {
  return n % 2 == 0;
}

function isOdd(n) {
  return Math.abs(n % 2) == 1;
}

export const Experience = () => {
  const agent = new AtpAgent({
    service: "https://bsky.social",
  });

  const [timeline, setTimeline] = useState(null);
  const [curvePointArray, setCurvepointArray] = useState(null);

  useEffect(() => {
    (async () => {
      const { successTL, dataTL } = await agent.login({
        identifier: "alexdaleciolong.bsky.social",
        password: "7pzh-2t35-4lva-24ic",
      });
      // console.log(success, data);

      // console.log(agent.api.app.bsky.feed.getTimeline());
      const { success, data } = await agent.api.app.bsky.feed.getTimeline();
      console.log("test");
      console.log(success, data.feed);
      console.log(data.feed[0].post.author.avatar);
      setTimeline(data.feed);
    })();
  }, []);
  useEffect(() => {
    const points = 50;

    const tempCurvePoints =
      timeline &&
      timeline.map((post, index) => {
        console.log(index);
        console.log(Math.floor(Math.random() * (3 - 1 + 1) + 1));
        console.log("should 1, 2, or 3");

        const randomNum3 = Math.floor(Math.random() * (3 - 1 + 1) + 1);
        let curveVariant = 0;

        if ((index = 0)) {
          curveVariant = 0;
        } else if (randomNum3 === 1) {
          curveVariant = 100;
        } else if (randomNum3 === 2) {
          curveVariant = -100;
        } else if (randomNum3 === 3) {
          curveVariant = 0;
        }

        return new THREE.Vector3(curveVariant, 0, -index * CURVE_DISTANCE);
      });
  }, [timeline]);
  const curvePoints = useMemo(
    () => [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
      new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -8 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -9 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -10 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -11 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -12 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -13 * CURVE_DISTANCE),
      new THREE.Vector3(-100, 0, -14 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -15 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -16 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -17 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -18 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -19 * CURVE_DISTANCE),
      new THREE.Vector3(-100, 0, -20 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -21 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -22 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -23 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -24 * CURVE_DISTANCE),
    ],
    []
  );

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(curvePoints, false, "catmullrom", 0.5);
  }, []);

  const textSections = useMemo(() => {
    if (timeline) {
      const textSections = curvePoints.map((curvePoint, index) => {
        if (curvePoints.length === index + 1) {
          return {
            cameraRailDist: -1,
            position: new Vector3(
              curvePoints[index].x - 3,
              curvePoints[index].y - 5,
              curvePoints[index].z - 9
            ),
            title: "Final Skeet, please refresh my g.",
            subtitle: ":)",
          };
        }
        console.table(timeline[index].post.author.image);
        return {
          cameraRailDist: -1,
          position: new Vector3(
            curvePoints[index + 1].x - 2,
            curvePoints[index + 1].y,
            curvePoints[index + 1].z - 9
          ),
          title: timeline && timeline[index].post.author.displayName,
          subtitle: timeline && timeline[index].post.record.text,
          image: timeline && timeline[index].post.author.avatar,
        };
      });

      return textSections;
    }

    return [
      {
        cameraRailDist: -1,
        position: new Vector3(
          curvePoints[1].x - 3,
          curvePoints[1].y,
          curvePoints[1].z
        ),
        title: timeline && timeline[0].post.author.displayName,
        subtitle: timeline && timeline[0].post.record.text,
        // image: timeline && timeline[0].post.record.image,
      },
      {
        cameraRailDist: 1.5,
        position: new Vector3(
          curvePoints[2].x + 2,
          curvePoints[2].y,
          curvePoints[2].z
        ),
        title: timeline && timeline[1].post.author.displayName,
        subtitle: timeline && timeline[1].post.record.text,
      },
      {
        cameraRailDist: -1,
        position: new Vector3(
          curvePoints[3].x - 3,
          curvePoints[3].y,
          curvePoints[3].z
        ),
        title: timeline && timeline[2].post.author.displayName,
        subtitle: timeline && timeline[2].post.record.text,
      },
      {
        cameraRailDist: 1.5,
        position: new Vector3(
          curvePoints[4].x + 3.5,
          curvePoints[4].y,
          curvePoints[4].z - 12
        ),
        title: timeline && timeline[3].post.author.displayName,
        subtitle: timeline && timeline[3].post.record.text,
      },
    ];
  }, [curvePoints, timeline]);

  const clouds = useMemo(
    () => [
      // STARTING
      {
        position: new Vector3(-3.5, -3.2, -7),
      },
      {
        position: new Vector3(3.5, -4, -10),
      },
      {
        scale: new Vector3(4, 4, 4),
        position: new Vector3(-18, 0.2, -68),
        rotation: new Euler(-Math.PI / 5, Math.PI / 6, 0),
      },
      {
        scale: new Vector3(2.5, 2.5, 2.5),
        position: new Vector3(10, -1.2, -52),
      },
      // FIRST POINT
      {
        scale: new Vector3(4, 4, 4),
        position: new Vector3(
          curvePoints[1].x + 10,
          curvePoints[1].y - 4,
          curvePoints[1].z + 64
        ),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[1].x - 20,
          curvePoints[1].y + 4,
          curvePoints[1].z + 28
        ),
        rotation: new Euler(0, Math.PI / 7, 0),
      },
      {
        rotation: new Euler(0, Math.PI / 7, Math.PI / 5),
        scale: new Vector3(5, 5, 5),
        position: new Vector3(
          curvePoints[1].x - 13,
          curvePoints[1].y + 4,
          curvePoints[1].z - 62
        ),
      },
      {
        rotation: new Euler(Math.PI / 2, Math.PI / 2, Math.PI / 3),
        scale: new Vector3(5, 5, 5),
        position: new Vector3(
          curvePoints[1].x + 54,
          curvePoints[1].y + 2,
          curvePoints[1].z - 82
        ),
      },
      {
        scale: new Vector3(5, 5, 5),
        position: new Vector3(
          curvePoints[1].x + 8,
          curvePoints[1].y - 14,
          curvePoints[1].z - 22
        ),
      },
      // SECOND POINT
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[2].x + 6,
          curvePoints[2].y - 7,
          curvePoints[2].z + 50
        ),
      },
      {
        scale: new Vector3(2, 2, 2),
        position: new Vector3(
          curvePoints[2].x - 2,
          curvePoints[2].y + 4,
          curvePoints[2].z - 26
        ),
      },
      {
        scale: new Vector3(4, 4, 4),
        position: new Vector3(
          curvePoints[2].x + 12,
          curvePoints[2].y + 1,
          curvePoints[2].z - 86
        ),
        rotation: new Euler(Math.PI / 4, 0, Math.PI / 3),
      },
      // THIRD POINT
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[3].x + 3,
          curvePoints[3].y - 10,
          curvePoints[3].z + 50
        ),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[3].x - 10,
          curvePoints[3].y,
          curvePoints[3].z + 30
        ),
        rotation: new Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new Vector3(4, 4, 4),
        position: new Vector3(
          curvePoints[3].x - 20,
          curvePoints[3].y - 5,
          curvePoints[3].z - 8
        ),
        rotation: new Euler(Math.PI, 0, Math.PI / 5),
      },
      {
        scale: new Vector3(5, 5, 5),
        position: new Vector3(
          curvePoints[3].x + 0,
          curvePoints[3].y - 5,
          curvePoints[3].z - 98
        ),
        rotation: new Euler(0, Math.PI / 3, 0),
      },
      // FOURTH POINT
      {
        scale: new Vector3(2, 2, 2),
        position: new Vector3(
          curvePoints[4].x + 3,
          curvePoints[4].y - 10,
          curvePoints[4].z + 2
        ),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[4].x + 24,
          curvePoints[4].y - 6,
          curvePoints[4].z - 42
        ),
        rotation: new Euler(Math.PI / 4, 0, Math.PI / 5),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[4].x - 4,
          curvePoints[4].y + 9,
          curvePoints[4].z - 62
        ),
        rotation: new Euler(Math.PI / 3, 0, Math.PI / 3),
      },
      // FINAL
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[7].x + 12,
          curvePoints[7].y - 5,
          curvePoints[7].z + 60
        ),
        rotation: new Euler(-Math.PI / 4, -Math.PI / 6, 0),
      },
      {
        scale: new Vector3(3, 3, 3),
        position: new Vector3(
          curvePoints[7].x - 12,
          curvePoints[7].y + 5,
          curvePoints[7].z + 120
        ),
        rotation: new Euler(Math.PI / 4, Math.PI / 6, 0),
      },
      {
        scale: new Vector3(4, 4, 4),
        position: new Vector3(
          curvePoints[7].x,
          curvePoints[7].y,
          curvePoints[7].z
        ),
        rotation: new Euler(0, 0, 0),
      },
    ],
    []
  );
  const particlerSizes = useMemo(() => {
    return new Float32Array(
      Array.from({ length: 50 }, () => Math.random() * 5)
    );
  }, []);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);

    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const cameraRail = useRef();
  const scroll = useScroll();
  const lastScroll = useRef(0);

  useFrame((_state, delta) => {
    const scrollOffset = Math.max(0, scroll.offset);

    let friction = 1;
    let resetCameraRail = true;
    // LOOK TO CLOSE TEXT SECTIONS
    textSections.forEach((textSection) => {
      const distance = textSection.position.distanceTo(
        cameraGroup.current.position
      );

      if (distance < FRICTION_DISTANCE) {
        friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
        const targetCameraRailPosition = new Vector3(
          (1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist,
          0,
          0
        );
        cameraRail.current.position.lerp(targetCameraRailPosition, delta);
        resetCameraRail = false;
      }
    });
    if (resetCameraRail) {
      const targetCameraRailPosition = new Vector3(0, 0, 0);
      cameraRail.current.position.lerp(targetCameraRailPosition, delta);
    }

    // CALCULATE LERPED SCROLL OFFSET
    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scrollOffset,
      delta * friction
    );
    // PROTECT BELOW 0 AND ABOVE 1
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1);
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0);

    lastScroll.current = lerpedScrollOffset;
    tl.current.seek(lerpedScrollOffset * tl.current.duration());

    const curPoint = curve.getPoint(lerpedScrollOffset);

    // Follow the curve points
    cameraGroup.current.position.lerp(curPoint, delta * 24);

    // Make the group look ahead on the curve

    const lookAtPoint = curve.getPoint(
      Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
    );

    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    );
    const targetLookAt = new THREE.Vector3()
      .subVectors(curPoint, lookAtPoint)
      .normalize();

    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    );

    // Airplane rotation

    const tangent = curve.getTangent(lerpedScrollOffset + CURVE_AHEAD_AIRPLANE);

    const nonLerpLookAt = new Group();
    nonLerpLookAt.position.copy(curPoint);
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt));

    tangent.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -nonLerpLookAt.rotation.y
    );

    let angle = Math.atan2(-tangent.z, tangent.x);
    angle = -Math.PI / 2 + angle;

    let angleDegrees = (angle * 180) / Math.PI;
    angleDegrees *= 2.4; // stronger angle

    // LIMIT PLANE ANGLE
    if (angleDegrees < 0) {
      angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
    }
    if (angleDegrees > 0) {
      angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);
    }

    // SET BACK ANGLE
    angle = (angleDegrees * Math.PI) / 180;

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angle
      )
    );
    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2);
  });

  const airplane = useRef();

  const tl = useRef();
  const backgroundColors = useRef({
    colorA: "#0BA8E6",
    colorB: "white",
  });

  useLayoutEffect(() => {
    tl.current = gsap.timeline();

    // tl.current.to(backgroundColors.current, {
    //   duration: 1,
    //   colorA: "#6f35cc",
    //   colorB: "#ffad30",
    // });

    tl.current.pause();
  }, []);

  return (
    <>
      <directionalLight position={[0, 3, 1]} intensity={0.1} />
      {/* <OrbitControls /> */}
      <Html>
        <img src="https://cdn.bsky.social/imgproxy/fgnct5r39k5FRegmTU35eX7jDNplCj2ogI9CWkenfA4/rs:fill:1000:1000:1:0/plain/bafkreiedsuuw4pzwzmsslfshxb7ac7o325ub65p3pfj2xpvrfj4vapcv7u@jpeg"></img>
      </Html>

      <group ref={cameraGroup}>
        <Background backgroundColors={backgroundColors} />
        <group ref={cameraRail}>
          <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault />
        </group>
        <group ref={airplane}>
          <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
            {/* <Butterfly scale={[0.01, 0.01, 0.01]} position-y={-1} /> */}
            <Dog scale={[0.5, 0.5, 0.5]} position-y={-0.7} />
            <Sparkles
              position-y={-1}
              size={particlerSizes}
              color="yellow"
              count={50}
            />
            {/* <Trail width={1} length={4} color={"#F8D628"} /> */}
          </Float>
        </group>
      </group>
      {/* {timeline && (
        <Image url={timeline[0].post.author.avatar} transparent opacity={0.5} />
      )} */}
      {/* TEXT */}

      {textSections.map((textSection, index) => (
        <>
          <TextSection {...textSection} key={index} />
        </>
      ))}

      {/* LINE */}
      <group position-y={-2}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial
            color={"white"}
            opacity={1}
            transparent
            envMapIntensity={2}
            onBeforeCompile={fadeOnBeforeCompile}
          />
        </mesh>
      </group>

      {/* <Float floatIntensity={0.5} speed={0.3} rotationIntensity={0.5}> */}
      {/* CLOUDS */}
      <Float rotationIntensity={0.09}>
        {clouds.map((cloud, index) => (
          <Cloud {...cloud} opacity={0.5} key={index} />
        ))}
      </Float>
      {/* </Float> */}
    </>
  );
};
