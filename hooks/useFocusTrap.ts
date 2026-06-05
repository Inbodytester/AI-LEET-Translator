import { useEffect, useRef, type RefObject } from 'react';
import { getFocusableElements, handleFocusTrapKeyDown } from '../utils/focusTrap';

export const useFocusTrap = (
  containerRef: RefObject<HTMLElement | null>,
  isActive: boolean,
  onEscape?: () => void
): void => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    const focusable = getFocusableElements(container);
    (focusable[0] ?? container).focus();

    const handleKeyDown = (e: KeyboardEvent) => handleFocusTrapKeyDown(container, e, onEscape);

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isActive, onEscape, containerRef]);
};