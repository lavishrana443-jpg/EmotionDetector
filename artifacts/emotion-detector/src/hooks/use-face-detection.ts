import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import * as faceapi from '@vladmandic/face-api';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
let modelLoadPromise: Promise<void> | null = null;

export type ExpressionName = 'neutral' | 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised';
export type FaceResult = {
  box: { x: number; y: number; width: number; height: number };
  expressions: Record<ExpressionName, number>;
  dominant: ExpressionName;
  confidence: number;
};

type DetectorState = 'idle' | 'loading' | 'ready' | 'running' | 'error';

export function useFaceDetection(videoRef: RefObject<HTMLVideoElement | null>, overlayRef: RefObject<HTMLCanvasElement | null>) {
  const [state, setState] = useState<DetectorState>('idle');
  const [faces, setFaces] = useState<FaceResult[]>([]);
  const [fps, setFps] = useState(0);
  const [processingMs, setProcessingMs] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const pausedRef = useRef(false);
  const lastTickRef = useRef(performance.now());
  const frameCountRef = useRef(0);
  const modelReadyRef = useRef(false);
  const trackEndedRef = useRef<(() => void) | null>(null);

  const drawFaces = useCallback((results: FaceResult[], video: HTMLVideoElement, canvas: HTMLCanvasElement) => {
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    results.forEach((face) => {
      const { x, y, width, height } = face.box;
      ctx.strokeStyle = '#5ce0c0';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = 'rgba(92, 224, 192, .9)';
      ctx.fillRect(x, Math.max(0, y - 24), Math.min(142, width), 24);
      ctx.fillStyle = '#0f171d';
      ctx.font = '600 12px "DM Mono", monospace';
      ctx.fillText(`${face.dominant} ${Math.round(face.confidence * 100)}%`, x + 8, Math.max(16, y - 8));
    });
  }, []);

  const stop = useCallback(() => {
    runningRef.current = false;
    pausedRef.current = false;
    setPaused(false);
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    const endedHandler = trackEndedRef.current;
    streamRef.current?.getVideoTracks().forEach((track) => {
      if (endedHandler) track.removeEventListener('ended', endedHandler);
      track.stop();
    });
    streamRef.current?.getAudioTracks().forEach((track) => track.stop());
    streamRef.current = null;
    trackEndedRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setFaces([]);
    setFps(0);
    setState('idle');
    const canvas = overlayRef.current;
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  }, [overlayRef]);

  const start = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      setError(null);
      setState('loading');
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access is not available in this browser.');
      if (!modelReadyRef.current) {
        if (!modelLoadPromise) {
          modelLoadPromise = Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          ]).then(() => undefined);
        }
        try {
          await modelLoadPromise;
          modelReadyRef.current = true;
        } catch (modelError) {
          modelLoadPromise = null;
          throw modelError;
        }
      }
      streamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
      const handleTrackEnded = () => {
        stop();
        setError('The camera was disconnected. Reconnect it and try again.');
        setState('error');
      };
      trackEndedRef.current = handleTrackEnded;
      streamRef.current.getVideoTracks().forEach((track) => track.addEventListener('ended', handleTrackEnded));
      video.srcObject = streamRef.current;
      await video.play();
      runningRef.current = true;
      pausedRef.current = false;
      setPaused(false);
      setState('running');
      lastTickRef.current = performance.now();
      frameCountRef.current = 0;
      const detect = async () => {
        if (!runningRef.current || !videoRef.current) return;
        if (pausedRef.current) {
          frameRef.current = requestAnimationFrame(detect);
          return;
        }
        const started = performance.now();
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })).withFaceExpressions();
        if (!runningRef.current) return;
        const mapped = detections.map((d) => {
          const expressions = d.expressions as unknown as Record<ExpressionName, number>;
          const dominant = (Object.entries(expressions).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral') as ExpressionName;
          return { box: d.detection.box, expressions, dominant, confidence: expressions[dominant] };
        });
        setFaces(mapped);
        setProcessingMs(Math.round(performance.now() - started));
        frameCountRef.current += 1;
        const now = performance.now();
        if (now - lastTickRef.current >= 1000) {
          setFps(frameCountRef.current);
          frameCountRef.current = 0;
          lastTickRef.current = now;
        }
        if (overlayRef.current) drawFaces(mapped, video, overlayRef.current);
        frameRef.current = requestAnimationFrame(detect);
      };
      frameRef.current = requestAnimationFrame(detect);
    } catch (caught) {
      stop();
      const message = caught instanceof DOMException && caught.name === 'NotAllowedError'
        ? 'Camera permission was declined. Allow camera access to start local detection.'
        : caught instanceof Error ? caught.message : 'The model could not start in this browser.';
      setError(message);
      setState('error');
    }
  }, [drawFaces, overlayRef, stop, videoRef]);

  const togglePause = useCallback(() => {
    setPaused((value) => {
      pausedRef.current = !value;
      return !value;
    });
  }, []);

  useEffect(() => stop, [stop]);
  return { state, faces, fps, processingMs, error, start, stop, togglePause, paused, modelsReady: state === 'ready' || state === 'running' };
}