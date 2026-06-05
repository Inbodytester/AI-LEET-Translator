import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { getFocusableElements, handleFocusTrapKeyDown } from './focusTrap';

describe('focusTrap', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <button id="first">First</button>
      <button id="second">Second</button>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('finds focusable elements inside container', () => {
    const elements = getFocusableElements(container);
    expect(elements).toHaveLength(2);
    expect(elements[0].id).toBe('first');
  });

  it('wraps Tab from last element to first', () => {
    const second = container.querySelector('#second') as HTMLButtonElement;
    second.focus();

    const event = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true });
    const preventSpy = vi.spyOn(event, 'preventDefault');

    handleFocusTrapKeyDown(container, event);

    expect(preventSpy).toHaveBeenCalled();
    expect(document.activeElement?.id).toBe('first');
  });

  it('wraps Shift+Tab from first element to last', () => {
    const first = container.querySelector('#first') as HTMLButtonElement;
    first.focus();

    const event = new KeyboardEvent('keydown', {
      key: 'Tab',
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    const preventSpy = vi.spyOn(event, 'preventDefault');

    handleFocusTrapKeyDown(container, event);

    expect(preventSpy).toHaveBeenCalled();
    expect(document.activeElement?.id).toBe('second');
  });

  it('calls onEscape when Escape is pressed', () => {
    const onEscape = vi.fn();
    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });

    handleFocusTrapKeyDown(container, event, onEscape);

    expect(onEscape).toHaveBeenCalledOnce();
  });
});