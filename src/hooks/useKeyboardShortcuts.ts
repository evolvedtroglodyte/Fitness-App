import { useEffect, useRef } from 'react';

type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  cmd?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
};

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

      shortcutsRef.current.forEach((shortcut) => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? (isMac ? event.metaKey : event.ctrlKey) : true;
        const cmdMatch = shortcut.cmd ? event.metaKey : true;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && cmdMatch && shiftMatch && altMatch) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.handler(event);
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}

// Global keyboard shortcuts for the app
export function useGlobalKeyboardShortcuts(
  onSave?: () => void,
  onUndo?: () => void,
  onSearch?: () => void,
  onFullscreen?: (section: 'calorie' | 'cardio' | 'fitness' | null) => void,
  onNavigate?: (direction: 'left' | 'right') => void
) {
  const shortcuts: KeyboardShortcut[] = [];

  if (onSave) {
    shortcuts.push({
      key: 's',
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        onSave();
      },
    });
  }

  if (onUndo) {
    shortcuts.push({
      key: 'z',
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        onUndo();
      },
    });
  }

  if (onSearch) {
    shortcuts.push({
      key: 'k',
      ctrl: true,
      handler: (e) => {
        e.preventDefault();
        onSearch();
      },
    });
  }

  if (onFullscreen) {
    // Space bar for fullscreen toggle
    shortcuts.push({
      key: ' ',
      preventDefault: false, // Let handler decide whether to prevent default
      handler: (e) => {
        // Only trigger if not in an input field or contentEditable element
        const target = e.target as HTMLElement;
        const isInputField =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.contentEditable === 'true' ||
          target.closest('input, textarea, [contenteditable="true"]');

        if (!isInputField) {
          e.preventDefault();
          // Toggle fullscreen for focused section
          const focusedSection = document.querySelector('.section-container:hover');
          if (focusedSection) {
            const sectionId = focusedSection.getAttribute('data-section') as
              | 'calorie'
              | 'cardio'
              | 'fitness'
              | null;
            onFullscreen(sectionId);
          }
        }
      },
    });

    // Escape to exit fullscreen
    shortcuts.push({
      key: 'Escape',
      handler: () => onFullscreen(null),
    });
  }

  if (onNavigate) {
    // Tab to navigate right
    shortcuts.push({
      key: 'Tab',
      handler: (e) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          onNavigate(e.shiftKey ? 'left' : 'right');
        }
      },
    });
  }

  useKeyboardShortcuts(shortcuts);
}