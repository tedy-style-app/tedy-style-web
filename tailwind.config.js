/** @type {import('tailwindcss').Config} */
// Design tokens lifted directly from the mobile app's redesign
// (lib/core/theme/fit_palette.dart) — warm beige surfaces, espresso primary,
// muted-gold accent. The whole marketing site now matches the app 1:1.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Espresso — primary dark (buttons, wordmark, FAB).
        espresso: {
          DEFAULT: '#3E322A',
          dark: '#2B221B',
          soft: '#4A3B31',
        },
        // Muted gold — the app's single accent (eyebrows, MAX tier, sparkle).
        gold: {
          DEFAULT: '#CB9A5C',
          soft: '#D9B77E',
        },
        // Warm beiges — cards / washes / section backgrounds.
        beige: {
          DEFAULT: '#E9E0D2',
          soft: '#F0EADF',
          muted: '#E5DBCB',
        },
        cream: {
          DEFAULT: '#FBF8F1', // raised light surface
          tint: '#F7F2E9', // tinted section background
        },
        // Text — warm near-black through to muted taupe.
        ink: {
          DEFAULT: '#2B241E',
          2: '#6E6154',
          3: '#A89B8B',
        },
        hair: '#EEE8DD', // hairline dividers
        line: '#E7DFD1', // borders
        online: '#5B9E5E', // "free / available" green
        like: '#C0685C', // soft warm red (hearts in mockups)
        page: '#F4EEE5', // app background
        onEspresso: '#F7F2EA', // cream text on espresso
      },
      fontFamily: {
        // The app uses the system face (SF Pro on iOS) — mirror it on web for
        // a faithful, zero-dependency, fast-loading look.
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'system-ui',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        '4xl': '24px',
        '5xl': '30px',
        '6xl': '36px',
      },
      boxShadow: {
        // fit_palette.dart — very low alpha, warm, soft.
        soft: '0 6px 20px rgba(23,16,8,0.05)',
        card: '0 10px 26px rgba(23,16,8,0.06)',
        float: '0 20px 44px rgba(23,16,8,0.09)',
        glow: '0 12px 28px rgba(62,50,42,0.26)',
        'glow-soft': '0 8px 20px rgba(62,50,42,0.18)',
        phone:
          '0 44px 90px rgba(43,34,27,0.20), 0 14px 30px rgba(23,16,8,0.10), inset 0 0 0 1.5px rgba(255,255,255,0.65)',
      },
      backgroundImage: {
        'grad-espresso': 'linear-gradient(135deg, #4A3C31, #34291F)',
        'grad-gold': 'linear-gradient(135deg, #D9B77E, #CB9A5C)',
        'grad-beige':
          'radial-gradient(circle at 50% 35%, #EFE7D8, rgba(233,224,210,0) 70%)',
        'grad-tile': 'linear-gradient(150deg, #FBF8F1, #F1E9DA)',
      },
      transitionTimingFunction: {
        // app_motion.dart
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        pulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(203,154,92,.5)' },
          '70%': { boxShadow: '0 0 0 8px rgba(203,154,92,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(203,154,92,0)' },
        },
      },
      animation: {
        pulse: 'pulse 2s infinite',
      },
    },
  },
  plugins: [],
}
