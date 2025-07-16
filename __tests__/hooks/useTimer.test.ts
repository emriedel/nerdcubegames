import { renderHook, act } from '@testing-library/react';
import { useTimer } from '@/hooks/useTimer';

// Mock timers
jest.useFakeTimers();

describe('useTimer', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should initialize with correct initial time', () => {
    const { result } = renderHook(() => useTimer(60));
    
    expect(result.current.timeRemaining).toBe(60);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(false);
  });

  it('should start timer correctly', () => {
    const { result } = renderHook(() => useTimer(60));
    
    act(() => {
      result.current.start();
    });
    
    expect(result.current.isRunning).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });

  it('should countdown when running', () => {
    const { result } = renderHook(() => useTimer(60));
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.timeRemaining).toBe(59);
  });

  it('should pause and resume correctly', () => {
    const { result } = renderHook(() => useTimer(60));
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.timeRemaining).toBe(59);
    
    act(() => {
      result.current.pause();
    });
    
    expect(result.current.isPaused).toBe(true);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    // Should not countdown when paused
    expect(result.current.timeRemaining).toBe(59);
    
    act(() => {
      result.current.resume();
    });
    
    expect(result.current.isPaused).toBe(false);
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    
    expect(result.current.timeRemaining).toBe(58);
  });

  it('should call onTimeUp when timer reaches zero', () => {
    const onTimeUp = jest.fn();
    const { result } = renderHook(() => useTimer(2, onTimeUp));
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(result.current.timeRemaining).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(onTimeUp).toHaveBeenCalledTimes(1);
  });

  it('should reset timer correctly', () => {
    const { result } = renderHook(() => useTimer(60));
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    expect(result.current.timeRemaining).toBe(50);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.timeRemaining).toBe(60);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(false);
  });

  it('should format time correctly', () => {
    const { result } = renderHook(() => useTimer(125)); // 2:05
    
    expect(result.current.formattedTime).toBe('2:05');
    
    act(() => {
      result.current.reset(65); // 1:05
    });
    
    expect(result.current.formattedTime).toBe('1:05');
    
    act(() => {
      result.current.reset(5); // 0:05
    });
    
    expect(result.current.formattedTime).toBe('0:05');
  });

  it('should calculate time percentage correctly', () => {
    const { result } = renderHook(() => useTimer(100));
    
    expect(result.current.timePercentage).toBe(100);
    
    act(() => {
      result.current.start();
    });
    
    act(() => {
      jest.advanceTimersByTime(25000);
    });
    
    expect(result.current.timePercentage).toBe(75);
  });
});