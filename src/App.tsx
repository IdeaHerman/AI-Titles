import { useState, useEffect } from 'react';
import { generateTitle } from './lib/generateTitle';

const colorSchemes = [
  { bg: '#E63946', text: '#FFEBEC' },
  { bg: '#1D3557', text: '#E8EEF2' },
  { bg: '#2A9D8F', text: '#FFD166' }, // teal + gold
  { bg: '#E76F51', text: '#FFF1ED' },
  { bg: '#6A4C93', text: '#F0EBFF' },
  { bg: '#F4A261', text: '#1D3557' }, // orange + dark blue
  { bg: '#264653', text: '#E6EDEF' },
  { bg: '#06A77D', text: '#FFE66D' }, // green + yellow
  { bg: '#D62828', text: '#FFEBEB' },
  { bg: '#5465FF', text: '#EDEFFF' },
  { bg: '#8D5B4C', text: '#F5EFED' },
  { bg: '#118AB2', text: '#FFF385' }, // blue + bright yellow
  { bg: '#5F0F40', text: '#F5E6EF' },
  { bg: '#F77F00', text: '#FFF4E6' },
  { bg: '#073B4C', text: '#69DADB' }, // dark teal + cyan
  { bg: '#06D6A0', text: '#1D1D1D' }, // bright teal + dark
  { bg: '#9B2226', text: '#FFEBEC' },
  { bg: '#3A86FF', text: '#90FCF9' }, // blue + light cyan
  { bg: '#BB3E03', text: '#FFEDE6' },
  { bg: '#6930C3', text: '#FFC857' }, // purple + gold
  { bg: '#007F5F', text: '#E6F4EF' },
  { bg: '#0A9396', text: '#E6F5F6' },
  { bg: '#AE2012', text: '#FFEBEA' },
  { bg: '#4361EE', text: '#FFD23F' }, // blue + golden yellow
  { bg: '#F72585', text: '#FFE9F3' },
  { bg: '#2B2D42', text: '#EDF2F4' },
  { bg: '#8D99AE', text: '#2B2D42' }, // gray + dark
  { bg: '#D90429', text: '#EDF2F4' },
  { bg: '#EF233C', text: '#2B2D42' }, // red + dark
  { bg: '#006BA6', text: '#FFBC42' }, // blue + orange/gold
  { bg: '#0496FF', text: '#FFF7E6' },
  { bg: '#6A4C93', text: '#FFD97D' }, // purple + peach/gold
  { bg: '#1D3557', text: '#F1FAEE' },
  { bg: '#FFD60A', text: '#1D1D1D' }, // bright yellow + dark
  { bg: '#FFC300', text: '#1A1A1A' }, // golden yellow + dark
  { bg: '#FFEA00', text: '#2B2D42' }, // vivid yellow + dark blue
  { bg: '#F4D03F', text: '#1D3557' }, // warm yellow + navy
  { bg: '#FFB627', text: '#2C3E50' }, // amber yellow + dark slate
  { bg: '#1B4332', text: '#E8F5E9' }, // dark forest green + light
  { bg: '#2D6A4F', text: '#F1F8E9' }, // deep green + pale green
  { bg: '#1E5128', text: '#E0F2F1' }, // emerald green + mint
  { bg: '#004D40', text: '#E0F2F1' }, // dark teal green + mint
  { bg: '#14213D', text: '#A8DADC' }, // navy blue + light cyan
  { bg: '#1A237E', text: '#E8EAF6' }, // deep blue + light indigo
  { bg: '#0D47A1', text: '#E3F2FD' }, // royal blue + pale blue
  { bg: '#01579B', text: '#E1F5FE' }, // deep ocean blue + sky
  { bg: '#006064', text: '#E0F7FA' }, // dark cyan + pale cyan
  { bg: '#004D40', text: '#B2DFDB' }, // deep teal + mint
  { bg: '#00695C', text: '#E0F2F1' }, // teal + pale teal
  { bg: '#00838F', text: '#E0F7FA' } // bright teal + pale cyan
];

