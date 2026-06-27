import paths from './korea-map-paths.json';

// Crop west padding and Ulleungdo's east extension for right-aligned mainland focus.
const MAP_VIEWBOX = '72 0 408 630.5871';

const MAP_PULSE_NODES = [
  // 수도권
  {x: 126, y: 132, r: 4.8, delay: 0},
  {x: 108, y: 126, r: 3.2, delay: 0.7},
  {x: 148, y: 148, r: 3.8, delay: 1.3},
  {x: 162, y: 118, r: 3, delay: 0.4},
  {x: 118, y: 152, r: 2.6, delay: 1.8},
  {x: 142, y: 168, r: 4.2, delay: 2.2},
  {x: 156, y: 138, r: 2.4, delay: 1.1},
  {x: 134, y: 112, r: 3.5, delay: 2.6},
  {x: 112, y: 142, r: 2.2, delay: 0.9},
  {x: 172, y: 156, r: 2.8, delay: 1.6},
  {x: 138, y: 178, r: 2.5, delay: 2.9},
  // 강원
  {x: 198, y: 48, r: 2.6, delay: 0.35},
  {x: 248, y: 72, r: 2.4, delay: 1.45},
  // 충청
  {x: 188, y: 246, r: 3.6, delay: 0.55},
  {x: 168, y: 262, r: 2.8, delay: 1.95},
  {x: 132, y: 284, r: 2.4, delay: 2.35},
  {x: 108, y: 302, r: 2.2, delay: 0.85},
  // 호남
  {x: 156, y: 348, r: 2.8, delay: 1.25},
  // 영남
  {x: 286, y: 334, r: 3.8, delay: 0.25},
  {x: 272, y: 368, r: 2.4, delay: 2.45},
];

export default function HeroKoreaMap() {
  return (
    <div className="hero__map" aria-hidden="true">
      <svg
        className="hero__map-svg"
        viewBox={MAP_VIEWBOX}
        preserveAspectRatio="xMaxYMid meet"
      >
        <defs>
          <filter id="hero-map-gap" filterUnits="userSpaceOnUse">
            <feMorphology operator="erode" radius="1.25" />
          </filter>
        </defs>
        {paths.map((d, index) => (
          <path
            key={index}
            d={d}
            className={`hero__map-region hero__map-region--${index % 3}`}
            filter="url(#hero-map-gap)"
          />
        ))}
        <g className="hero__map-pulses" transform="translate(10 0)">
          {MAP_PULSE_NODES.map((node, index) => (
            <g key={index} transform={`translate(${node.x} ${node.y})`}>
              <g
                className="hero__map-node"
                style={{animationDelay: `${node.delay}s`}}
              >
                <circle className="hero__map-pulse-ring" r={node.r * 2.4} />
                <circle className="hero__map-pulse-core" r={node.r} />
              </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
