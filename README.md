# EmotionDetector

EmotionDetector is a free, open-source browser application that estimates visible facial expressions from a webcam in real time. Camera frames stay in the browser; no video, face images, or biometric data are uploaded or stored.

## Features

- Real-time browser-side face detection and expression classification
- Seven expression classes: happy, sad, angry, fearful, surprised, disgusted, and neutral
- Actual model confidence and per-class probabilities
- Face bounding boxes and support for more than one face
- Measured FPS and processing time
- In-memory expression history with a lightweight timeline
- Camera start/stop, pause/resume, mirror, bounding-box, and history controls
- No backend, database, API keys, paid APIs, or external AI service
- Responsive interface for desktop, tablet, and mobile

## How It Works

1. The browser requests access to the user's camera.
2. Frames are read from the local `<video>` element.
3. Tiny Face Detector locates faces in each frame.
4. Face Expression Net estimates a probability distribution across seven visible-expression classes.
5. The app draws face boxes, shows the highest-probability expression, and records a short in-memory history.

## Machine Learning

The app uses the open-source `@vladmandic/face-api` browser library:

- **Face detector:** Tiny Face Detector
- **Expression model:** Face Expression Net
- **Output classes:** neutral, happy, sad, angry, fearful, disgusted, surprised
- **Inference:** TensorFlow.js-compatible inference running in the user's browser
- **Model assets:** loaded from the public `@vladmandic/face-api` model distribution at runtime; the app reports loading failures instead of silently switching to fake data

The upstream face-api model distribution does not publish a complete, verifiable dataset and training recipe for the expression network in its browser package documentation. This project therefore does not claim a specific dataset such as FER-2013. The label set is FER-style, but the model's exact training provenance should be treated as an upstream limitation.

## Privacy

Your camera feed is processed locally on your device. No video or images are uploaded or stored. Expression history exists only in memory and is cleared when the page is refreshed or when you use Clear History.

Camera access is controlled by the browser. Stop Camera releases the active `MediaStream` tracks and stops inference.

## Limitations

This application estimates visible facial expressions. It does not reliably determine a person's true internal emotional state and is not a medical, psychological, or diagnostic tool.

Results can vary with:

- Lighting, shadows, and camera quality
- Face angle, occlusion, glasses, and distance from the camera
- Differences between the model's training data and real-world faces
- Device CPU/GPU performance and browser support
- Multiple faces in a frame; more faces can reduce throughput

Confidence is model output, not a guarantee of correctness.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- `@vladmandic/face-api`
- TensorFlow.js-compatible browser inference

## Local Development

This repository uses pnpm workspaces:

```bash
pnpm install
pnpm --filter @workspace/emotion-detector run dev
```

The managed preview supplies the `PORT` and `BASE_PATH` environment variables required by Vite.

## Production Build

```bash
pnpm install
pnpm --filter @workspace/emotion-detector run build
```

The static output is written to `artifacts/emotion-detector/dist/public`.

## Render Deployment

`render.yaml` configures EmotionDetector as a Render Static Site. Render runs `npm run build` and serves `artifacts/emotion-detector/dist/public`.

For a plain Render deployment outside this workspace, use:

```bash
pnpm install
pnpm --filter @workspace/emotion-detector run build
```

Then set the static publish directory to `artifacts/emotion-detector/dist/public`.

No environment variables or API keys are required for the application.

## License

The application source is MIT licensed. The application depends on the upstream `@vladmandic/face-api` and its model assets; review and preserve the upstream license notices when redistributing the model files or building a bundled distribution.