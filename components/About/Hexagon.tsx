import React, { useEffect, useState } from 'react'
import css from 'styled-jsx/css'
import { useAnimation } from '../../lib/useAnimation'

export const HexagonWrap: React.FC = (props) => {
  return (
    <div className="hexagon-wrap">
      <style jsx>{`
        .hexagon-wrap {
          margin-top: 1em;
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            calc(var(--hexagon-width) * 2.5)
          );
          grid-gap: 1px calc(var(--hexagon-width) / 2 + 3px);
          grid-auto-flow: dense;
          padding: 0 0 var(--hexagon-width) calc(var(--hexagon-width) / 2);
        }
      `}</style>
      {props.children}
    </div>
  )
}

export const HexagonGroup: React.FC = (props) => {
  return (
    <div className="hexagon-group-wrap">
      <style jsx>{`
        .hexagon-group-wrap {
          display: grid;
          grid-template-columns: repeat(2, calc(var(--hexagon-width)));
          grid-gap: 0 calc(var(--hexagon-width) / 2 + 1px);
        }
        .hexagon-group-wrap > :global(*):nth-child(2n) {
          transform: translateY(50%);
        }
      `}</style>
      {props.children}
    </div>
  )
}

const styles = css`
  .hexagon {
    flex: 1;
    position: relative;
    display: inline-block;
    background-color: #6cb2d3;
    color: #ffffff;
    font-weight: 600;
  }
  .hexagon,
  .hexagon::before,
  .hexagon::after {
    width: var(--hexagon-width);
    height: var(--hexagon-height);
    border-radius: 12px/3px;
  }
  .hexagon::before {
    background-color: inherit;
    content: '';
    position: absolute;
    left: 0;
    transform: rotate(-60deg);
  }
  .hexagon::after {
    background-color: inherit;
    content: '';
    position: absolute;
    left: 0;
    transform: rotate(60deg);
  }
  .inner {
    position: absolute;
    top: 0;
    left: 50%;
    font-size: 0.7rem;
    transform: translate(-50%, calc(var(--hexagon-height) / 2 - 50%));
    z-index: 100;
    max-width: calc(var(--hexagon-width) * 2);
    transition: transform 0.3s;
  }
  .hexagon:hover .inner {
    transform: translate(-50%, calc(var(--hexagon-height) / 2 - 50%)) scale(1.2);
  }

  .blur-zoom-before {
    opacity: 0;
  }
  .blur-zoom,
  .blur-zoom-even {
    opacity: 1;
    animation-duration: 1s;
  }
  .blur-zoom {
    animation-name: blur-zoom;
  }
  .blur-zoom-even {
    animation-name: blur-zoom-even;
  }
  @keyframes blur-zoom {
    from {
      filter: blur(5px);
      transform: scale(0.3) rotateX(50deg);
    }
    to {
      filter: blur(0);
      transform: scale(1) rotateX(0);
    }
  }
  @keyframes blur-zoom-even {
    from {
      filter: blur(5px);
      transform: scale(0.3) rotateX(50deg) translateY(50%);
    }
    to {
      filter: blur(0);
      transform: scale(1) rotateX(0) translateY(50%);
    }
  }
`

export const Hexagon: React.FC<{ even: boolean }> = (props) => {
  const { intersectionRef, addClassnameFlag } = useAnimation()
  const [wrapClassname, setWrapClassname] = useState<string>('hexagon')

  useEffect(() => {
    if (addClassnameFlag) {
      setTimeout(() => {
        setWrapClassname(
          props.even ? 'hexagon blur-zoom-even' : 'hexagon blur-zoom'
        )
      }, window.crypto.getRandomValues(new Uint8Array(1))[0])
    } else {
      setWrapClassname('hexagon')
    }
  }, [addClassnameFlag])

  return (
    <div className={wrapClassname} ref={intersectionRef}>
      <style jsx>{styles}</style>
      <div className="inner">{props.children}</div>
    </div>
  )
}
