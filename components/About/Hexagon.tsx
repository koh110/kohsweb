import React from 'react'
import css from 'styled-jsx/css'

export const HexagonWrap: React.FC = (props) => {
  return (
    <div className="hexagon-wrap">
      <style jsx>{`
        .hexagon-wrap {
          margin-top: 1em;
          display: grid;
          grid-template-columns: repeat(auto-fill, calc(var(--hexagon-width)*2.5));
          grid-gap: 1px calc(var(--hexagon-width)/2 + 3px);
          grid-auto-flow: dense;
          padding: 0 0 var(--hexagon-width) calc(var(--hexagon-width)/2);
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
          grid-gap: 0 calc(var(--hexagon-width)/2 + 1px);
        }
        .hexagon-group-wrap > :global(*) {
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
    background-color: #00b2c4;
    color: var(--color-body);
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
    content: "";
    position: absolute;
    left: 0;
    transform: rotate(-60deg);
  }
  .hexagon::after {
    background-color: inherit;
    content: "";
    position: absolute;
    left: 0;
    transform: rotate(60deg);
  }
  .inner {
    position: absolute;
    top: 0;
    left: 50%;
    font-size: 0.7rem;
    transform: translate(-50%, calc(var(--hexagon-height)/2 - 50%));
    z-index: 100;
    max-width: calc(var(--hexagon-width) * 2)
  }
`

export const Hexagon: React.FC = (props) => {
  return (
    <div className="hexagon">
      <style jsx>{styles}</style>
      <div className="inner">{props.children}</div>
    </div>
  )
}
