/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';

const Demo1 = () => <img src="/api/simple" alt="Glitch Art" />;

const Demo2 = () => {
  const urlSearchParams = new URLSearchParams({
    word: Date().toLocaleString(),
    width: '1024',
  });
  return <img src={`/api/simple?${urlSearchParams}`} alt="Glitch Art" />;
}

const Demo3 = () => {
  const urlSearchParams = new URLSearchParams({
    word: 'Passion',
    fontSize: '64',
    width: '380',
    height: '64',
    font: 'Sour Gummy',
    fontWeight: '500',
  });
  return <img src={`/api/simple?${urlSearchParams}`} alt="Passion" />;
}

const demos = [Demo1, Demo2, Demo3];

export default function Home() {
  const [idx, updateIdx] = React.useState(0);

  const Component: React.FC = demos[idx];

  const handleClick = () => {
    updateIdx((idx + 1) % demos.length);
  };

  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        height: '100vh',
      }}>
      <div onClick={handleClick}>
        <Component />
      </div>
    </div >
  )
}
