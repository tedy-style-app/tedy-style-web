/** @type {import('tailwindcss').Config} */
// Design tokens lifted directly from the Flutter app (lib/core/theme/*).
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // app_colors.dart
        orange: {
          DEFAULT: '#FF8C42', // primary
          light: '#FFB07A', // primaryLight
          dark: '#E67035', // primaryDark / secondary
        },
        peach: {
          mid: '#FFD9BE', // peachWash inner
          whisper: '#FFF4EC', // logo background
          tint: '#FFF8F3', // surfaceTinted
        },
        ink: {
          DEFAULT: '#1A1A1A', // textPrimary
          2: '#6B6B6B', // textSecondary
          3: '#9E9E9E', // textMuted
        },
        hair: '#F0EAE4',
        line: '#E9E2DC',
        like: '#E53935',
        page: '#FFFCFA',
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '28px',
        '5xl': '32px',
      },
      boxShadow: {
        // app_shadows.dart — very low alpha, soft
        card: '0 8px 24px rgba(26,18,12,0.06)',
        soft: '0 4px 16px rgba(26,18,12,0.05)',
        float: '0 12px 32px rgba(26,18,12,0.08)',
        glow: '0 8px 26px rgba(255,140,66,0.34)',
        'glow-soft': '0 6px 20px rgba(255,159,102,0.22)',
        phone:
          '0 40px 80px rgba(230,112,53,0.16), 0 12px 28px rgba(26,18,12,0.10), inset 0 0 0 1.5px rgba(255,255,255,0.7)',
      },
      backgroundImage: {
        'grad-primary': 'linear-gradient(135deg, #FFB07A, #FF8C42)',
        'grad-peach':
          'radial-gradient(circle at 50% 35%, #FFD9BE, rgba(255,176,122,0) 70%)',
        'grad-tile': 'linear-gradient(150deg, #FFF8F3, #FFF4EC)',
      },
      transitionTimingFunction: {
        // app_motion.dart
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        pulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(255,140,66,.5)' },
          '70%': { boxShadow: '0 0 0 8px rgba(255,140,66,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255,140,66,0)' },
        },
      },
      animation: {
        pulse: 'pulse 2s infinite',
      },
    },
  },
  plugins: [],
}
