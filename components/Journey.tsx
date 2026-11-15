'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { chapters, contact, environments, points, txt, type Chapter } from '@/lib/content';
import { createTrailDog } from '@/lib/trailDog';

const LAST = chapters.length - 1;
// Reserve a small scroll interval at either desk for getting up and sitting down.
const DESK_INTERVAL = .03;

function Details({ c, sv }: { c: Chapter; sv: boolean }) {
  return (
    <>
      <p className="role">{txt(c, 'role', sv)}</p>
      <ul className="details">{points(c, sv).map(p => <li key={p}>{p}</li>)}</ul>
      <div className="tech">{(c.tech ?? []).map(t => <span key={t}>{t}</span>)}</div>
    </>
  );
}

function Contacts() {
  if (!contact.email && !contact.linkedin) return null;
  return (
    <div className="intro-actions">
      {contact.email && <a href={`mailto:${contact.email}`}>Email</a>}
      {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
    </div>
  );
}

export default function Journey() {
  const [sv, setSv] = useState(false);
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);

  const journeyRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const landscapeA = useRef<HTMLDivElement>(null);
  const landscapeB = useRef<HTMLDivElement>(null);
  const startStationRef = useRef<HTMLDivElement>(null);
  const endStationRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLDivElement>(null);

  const extent = useCallback(
    () => journeyRef.current!.offsetHeight - stageRef.current!.offsetHeight,
    [],
  );

  const go = useCallback((i: number) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const at = i === 0 ? 0 : i === LAST ? 1 : DESK_INTERVAL + (1 - 2 * DESK_INTERVAL) * i / LAST;
    window.scrollTo({ top: extent() * at, behavior: reduced ? 'instant' : 'smooth' });
  }, [extent]);

  useEffect(() => {
    document.documentElement.lang = sv ? 'sv' : 'en';
  }, [sv]);

  // Scroll-driven animation engine: runs outside React render for smooth, per-frame updates.
  useEffect(() => {
    const stage = stageRef.current!, track = trackRef.current!, sprite = spriteRef.current!;
    const landscapes = [landscapeA.current!, landscapeB.current!];
    const startStation = startStationRef.current!, endStation = endStationRef.current!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    let progress = 0, rawProgress = 0, scheduled = false, frame = 0;
    let lastPosition = window.scrollY, walkDistance = 0;
    let stopTimer: ReturnType<typeof setTimeout> | undefined;
    let deskReady = false;
    const images: HTMLImageElement[] = [];

    const readyImages = new Set([environments[0].file]);
    for (const file of new Set(environments.map(e => e.file))) {
      const img = new Image();
      img.onload = () => { readyImages.add(file); update(); };
      img.src = `/assets/${file}`;
      images.push(img);
    }
    const deskImage = new Image();
    deskImage.onload = () => { deskReady = true; update(); };
    deskImage.src = '/assets/desk-sequence-clean.png';
    images.push(deskImage);

    const trailDog = createTrailDog({ element: dogRef.current!, walker: walkerRef.current!, reduced });

    function paintEnvironment(layer: HTMLElement, environment: typeof environments[number], opacity: number) {
      if (!readyImages.has(environment.file)) {
        if (opacity === 1) environment = environments[0];
        else { layer.style.opacity = '0'; return; }
      }
      const url = `url("/assets/${environment.file}")`;
      if (layer.style.backgroundImage !== url) layer.style.backgroundImage = url;
      // Every city shares one visible image height and one ground plane.
      // End the artwork at the footer instead of cropping pavement below it.
      const height = Math.max(1, stage.offsetHeight - 100);
      const width = Math.max(window.innerWidth, height * 1942 / 809);
      layer.style.backgroundSize = `${width}px ${height}px`;
      layer.style.backgroundPosition = `${environment.position}% bottom`;
      layer.style.opacity = String(opacity);
    }

    function updateEnvironment() {
      const position = progress * LAST;
      const from = Math.min(LAST, Math.floor(position));
      const to = Math.min(LAST, from + 1);
      const fraction = position - from;
      if (environments[from].file === environments[to].file) {
        const pan = reduced.matches ? (fraction >= .5 ? 1 : 0) : fraction;
        paintEnvironment(landscapes[0], {
          ...environments[from],
          position: environments[from].position + (environments[to].position - environments[from].position) * pan,
        }, 1);
        landscapes[1].style.opacity = '0';
        return;
      }
      // Crossfade while the next experience moves into view, preserving full opacity below it.
      const blend = reduced.matches ? (fraction >= .5 ? 1 : 0) : Math.max(0, Math.min(1, (fraction - .2) / .6));
      paintEnvironment(landscapes[0], environments[from], 1);
      paintEnvironment(landscapes[1], environments[to], blend);
    }

    function deskFrame(distance: number) {
      if (reduced.matches) return distance < DESK_INTERVAL ? 0 : 3;
      if (distance < .006) return 0;
      if (distance < .018) return 1;
      if (distance < DESK_INTERVAL) return 2;
      return 3;
    }

    function updateActor() {
      const atDesk = deskReady && (rawProgress < DESK_INTERVAL || rawProgress > 1 - DESK_INTERVAL);
      sprite.style.visibility = atDesk ? 'hidden' : 'visible';
      startStation.style.visibility = deskReady ? 'visible' : 'hidden';
      endStation.style.visibility = deskReady ? 'visible' : 'hidden';
      startStation.style.backgroundPosition = `${deskFrame(rawProgress) * 100 / 3}% 0`;
      endStation.style.backgroundPosition = `${deskFrame(1 - rawProgress) * 100 / 3}% 0`;
      startStation.style.transform = `translate3d(${-progress * LAST * window.innerWidth}px,0,0)`;
      endStation.style.transform = `translate3d(${(1 - progress) * LAST * window.innerWidth}px,0,0)`;
    }

    function update() {
      scheduled = false;
      // Layout may not be measurable yet (e.g. styles still loading), so avoid 0/0.
      const scrollable = extent();
      rawProgress = scrollable > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollable)) : 0;
      progress = Math.max(0, Math.min(1, (rawProgress - DESK_INTERVAL) / (1 - 2 * DESK_INTERVAL)));
      const next = Math.min(LAST, Math.round(progress * LAST));
      currentRef.current = next;
      setCurrent(next);
      track.style.transform = `translate3d(${-progress * LAST * window.innerWidth}px,0,0)`;
      updateEnvironment();
      updateActor();
      trailDog.update(next >= 3 && next <= 5);
    }

    function onScroll() {
      const delta = window.scrollY - lastPosition;
      lastPosition = window.scrollY;
      trailDog.scroll(delta);
      if (!reduced.matches && window.scrollY <= extent()) {
        walkDistance += Math.abs(delta);
        sprite.style.backgroundPosition = `${Math.floor(walkDistance / 24) % 4 * 100 / 3}% 0`;
        sprite.style.transform = `scaleX(${delta < 0 ? -1 : 1})`;
        clearTimeout(stopTimer);
        stopTimer = setTimeout(() => { sprite.style.backgroundPosition = '0 0'; }, 130);
      }
      if (!scheduled) { scheduled = true; frame = requestAnimationFrame(update); }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (window.scrollY > extent() || (e.target as Element).matches?.('button,a,input,textarea')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(Math.min(LAST, currentRef.current + 1)); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(Math.max(0, currentRef.current - 1)); }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    document.addEventListener('keydown', onKeyDown);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
      document.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(frame);
      clearTimeout(stopTimer);
      for (const img of images) img.onload = null;
      trailDog.destroy();
    };
  }, [extent, go]);

  return (
    <>
      <a className="skip" href="#story">{sv ? 'Hoppa till erfarenheter' : 'Skip to experience'}</a>
      <div id="journey" ref={journeyRef}>
        <main id="stage" ref={stageRef}>
          <div className="landscapes" aria-hidden="true">
            <div className="landscape" ref={landscapeA} />
            <div className="landscape" ref={landscapeB} />
          </div>
          <div className="shade" aria-hidden="true" />
          <header>
            <a className="brand" href="#" aria-label="Back to introduction" onClick={e => { e.preventDefault(); go(0); }}>
              EG<span>EMMANUEL GOMEZ</span>
            </a>
            <div className="header-right">
              <a className="linkedin-button" href="https://www.linkedin.com/in/emm-gomez" target="_blank" rel="noopener noreferrer">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <button id="language" aria-label={sv ? 'Switch to English' : 'Byt till svenska'} onClick={() => setSv(v => !v)}>
                {sv ? 'SV' : 'EN'} <span>/ {sv ? 'EN' : 'SV'}</span>
              </button>
            </div>
          </header>

          <div id="track" ref={trackRef}>
            {chapters.map((c, i) => {
              const hidden = i !== current;
              if (i === 0) {
                return (
                  <article key={i} className="scene intro" aria-label={sv ? 'Introduktion' : 'Introduction'} inert={hidden} aria-hidden={hidden}>
                    <div className="scene-content">
                      <div className="eyebrow">{sv ? 'FRÅN VÄSTERÅS. ALLTID FRAMÅT.' : 'BASED IN VÄSTERÅS. ALWAYS MOVING FORWARD.'}</div>
                      <h1>Emmanuel<br />Gomez<span style={{ color: 'var(--gold)' }}>.</span></h1>
                      <p className="lead">
                        {sv ? 'Frontendutvecklare & UX-designer.' : 'Frontend developer & UX designer.'}<br />
                        {sv ? 'Det här är min resa — en erfarenhet i taget.' : 'This is my journey — one chapter at a time.'}
                      </p>
                      <div className="intro-actions">
                        <button className="start" onClick={() => go(1)}>{sv ? 'BÖRJA RESAN →' : 'START THE JOURNEY →'}</button>
                        <a className="text-link" href="#story">{sv ? 'Läs mina erfarenheter' : 'Read my experience'}</a>
                      </div>
                    </div>
                  </article>
                );
              }
              return (
                <article key={i} className="scene experience" aria-label={txt(c, 'title', sv)} inert={hidden} aria-hidden={hidden}>
                  <span className="chapter" aria-hidden="true">0{i}</span>
                  <div className="scene-content">
                    <div className="eyebrow">{`${sv ? 'KAPITEL' : 'CHAPTER'} 0${i}   /   ${txt(c, 'date', sv)}`}</div>
                    <h2>{txt(c, 'title', sv)}</h2>
                    <Details c={c} sv={sv} />
                    {i === LAST && <Contacts />}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="workstation workstation-start" aria-hidden="true" ref={startStationRef} />
          <div className="workstation workstation-end" aria-hidden="true" ref={endStationRef} />
          <div className="trail-dog" aria-hidden="true" ref={dogRef}>
            <div className="dog-sprite" />
          </div>
          <div className="walker" aria-hidden="true" ref={walkerRef}>
            <div className="sprite" ref={spriteRef} /><span>EMMANUEL</span>
          </div>
          <div className="ground" aria-hidden="true" />

          <footer>
            <div className="footer-top">
              <span id="location">{txt(chapters[current], 'place', sv)}</span>
              <span id="hint">{sv ? 'SCROLLA FÖR ATT UTFORSKA ↓' : 'SCROLL TO EXPLORE ↓'}</span>
              <span id="count">{`0${current + 1} / 0${chapters.length}`}</span>
            </div>
            <nav id="timeline" aria-label="Career chapters">
              {chapters.map((c, i) => (
                <button
                  key={i}
                  className={i === current ? 'active' : undefined}
                  aria-current={i === current ? 'step' : undefined}
                  aria-label={`${txt(c, 'nav', sv)}, ${c.year}`}
                  onClick={() => go(i)}
                >
                  <span className="nav-year">{i === 0 ? (sv ? 'HEM' : 'HOME') : c.year}</span>
                  <span className="nav-name">{txt(c, 'nav', sv)}</span>
                </button>
              ))}
            </nav>
          </footer>
        </main>
      </div>

      <section id="story" className="reading" tabIndex={-1}>
        <div className="reading-head">
          <h2 id="reading-title">{sv ? 'Mina erfarenheter i korthet.' : 'The experience, at a glance.'}</h2>
          <button id="back" onClick={() => go(0)}>{sv ? 'Tillbaka till resan ↑' : 'Back to the journey ↑'}</button>
        </div>
        <div id="read-list">
          {chapters.slice(1).map(c => (
            <article key={c.title} className="read-item">
              <div className="dates">{txt(c, 'date', sv)}</div>
              <div>
                <h3>{txt(c, 'title', sv)}</h3>
                <Details c={c} sv={sv} />
              </div>
            </article>
          ))}
          <Contacts />
        </div>
      </section>
    </>
  );
}
