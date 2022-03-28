import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import css from 'styled-jsx/css'
import RssFeedIcon from '@mui/icons-material/RssFeed';
import TwitterIcon from '@mui/icons-material/Twitter'
import GitHubIcon from '@mui/icons-material/GitHub'
import FacebookIcon from '@mui/icons-material/Facebook'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

const styles = css`
  .icon-menu {
    --icon-length: 80px;
    --account-length: 40px;
    --icon-menu-length: calc(var(--icon-length) + var(--account-length) * 2);
    --margin-length: 0.5em;
    --translate-length: calc(var(--icon-menu-length) / 2 - var(--account-length) / 2);
    width: var(--icon-menu-length);
    height: var(--icon-menu-length);
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon {
    grid-area: icon;
    border-radius: 50%;
    width: var(--icon-length);
    height: var(--icon-length);
    overflow: hidden;
    justify-self: center;
  }
  .account-icon {
    position: absolute;
    width: var(--account-length);
    height: var(--account-length);
    border-radius: 50%;
    background-color: #6cb2d3;
    color: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0);
  }
  :global([data-theme='dark']) .account-icon {
    background-color: #b1c7d4;
    color: #1d4b69;
  }

  .account-icon:nth-of-type(1).move {
    z-index: 1000;
    animation: moveup 0.5s;
  }
  .account-icon:nth-of-type(2).move {
    z-index: 900;
    animation: moveup-2 1s;
    transform: rotate(calc(360deg / 5)) translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0) rotate(calc(-360deg / 5));
  }
  .account-icon:nth-of-type(3).move {
    z-index: 800;
    animation: moveup-3 1s;
    transform: rotate(calc(360deg / 5 * 2)) translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0) rotate(calc(-360deg / 5 * 2));
  }
  .account-icon:nth-of-type(4).move {
    z-index: 700;
    animation: moveup-4 1s;
    transform: rotate(calc(360deg / 5 * 3)) translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0) rotate(calc(-360deg / 5 * 3));
  }
  .account-icon:nth-of-type(5).move {
    z-index: 600;
    animation: moveup-5 1s;
    transform: rotate(calc(360deg / 5 * 4)) translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0) rotate(calc(-360deg / 5 * 4));
  }

  @keyframes moveup {
    from {
      transform: translate3d(0, 0, 0);
    }

    to {
      transform: translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0);
    }
  }
  
  @keyframes moveup-2 {
    0% {
      opacity: 0;
      transform: translate3d(0, 0, 0);
    }
  
    40%  {
      opacity: 0;
      transform: rotate(0) translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0) rotate(0) ;
    }

    100% {
      opacity: 1;
      transform: rotate(calc(360deg / 5)) translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0) rotate(calc(-360deg / 5));
    }
  }

  @keyframes moveup-3 {
    0% {
      opacity: 0;
      transform: translate3d(0, 0, 0);
    }

    40% {
      opacity: 0;
      transform: rotate(0) translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0) rotate(0);
    }

    100% {
      opacity: 1;
      transform: rotate(calc(360deg / 5 * 2)) translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0) rotate(calc(-360deg / 5 * 2));
    }
  }

  @keyframes moveup-4 {
    0% {
      opacity: 0;
      transform: translate3d(0, 0, 0);
    }

    40% {
      opacity: 0;
      transform: rotate(0) translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0) rotate(0);
    }

    100% {
      opacity: 1;
      transform: rotate(calc(360deg / 5 * 3)) translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0) rotate(calc(-360deg / 5 * 3));
    }
  }

  @keyframes moveup-5 {
    0% {
      opacity: 0;
      transform: translate3d(0, 0, 0);
    }

    40% {
      opacity: 0;
      transform: rotate(0) translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0) rotate(0);
    }

    100% {
      opacity: 1;
      transform: rotate(calc(360deg / 5 * 4)) translate3d(0, calc((var(--translate-length) + var(--margin-length)) * -1), 0) rotate(calc(-360deg / 5 * 4));
    }
  }
`

export const ProfileIcon: React.FC = () => {
  const [animationClass, setAnimationClass] = useState<string>('')

  useEffect(() => {
    setTimeout(() => {
      setAnimationClass('move')
    }, 10)
  }, [])
  
  return (
    <div className="icon-menu">
      <style jsx>{styles}</style>
      <div className="icon">
        <Image src="/icon.jpg" alt="account image" width={80} height={80} />
      </div>
      <a
        className={`account-icon ${animationClass}`}
        href="https://blog.koh.dev/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <RssFeedIcon fontSize="medium" />
      </a>
      <a
        className={`account-icon ${animationClass}`}
        href="https://twitter.com/koh110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <TwitterIcon fontSize="medium" />
      </a>
      <a
        className={`account-icon ${animationClass}`}
        href="https://github.com/koh110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon fontSize="medium" />
      </a>
      <a
        className={`account-icon ${animationClass}`}
        href="https://www.facebook.com/kohta110"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FacebookIcon fontSize="medium" />
      </a>
      <a
        className={`account-icon ${animationClass}`}
        href="https://jp.linkedin.com/in/ito-kohta-24078410b"
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkedInIcon fontSize="medium" />
      </a>
    </div>
  )
}