export default function App() {
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentEmoji, setCurrentEmoji] = useState('');
  const [currentScheme, setCurrentScheme] = useState(colorSchemes[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [creatorTitles, setCreatorTitles] = useState({ natalia: '', isak: '' });

  // Extract first 2 words from a title for comparison
  const getFirstWords = (title: string, wordCount = 2) => {
    return title.trim().split(/\s+/).slice(0, wordCount).join(' ').toLowerCase();
  };

  const getRandomTitle = (previousTitle?: string) => {
    const MAX_ATTEMPTS = 10;
    let attempts = 0;
    let result = generateTitle(Date.now() + Math.random() * 1000);

    while (attempts < MAX_ATTEMPTS) {
      result = generateTitle(Date.now() + attempts * 1000 + Math.random() * 1000);
      if (!previousTitle || getFirstWords(result.title) !== getFirstWords(previousTitle)) {
        return result;
      }
      attempts++;
    }

    return result;
  };

  const getRandomScheme = () => {
    return colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
  };

  const handleNext = () => {
    setIsAnimating(true);

    setTimeout(() => {
      const { title, emoji } = getRandomTitle(currentTitle);
      setCurrentTitle(title);
      setCurrentEmoji(emoji);
      setCurrentScheme(getRandomScheme());
      setIsAnimating(false);
    }, 150);
  };

  useEffect(() => {
    // Initialize with first title and creator titles
    const initial = getRandomTitle();
    setCurrentTitle(initial.title);
    setCurrentEmoji(initial.emoji);
    setCurrentScheme(getRandomScheme());
    setCreatorTitles({
      natalia: getRandomTitle().title,
      isak: getRandomTitle().title
    });

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !showAbout) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Update on currentTitle change for keyboard event
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !showAbout) {
        e.preventDefault();
        handleNext();
      }
    };

    window.removeEventListener('keydown', handleKeyPress);
    window.addEventListener('keydown', handleKeyPress);
    
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentTitle, showAbout]);

  // Setup initial meta tags and update theme-color when color scheme changes
  useEffect(() => {
    // Initialize meta tags on first load
    const initializeMeta = () => {
      // Add apple-mobile-web-app-capable for iOS
      if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
        const metaAppleCapable = document.createElement('meta');
        metaAppleCapable.name = 'apple-mobile-web-app-capable';
        metaAppleCapable.content = 'yes';
        document.head.appendChild(metaAppleCapable);
      }
      
      // Add apple-mobile-web-app-status-bar-style for iOS
      if (!document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')) {
        const metaAppleStatusBar = document.createElement('meta');
        metaAppleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
        metaAppleStatusBar.content = 'black-translucent';
        document.head.appendChild(metaAppleStatusBar);
      }
    };
    
    initializeMeta();
  }, []);

  // Update page color (background + theme-color meta) - INSTANT with zero fade
  useEffect(() => {
    const setThemeColorInstant = (hex: string) => {
      const root = document.documentElement;
      root.classList.add('no-animate');

      // Force style flush so the no-animate takes effect immediately
      void root.offsetWidth;

      // Update page background instantly via CSS variable
      root.style.setProperty('--bg', hex);
      document.documentElement.style.background = hex;
      document.body.style.background = hex;

      // Update meta theme-color (address bar on mobile)
      let meta = document.querySelector('meta[name="theme-color"]:not([media])');
      if (!meta) {
        meta = document.createElement('meta');
        (meta as HTMLMetaElement).name = 'theme-color';
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', hex);

      // Remove the block on the next frame
      requestAnimationFrame(() => {
        root.classList.remove('no-animate');
      });
    };
    
    const themeColor = showAbout ? '#ffffff' : currentScheme.bg;
    setThemeColorInstant(themeColor);
  }, [currentScheme.bg, showAbout]);

  if (showAbout) {
    return (
      <>
        <div
          className="min-h-[100dvh] size-full flex flex-col justify-between pt-[72px] px-6 pb-6 md:p-16 overflow-hidden"
          style={{ 
            color: '#000000'
          }}
        >
          {/* Header with Close link */}
          <div className="absolute top-8 right-8 md:top-16 md:right-16">
            <button
              onClick={() => setShowAbout(false)}
              className="transition-opacity duration-150 hover:opacity-70"
              style={{
                fontSize: '20px',
                fontWeight: 300,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                opacity: 0.6
              }}
            >
              Close
            </button>
          </div>

          {/* About content */}
          <div className="flex-1 flex flex-col justify-center max-w-3xl">
            <h1
              className="mb-6 md:mb-10"
              style={{
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                fontWeight: 500,
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}
            >
              About
            </h1>

            <div
              className="space-y-6 md:space-y-10"
              style={{
                fontSize: 'clamp(1.125rem, 3.5vw, 1.75rem)',
                lineHeight: 1.5,
                opacity: 0.9
              }}
            >
              <p>
                These job titles are satirical — a playful commentary on the ever-evolving landscape of AI, design, and startup culture.
              </p>

              <div className="pt-2 md:pt-4">
                <p style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', letterSpacing: '0.02em', opacity: 0.6, marginBottom: '1rem' }}>
                  Created by <a href="https://alkemist.no" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity">Alkemist</a>:
                </p>
                <p style={{ marginBottom: '1.5rem' }}>
                  Natalia Mojzych<br />
                  <span style={{ opacity: 0.7, fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>{creatorTitles.natalia}</span>
                </p>
                <p>
                  Isak Gundrosen<br />
                  <span style={{ opacity: 0.7, fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>{creatorTitles.isak}</span>
                </p>
              </div>

              <div className="pt-2 md:pt-4">
                <p style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', letterSpacing: '0.02em', opacity: 0.6, marginBottom: '1rem' }}>
                  Inspired by:
                </p>
                <p style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)' }}>
                  <a 
                    href="https://designtitles.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:opacity-70 transition-opacity"
                  >
                    designtitles.com
                  </a>
                  <br />
                  <a 
                    href="https://siliconvalleyjobtitlegenerator.tumblr.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:opacity-70 transition-opacity"
                  >
                    Silicon Valley Job Title Generator
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="min-h-[100dvh] size-full flex flex-col justify-between py-8 px-6 md:p-16 cursor-pointer overflow-hidden"
        style={{ 
          color: currentScheme.text
        }}
        onClick={handleNext}
      >
        {/* Header with About link */}
        <div className="absolute top-8 right-6 md:top-16 md:right-16">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAbout(true);
            }}
            className="transition-opacity duration-150 hover:opacity-70"
            style={{
              fontSize: '20px',
              fontWeight: 300,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              opacity: 0.6
            }}
          >
            About
          </button>
        </div>

        <div className="flex-1 flex items-center pr-0 md:pr-16 pt-12 pb-20 md:pt-0 md:pb-0">
          <div className="w-[97%] md:max-w-[90%]">
            <div
              className="transition-opacity duration-150"
              style={{ opacity: isAnimating ? 0.3 : 1 }}
            >
              <div style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1, marginBottom: '0.3em' }}>
                {currentEmoji}
              </div>
              <h1
                className="text-[48px] leading-[52px] min-[744px]:text-[72px] min-[744px]:leading-[1.15] lg:text-[96px] lg:leading-[1.15]"
                style={{
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  wordBreak: 'normal'
                }}
              >
                {currentTitle}
              </h1>
            </div>
          </div>
        </div>

        {/* Keycap button - bottom right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute bottom-8 right-6 md:bottom-16 md:right-16"
          style={{
            opacity: isAnimating ? 0.3 : 1,
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            padding: 0
          }}
          aria-label="Generate next title"
        >
          <article className="keycap">
            <aside className="letter">NEXT</aside>
          </article>
        </button>
      </div>
    </>
  );
}